CREATE TABLE `author`
(
    `id`          INT AUTO_INCREMENT NOT NULL,
    `first_name`  VARCHAR(256)       NOT NULL,
    `last_name`   VARCHAR(256),
    `avatar_path` VARCHAR(256),
    `description` TEXT,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE utf8mb4_unicode_ci
;