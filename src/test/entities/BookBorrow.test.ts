import { BookBorrow } from '../../entities/BookBorrow';
import { Book } from '../../entities/Book';
import { User } from '../../entities/User';

describe('BookBorrow Entity', () => {
  it('should create a book borrow instance', () => {
    const bookBorrow = new BookBorrow();
    const borrowDate = new Date();
    const returnDate = new Date();

    bookBorrow.id = 1;
    bookBorrow.borrowDate = borrowDate;
    bookBorrow.returnDate = returnDate;
    bookBorrow.score = 5;

    expect(bookBorrow).toBeInstanceOf(BookBorrow);
    expect(bookBorrow.id).toBe(1);
    expect(bookBorrow.borrowDate).toBe(borrowDate);
    expect(bookBorrow.returnDate).toBe(returnDate);
    expect(bookBorrow.score).toBe(5);
  });

  it('should handle relationships with Book and User', () => {
    const bookBorrow = new BookBorrow();
    const book = new Book();
    const user = new User();

    book.id = 1;
    book.name = 'Test Book';
    
    user.id = 1;
    user.name = 'Test User';

    bookBorrow.book = book;
    bookBorrow.user = user;

    expect(bookBorrow.book).toBe(book);
    expect(bookBorrow.user).toBe(user);
  });

  it('should allow null values for optional fields', () => {
    const bookBorrow = new BookBorrow();
    bookBorrow.id = 1;
    bookBorrow.borrowDate = new Date();
    
    // returnDate and score are optional
    expect(bookBorrow.returnDate).toBeUndefined();
    expect(bookBorrow.score).toBeUndefined();
  });
}); 