require("dotenv").config();
const express = require("express");
const { dbConnPool } = require("../config/db");
const pick = require("lodash/pick");
const router = express.Router();

const customResponse = require("../utils/custom_response");

router.get("/api/user/most-view-product/:userId", async (req, res, next) => {
   const userId = req.params.userId;
   console.log("userId: ", userId);
   try {
      const productList = await dbConnPool.query(
         `SELECT product_id, COUNT(*) AS view_count FROM user_product_view_log WHERE user_id=? GROUP BY product_id ORDER BY COUNT(*) DESC LIMIT 10`,
         userId
      );
      customResponse.success(res, { productList });
   } catch (error) {
      next(error);
   }
});

router.post("/api/user/track-product-view", async (req, res, next) => {
   try {
      const params = pick(req.body, ["userId", "productId"]);

      const viewProduct = await dbConnPool.query("INSERT INTO user_product_view_log SET ? ", {
         user_id: params.userId,
         product_id: params.productId
      });

      console.log("viewProduct: ", viewProduct);
      customResponse.success(res, { viewProduct });
   } catch (error) {
      next(error);
   }
});

module.exports = router;
