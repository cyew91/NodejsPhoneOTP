CREATE TABLE IF NOT EXISTS `inoic-woocommerce-express`.`user_product_view_log` (
  `id` INT NOT NULL,
  `user_id` VARCHAR(45) NULL,
  `product_id` VARCHAR(45) NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));