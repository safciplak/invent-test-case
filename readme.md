# Library Management System API

A RESTful API for managing library operations including user management, book management, and book borrowing system.

## 🚀 Tech Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Other Tools:**
  - Docker & Docker Compose

## 📋 Features

- User Management
  - List all users
  - Get user details with borrowing history
  - Create new users
- Book Management
  - List all books
  - Get book details with ratings
  - Create new books
- Borrowing Operations
  - Borrow books
  - Return books with ratings
  - Track borrowing history

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/safciplak/invent-test-case
```

2. Create `.env` file in root directory

```bash
cp .env.example .env
```

3. Run with Docker:
```bash
docker compose up --build
```

## 📝 API Documentation

### Users Endpoints

- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create new user

### Books Endpoints

- `GET /api/books` - List all books
- `GET /api/books/:id` - Get book details
- `POST /api/books` - Create new book

### Borrowing Endpoints

- `POST /api/borrow` - Borrow a book
- `POST /api/return` - Return a book with rating

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL
);

-- Book Borrows table
CREATE TABLE book_borrows (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    book_id INTEGER REFERENCES books(id),
    borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP,
    score INTEGER
);

-- Indexes for better query performance
CREATE INDEX idx_book_borrows_user_id ON book_borrows(user_id);
CREATE INDEX idx_book_borrows_book_id ON book_borrows(book_id);
```

## 📜 License

MIT

## 👥 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🧪 Running Tests

You can run the tests using:
```bash
yarn run test
```

## 📊 Test Coverage

The project includes unit tests and integration tests with Jest. To view the test coverage report:

1. Run the coverage command:
```bash
yarn test:coverage
```

## ⚠️ Disclaimer

> **Note:** 
> - A minimum test coverage of 70-80% or higher is required for all components
> - This coverage requirement helps ensure code quality and reliability
> - Coverage reports are generated using Jest's built-in coverage reporting tool
> - Components falling below the minimum coverage threshold should be improved before merging