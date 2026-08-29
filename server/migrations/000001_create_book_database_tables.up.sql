CREATE TABLE book_database_publishers (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (id),
    UNIQUE KEY book_database_publishers_name_key (name)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE book_database_authors (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    name_kana VARCHAR(255) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (id),
    KEY book_database_authors_name_idx (name)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE book_database_books (
    id INT NOT NULL AUTO_INCREMENT,
    isbn13 VARCHAR(13) NULL,
    title VARCHAR(512) NOT NULL,
    subtitle VARCHAR(512) NULL,
    publisher_id INT NULL,
    published_date DATE NULL,
    series_name VARCHAR(255) NULL,
    volume VARCHAR(50) NULL,
    price INT NULL,
    cover_image_url VARCHAR(1024) NULL,
    description TEXT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (id),
    UNIQUE KEY book_database_books_isbn13_key (isbn13),
    KEY book_database_books_published_date_idx (published_date),
    CONSTRAINT book_database_books_publisher_id_fkey
        FOREIGN KEY (publisher_id) REFERENCES book_database_publishers (id)
        ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE book_database_book_authors (
    book_id INT NOT NULL,
    author_id INT NOT NULL,
    role VARCHAR(50) NULL,
    `order` INT NOT NULL DEFAULT 0,

    PRIMARY KEY (book_id, author_id),
    CONSTRAINT book_database_book_authors_book_id_fkey
        FOREIGN KEY (book_id) REFERENCES book_database_books (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT book_database_book_authors_author_id_fkey
        FOREIGN KEY (author_id) REFERENCES book_database_authors (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE book_database_book_sources (
    id INT NOT NULL AUTO_INCREMENT,
    source_type ENUM('NDL_JAPANESE_BOOKS', 'NDL_SEARCH_API', 'JPRO_BOOKS', 'PUBLISHER') NOT NULL,
    source_id VARCHAR(255) NOT NULL,
    book_id INT NOT NULL,
    raw_data JSON NOT NULL,
    fetched_at DATETIME(3) NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (id),
    KEY book_database_book_sources_book_id_idx (book_id),
    UNIQUE KEY book_database_book_sources_source_type_source_id_key (source_type, source_id),
    CONSTRAINT book_database_book_sources_book_id_fkey
        FOREIGN KEY (book_id) REFERENCES book_database_books (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
