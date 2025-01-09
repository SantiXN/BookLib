CREATE TABLE `author_book`
(
    `author_id` INT NOT NULL,
    `book_id`   INT NOT NULL,
    PRIMARY KEY (`author_id`, `book_id`),
    CONSTRAINT `author_book_author_id_author_fk` FOREIGN KEY (`author_id`) REFERENCES `author` (`id`) ON DELETE CASCADE,
    CONSTRAINT `author_book_book_id_book_fk` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE utf8mb4_unicode_ci
;