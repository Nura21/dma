const responseCode = require("../config/env.response");
const jwt = require("jsonwebtoken");
const UserModels = require("../models/UserModels");
const { decode } = require("punycode");
const { log } = require("console");

const RefreshTokenControllers = async (req, res) => {
  let apiResult = {};
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      apiResult.meta = responseCode.Fail.unauthenticated;

      return res.status(401).json(apiResult);
    }

    let user = await UserModels.GetUserByToken(refreshToken);
    if (!user) {
      apiResult.meta = responseCode.Fail.forbidden;

      return res.status(403).json(apiResult);
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          apiResult.meta = responseCode.Fail.unauthenticated;

          return res.status(401).json(apiResult);
        }

        const email = user.email;

        const accessToken = jwt.sign(
          { email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        apiResult.meta = responseCode.Success.authenticated;
        apiResult.data = {
          access_token: accessToken,
        };
        return res.status(200).json(apiResult);
      }
    );
  } catch (error) {
    apiResult.meta = responseCode.Fail.ErFail;
    apiResult.meta.message += error.message;

    res.status(400).json(apiResult);
  }
};

module.exports = RefreshTokenControllers;
