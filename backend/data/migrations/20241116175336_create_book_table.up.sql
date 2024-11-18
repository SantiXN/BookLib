CREATE TABLE `book`
(
    `id`          INT AUTO_INCREMENT NOT NULL,
    `title`       VARCHAR(256) NOT NULL,
    `description` TEXT,
    `cover_path`  VARCHAR(256),
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `created_by`  INT          NOT NULL,
    PRIMARY KEY (`id`)
);