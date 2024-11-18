CREATE TABLE `author`
(
    `id`          INT AUTO_INCREMENT NOT NULL,
    `first_name`  VARCHAR(256)       NOT NULL,
    `last_name`   VARCHAR(256),
    `description` TEXT,
    PRIMARY KEY (`id`)
);