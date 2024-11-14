const fs = require("fs");
const rescode = require("../config/env.response");
const TransactionModels = require("../models/TransactionModels");
const generatePDF = require("./pdfGenerator");
const { sendEmailWithAttachment } = require("./emailSender");

const ReportController = (module.exports = {
  Index: async (req, res) => {
    let apiResult = {};
    try {
      let data = req?.body;

      let bestSellingProducts = await TransactionModels.GetBestSellingProducts(
        data
      );
      let totalTransactionsAndPrices =
        await TransactionModels.GetTotalTransactionsAndPrices(data);

      data = {
        bestSellingProducts,
        totalTransactionsAndPrices,
      };

      apiResult.meta = rescode.Success.GetReport;
      apiResult.data = data;

      res.status(200).json(apiResult);
    } catch (error) {
      apiResult.meta = rescode.Fail.ErFail;
      apiResult.meta.message += error.message;

      res.status(400).json(apiResult);
    }
  },
  Exchange: async (req, res) => {
    let apiResult = {};
    let currentUser = req.isAuthenticated
      ? req.user
      : process.env.EMAIL_RECIPIENT;
    try {
      let { id } = req?.params;
      id = parseInt(id);
      let data = req?.body;
      let bestSellingProducts = await TransactionModels.GetBestSellingProducts(
        data
      );

      let totalTransactionsAndPrices =
        await TransactionModels.GetTotalTransactionsAndPrices(data);

      totalTransactionsAndPrices = totalTransactionsAndPrices.map((item) => ({
        ...item,
        transaction: item.total_transactions,
        price: item.total_sum,
      }));

      data = {
        bestSellingProducts,
        totalTransactionsAndPrices,
      };

      if (id === 1) {
        const file = "public/docs/report.pdf";

        fs.access(file, fs.constants.F_OK, (error) => {
          if (error) {
            generatePDF(data);
            console.error("File does not exist.");
          } else {
            generatePDF(data);
            console.log("File exists.");
          }
        });

        res.download(file);
      }

      if (id === 0) {
        (async () => {
          try {
            const file = "public/docs/report.pdf";
            sendEmailWithAttachment(currentUser);
          } catch (error) {
            console.error(error);
          }
        })();

        apiResult.meta = rescode.Success.GetReport;
        apiResult.data = data;

        res.status(200).json(apiResult);
      }

      if (id !== 0 && id !== 1) {
        apiResult.meta = rescode.Fail.ErFail;
        apiResult.meta.message += "Invalid data ID";

        res.status(400).json(apiResult);
      }
    } catch (error) {
      apiResult.meta = rescode.Fail.ErFail;
      apiResult.meta.message += error.message;

      res.status(400).json(apiResult);
    }
  },
});
