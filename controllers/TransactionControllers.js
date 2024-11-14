const rescode = require("../config/env.response");
const TransactionModels = require("../models/TransactionModels");
const ProductModels = require("../models/ProductModels");
const monthOrder = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const {
  transactionValidation,
} = require("../validation/transaction-validation");

const moment = require("moment");

const TransactionControllers = (module.exports = {
  Index: async (req, res) => {
    let apiResult = {};
    try {
      let data = await TransactionModels.GetAll();

      apiResult.meta = rescode.Success.GetTransaction;
      apiResult.data = data;

      res.status(200).json(apiResult);
    } catch (error) {
      apiResult.meta = rescode.Fail.ErFail;
      apiResult.meta.message += error.message;

      res.status(400).json(apiResult);
    }
  },
  Income: async (req, res) => {
    let apiResult = {};
    try {
      let data = await TransactionModels.Income();

      const sortedData = data.sort((a, b) => {
        if (a.month === null) return 1; // Let null values go to the end
        if (b.month === null) return -1; // Let null values go to the end
        return monthOrder[a.month] - monthOrder[b.month];
      });

      sortedData.forEach((item) => {
        if (item.total_transactions === 0) {
          item.total_income = 0;
        }
      });

      apiResult.meta = rescode.Success.GetTransaction;
      apiResult.data = sortedData;

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
        ...req?.body,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      };

      // Check Validation
      let { error } = transactionValidation.validate(data);
      if (error) {
        apiResult.meta = rescode.Fail.validationError;
        apiResult.meta.error += error.details[0].message;

        return res.status(400).json(apiResult);
      }

      if (data.product_item != undefined) {
        const productIds = [];
        const productItems = data?.product_item;

        for (let i = 0; i < productItems.length; i++) {
          const productId = productItems[i]?.product_id;
          productIds.push(productId);
        }

        const products = await ProductModels.GetByIds(productIds);
        let code = "T" + Math.floor(Date.now() / 1000);
        let dataTransaction = {
          code,
          total_price: req?.body?.total_price,
          received: req?.body?.received,
          change_received: req?.body?.received - req?.body?.total_price,
          created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        };

        var transaction = await TransactionModels.Insert(
          dataTransaction,
          "transactions"
        );
        for (let i = 0; i < productItems.length; i++) {
          let detailTransaction = {
            transaction_id: transaction?.id,
            product_id: productItems[i]["product_id"],
            qty: productItems[i]["qty"],
            price: productItems[i]["price"],
            created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          };

          let detailTransactionId = await TransactionModels.Insert(
            detailTransaction,
            "transaction_details"
          );
        }
      }

      apiResult.meta = rescode.Success.InsertTransaction;
      apiResult.data = {
        ...transaction, // return data transaction
      };

      res.status(200).json(apiResult);
    } catch (error) {
      apiResult.meta = rescode.Fail.ErFail;
      apiResult.meta.message += error.message;

      res.status(400).json(apiResult);
    }
  },
  // Delete: async (req, res) => {
  //     let apiResult = {}
  //     try {
  //         let { id } = req.params
  //         let data = await TransactionModels.Delete(id)

  //         console.log(data)

  //         apiResult.meta = rescode.Success.DeleteTransaction
  //         apiResult.data = data

  //         res.status(200).json(apiResult)
  //     } catch (error) {
  //         apiResult.meta = rescode.Fail.ErFail
  //         apiResult.meta.message += error.message

  //         res.status(400).json(apiResult)
  //     }
  // },
  Detail: async (req, res) => {
    let apiResult = {};
    try {
      let { id } = req.params;
      let data = await TransactionModels.Detail(id);

      // Transform the data
      let transformedData = {
        id: data[0].transaction_id,
        code: data[0].code,
        total_price: parseFloat(data[0].total_price),
        received: parseFloat(data[0].received),
        change_received: parseFloat(data[0].change_received),
        transaction_detail: data.map((row) => ({
          product_id: row.product_id,
          qty: row.qty,
          price: parseFloat(row.price),
          name: row.name,
          image: row.image,
          description: row.description,
        })),
      };

      apiResult.meta = rescode.Success.GetTransaction;
      apiResult.data = transformedData;

      res.status(200).json(apiResult);
    } catch (error) {
      apiResult.meta = rescode.Fail.ErFail;
      apiResult.meta.message += error.message;

      res.status(400).json(apiResult);
    }
  },
});
