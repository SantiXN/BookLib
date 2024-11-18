CREATE TABLE `user_book`
(
    `user_id`        INT     NOT NULL,
    `book_id`        INT     NOT NULL,
    `reading_status` TINYINT NOT NULL DEFAULT 0,
    `created_at`     TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`, `book_id`),
    CONSTRAINT `user_id_user_fk` FOREIGN KEY (`user_id`) REFERENCES user (`id`) ON DELETE CASCADE,
    CONSTRAINT `user_book_book_id_book_fk` FOREIGN KEY (`book_id`) REFERENCES book (`id`) ON DELETE CASCADE
);