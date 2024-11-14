const responseCode = require("../config/env.response");
const UserModels = require("../models/UserModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  registerUserValidation,
  loginUserValidation,
} = require("../validation/user-validation");

const moment = require("moment");

const UserControllers = (module.exports = {
  RegisterUser: async function (req, res) {
    let apiResult = {};

    try {
      let userData = {
        ...req.body,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      };

      // Check Validation
      let { error } = registerUserValidation.validate(userData);
      if (error) {
        apiResult.meta = responseCode.Fail.validationError;
        apiResult.meta.error += error.details[0].message;

        return res.status(400).json(apiResult);
      }

      // Generate hash the password
      let salt = bcrypt.genSaltSync(10);
      let hashedUserPassword = await bcrypt.hash(userData.password, salt);

      // Update userData with hashed password
      userData.password = hashedUserPassword;

      // Check if email already exists
      let existingUser = await UserModels.GetUserByEmail(userData.email);
      if (existingUser) {
        apiResult.meta = responseCode.Fail.emailExist;

        return res.status(400).json(apiResult);
      }

      let insertId = await UserModels.Insert(userData);

      apiResult.meta = responseCode.Success.RegisterUser;
      apiResult.data = {
        ...insertId,
        name: req.body.name,
        email: req.body.email,
      };

      res.status(200).json(apiResult);
    } catch (error) {
      apiResult.meta = responseCode.Fail.ErFail;
      apiResult.meta.message += error.message;

      res.status(400).json(apiResult);
    }
  },

  loginUser: async function (req, res) {
    apiResult = {};

    try {
      let data = {
        email: req.body.email,
        password: req.body.password,
      };

      // Validate user input
      const { error } = loginUserValidation.validate(data);
      if (error) {
        apiResult.meta = responseCode.Fail.validationError;
        apiResult.meta.error += error.details[0].message;

        return res.status(400).json(apiResult);
      }

      // Check if user not exists
      const user = await UserModels.GetUserByEmail(data.email);
      if (!user) {
        apiResult.meta = responseCode.Fail.emailNotExist;

        return res.status(400).json(apiResult);
      }

      // Compare password
      const validPassword = await bcrypt.compare(data.password, user.password);
      if (!validPassword) {
        apiResult.meta = responseCode.Fail.invalidCredentials;

        return res.status(400).json(apiResult);
      }

      // Create and sign a JWT token
      const name = user.name;
      const email = user.email;
      const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });

      // Refresh token
      const refreshToken = jwt.sign(
        { email },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );

      // Update token
      await UserModels.UpdateToken(user.id, accessToken, refreshToken);

      // Send cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 100,
      });

      // Return the token
      apiResult.meta = responseCode.Success.validCredentials;
      apiResult.data = {
        // ...insertId,
        token: accessToken,
        name: name,
        email: email,
      };

      res.status(200).json(apiResult);
    } catch (error) {
      apiResult.meta = responseCode.Fail.ErFail;
      apiResult.meta.message += error.message;

      res.status(400).json(apiResult);
    }
  },

  logoutUser: async function (req, res) {
    let apiResult = {};

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      apiResult.meta = responseCode.Fail.notContent;

      return res.status(204).json(apiResult);
    }

    let user = await UserModels.GetUserByToken(refreshToken);
    if (!user) {
      apiResult.meta = responseCode.Fail.notContent;

      return res.status(204).json(apiResult);
    }

    const userId = user.id;
    await UserModels.UpdateToken(userId, null, null);

    res.clearCookie("refreshToken");

    apiResult.meta = responseCode.Success.logoutUser;
    res.status(200).json(apiResult);
  },

  getUserProfile: async function (req, res) {
    let apiResult = {};

    try {
      // Check if user not exist
      if (!req.user) {
        apiResult.meta = responseCode.Fail.dataNotFound;

        return res.status(404).json(apiResult);
      }

      const email = req.user.email;

      const user = await UserModels.GetUserByEmail(email);
      if (!user) {
        apiResult.meta = responseCode.Fail.emailNotExist;

        return res.status(400).json(apiResult);
      }

      // Return user
      apiResult.meta = responseCode.Success.getUserProfile;
      apiResult.data = {
        name: user.name,
        email: user.email,
        created_at: moment(user.created_at).format("YYYY-MM-DD HH:mm:ss"),
      };

      res.status(200).json(apiResult);
    } catch (error) {
      apiResult.meta = responseCode.Fail.ErFail;
      apiResult.meta.message += error.message;

      res.status(400).json(apiResult);
    }
  },
});
