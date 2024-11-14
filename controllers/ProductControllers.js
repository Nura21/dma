const rescode = require("../config/env.response");
const ProductModels = require("../models/ProductModels");
const { productValidation } = require("../validation/product-validation");
const file_helpers = require("../library/fileHelpers");
const moment = require("moment");
const fs = require("fs");
const sharp = require("sharp");

const ProductControllers = (module.exports = {
  Index: async (req, res) => {
    let apiResult = {};
    try {
      let { id } = req?.params;
      let { type } = req?.body;
      let data = await ProductModels.GetAll(id, type);

      apiResult.meta = rescode.Success.GetProduct;
      apiResult.data = data;

      res.status(200).json(apiResult);
    } catch (error) {
      apiResult.meta = rescode.Fail.ErFail;
      apiResult.meta.message += error.message;

      res.status(400).json(apiResult);
    }
  },
  Create: async (req, res) => {
    let apiResult = {};
    try {
      let data = {
        ...req.body,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      // Check Validation
      let { error } = productValidation.validate(data);
      if (error) {
        apiResult.meta = rescode.Fail.validationError;
        apiResult.meta.error += error.details[0].message;

        return res.status(400).json(apiResult);
      }

      // // Save image as base64 string
      // if (req.body.image != undefined) {
      //   let imageName = await file_helpers.save(
      //     `image_${moment().unix()}.jpg`,
      //     "product",
      //     req.body.image
      //   );
      //   data.image = imageName;
      // } else {
      //   data.image = "default.png";
      // }

      // Save image as base64 string
      if (req.body.image != undefined) {
        let compressedBase64Image;
        try {
          const base64Image = req.body.image;
          const buffer = Buffer.from(base64Image, "base64");

          // Compress the image using sharp
          const compressedImageBuffer = await sharp(buffer)
            .resize({ width: 800 }) // Adjust the desired width as needed
            .toBuffer();

          compressedBase64Image = compressedImageBuffer.toString("base64");
        } catch (error) {
          console.error("Error compressing image:", error);
          // Handle the error appropriately (e.g., return an error response)
          return res.status(500).send({ error: "Error compressing image" });
        }

        let imageName = await file_helpers.save(
          `image_${moment().unix()}.jpg`,
          "product",
          compressedBase64Image
        );
        data.image = imageName;
      } else {
        data.image = "default.png";
      }

      let insertId = await ProductModels.Insert(data);

      apiResult.meta = rescode.Success.InsertProduct;
      apiResult.data = {
        ...insertId,
        ...req.body,
      };

      res.status(200).json(apiResult);
    } catch (error) {
      apiResult.meta = rescode.Fail.ErFail;
      apiResult.meta.message += error.message;

      res.status(400).json(apiResult);
    }
  },
  Delete: async (req, res) => {
    let apiResult = {};
    try {
      let { id } = req.params;
      let data = await ProductModels.Delete(id);

      console.log(data);

      apiResult.meta = rescode.Success.DeleteProduct;
      apiResult.data = data;

      res.status(200).json(apiResult);
    } catch (error) {
      apiResult.meta = rescode.Fail.ErFail;
      apiResult.meta.message += error.message;

      res.status(400).json(apiResult);
    }
  },
  Update: async (req, res) => {
    let apiResult = {};
    try {
      let data = {
        ...req.body,
        updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      };

      let { id } = req.params;

      let { error } = productValidation.validate(data);
      if (error) {
        apiResult.meta = rescode.Fail.validationError;
        apiResult.meta.error += error.details[0].message;

        return res.status(400).json(apiResult);
      }

      // Save image as base64 string
      if (req.body.image != undefined && req.body.image != "") {
        let compressedBase64Image;
        try {
          const base64Image = req.body.image;
          const buffer = Buffer.from(base64Image, "base64");

          // Compress the image using sharp
          const compressedImageBuffer = await sharp(buffer)
            .resize({ width: 800 }) // Adjust the desired width as needed
            .toBuffer();

          compressedBase64Image = compressedImageBuffer.toString("base64");
        } catch (error) {
          console.error("Error compressing image:", error);
          // Handle the error appropriately (e.g., return an error response)
          return res.status(500).send({ error: "Error compressing image" });
        }

        let imageName = await file_helpers.save(
          `image_${moment().unix()}.jpg`,
          "product",
          compressedBase64Image
        );
        data.image = imageName;
      }

      let updateId = await ProductModels.Update(data, id);

      apiResult.meta = rescode.Success.UpdateProduct;
      apiResult.data = {
        ...updateId,
        ...req.body,
      };

      res.status(200).json(apiResult);
    } catch (error) {
      apiResult.meta = rescode.Fail.ErFail;
      apiResult.meta.message += error.message;

      res.status(400).json(apiResult);
    }
  },
});
