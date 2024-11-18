CREATE TABLE `article`
(
    `id`         INT AUTO_INCREMENT NOT NULL,
    `name`       VARCHAR(256)       NOT NULL,
    `content`    MEDIUMTEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `created_by` INT                NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `article_created_by_fk` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`)
);