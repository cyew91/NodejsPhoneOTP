require("dotenv").config();
const express = require("express");
const { dbConnPool } = require("../config/db");
const pick = require("lodash/pick");
const router = express.Router();

const customResponse = require("../utils/custom_response");

async function resetAddressesIsDefault(params, userId, next) {
   try {
      if (params.is_default) {
         return await dbConnPool.query("UPDATE user_address SET is_default=0 WHERE user_id=? AND type=?", [
            userId,
            params.type
         ]);
      } else {
         return null;
      }
   } catch (error) {
      console.log("error: ", error);
   }
}

/**
 *  Update address
 */
router.put("/api/user/:userId/address/:addressId", async (req, res, next) => {
   try {
      const userId = req.params.userId;
      const addressId = req.params.addressId;
      const params = pick(req.body, [
         "is_default",
         "type",
         "email",
         "address_1",
         "address_2",
         "city",
         "company",
         "country",
         "first_name",
         "last_name",
         "postcode",
         "state"
      ]);

      const isDefaultCheck = resetAddressesIsDefault(params, userId);

      if (isDefaultCheck) {
         const address = await dbConnPool.query("UPDATE user_address SET ? WHERE user_id=? AND id=?", [
            {
               is_default: params.is_default,
               type: params.type,
               email: params.email,
               address_1: params.address_1,
               address_2: params.address_2,
               city: params.city,
               company: params.company,
               country: params.country,
               first_name: params.first_name,
               last_name: params.last_name,
               postcode: params.postcode,
               state: params.state
            },
            userId,
            addressId
         ]);

         customResponse.success(res, { address });
      }
   } catch (error) {
      next(error);
   }
});

/**
 * Delete user's address
 */
router.delete("/api/user/:userId/address/:addressId", async (req, res, next) => {
   try {
      const userId = req.params.userId;
      const addressId = req.params.addressId;

      const addresses = await dbConnPool.query(`UPDATE user_address SET is_active=0 WHERE user_id=? AND id=?`, [
         userId,
         addressId
      ]);
      customResponse.success(res, { addresses });
   } catch (error) {
      next();
   }
});

/**
 * Get all user's address by type
 */
router.get("/api/user/:userId/type/:type", async (req, res, next) => {
   try {
      const userId = req.params.userId;
      const type = req.params.type;

      const addresses = await dbConnPool.query(`SELECT * FROM user_address WHERE user_id=? AND type=? AND is_active=1`, [userId, type]);
      customResponse.success(res, { addresses });
   } catch (error) {
      next();
   }
});

/**
 * Get all user's address
 */
router.get("/api/user/:userId/addresses", async (req, res, next) => {
   try {
      const userId = req.params.userId;

      const addresses = await dbConnPool.query(`SELECT * FROM user_address WHERE user_id=? AND is_active=1`, userId);
      customResponse.success(res, { addresses });
   } catch (error) {
      next();
   }
});

/**
 * Insert new address
 */
router.post("/api/user/address", async (req, res, next) => {
   try {
      console.log("req.body: ", req.body.addresses);

      let addressList = [];

      req.body.addresses.map(address => {
         let addressObj = [];
         addressObj.push(address.user_id);
         addressObj.push(address.type);
         addressObj.push(address.email);
         addressObj.push(address.address_1);
         addressObj.push(address.address_2);
         addressObj.push(address.city);
         addressObj.push(address.company);
         addressObj.push(address.country);
         addressObj.push(address.first_name);
         addressObj.push(address.last_name);
         addressObj.push(address.postcode);
         addressObj.push(address.state);

         addressList.push(addressObj);
      });

      const address = await dbConnPool.query(
         "INSERT INTO user_address (user_id, type, email, address_1, address_2, city, company, country, first_name, last_name, postcode, state) VALUES ? ",
         [addressList]
      );
      customResponse.success(res, { address });
   } catch (error) {
      next(error);
   }
});

/**
 * Get user's most view product
 */
router.get("/api/user/most-view-product/:userId", async (req, res, next) => {
   try {
      const userId = req.params.userId;

      const productList = await dbConnPool.query(
         `SELECT product_id, COUNT(*) AS view_count FROM user_product_view_log WHERE user_id=? GROUP BY product_id ORDER BY COUNT(*) DESC LIMIT 10`,
         userId
      );

      customResponse.success(res, { productList });
   } catch (error) {
      next(error);
   }
});

/**
 * Track user's viewed product
 */
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

router.get("/api/user/most-view-product-all", async (req, res, next) => {
   // const userId = req.params.userId;
   // console.log("userId: ", userId);
   try {
      const productList = await dbConnPool.query(
         `SELECT product_id, COUNT(*) AS view_count FROM user_product_view_log GROUP BY product_id ORDER BY COUNT(*) DESC LIMIT 10`,
      );
      customResponse.success(res, { productList });
   } catch (error) {
      next(error);
   }
});

module.exports = router;
