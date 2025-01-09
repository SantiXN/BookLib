CREATE TABLE `category_book`
(
    `category_id` INT NOT NULL,
    `book_id`     INT NOT NULL,
    PRIMARY KEY (`category_id`, `book_id`),
    CONSTRAINT `category_book_category_id_category_fk` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE,
    CONSTRAINT `category_book_book_id_book_fk` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE utf8mb4_unicode_ci
;