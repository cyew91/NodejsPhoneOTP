CREATE TABLE IF NOT EXISTS `inoic-woocommerce-express`.`user_product_view_log` (
  `id` INT NOT NULL,
  `user_id` VARCHAR(45) NULL,
  `product_id` VARCHAR(45) NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));

  CREATE TABLE IF NOT EXISTS `inoic-woocommerce-express`.`user_address` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(45) NULL,
  `is_active` TINYINT(1) NULL DEFAULT 1,
  `is_default` TINYINT(1) NULL DEFAULT 0,
  `type` VARCHAR(25) NULL,
  `email` VARCHAR(85) NULL,
  `address_1` VARCHAR(255) NULL,
  `address_2` VARCHAR(255) NULL,
  `city` VARCHAR(45) NULL,
  `company` VARCHAR(45) NULL,
  `country` VARCHAR(45) NULL,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `postcode` VARCHAR(45) NULL,
  `state` VARCHAR(45) NULL,
  `updated_adt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));