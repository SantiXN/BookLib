CREATE TABLE `user`
(
    `id`          INT AUTO_INCREMENT NOT NULL,
    `first_name`  VARCHAR(256),
    `last_name`   VARCHAR(256),
    `email`       VARCHAR(256)       NOT NULL,
    `password`    VARCHAR(256)       NOT NULL,
    `role`        TINYINT,
    `avatar_path` VARCHAR(256),
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE utf8mb4_unicode_ci
;