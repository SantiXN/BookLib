CREATE TABLE category_book (
    category_id INT NOT NULL,
    book_id INT NOT NULL,
    PRIMARY KEY (category_id, book_id),
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,
    CONSTRAINT fk_book FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE
);