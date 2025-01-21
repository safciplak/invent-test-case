import { User } from '../../entities/User';
import { BookBorrow } from '../../entities/BookBorrow';

describe('User Entity', () => {
  it('should create a user instance', () => {
    const user = new User();
    user.id = 1;
    user.name = 'Test User';
    user.borrows = [];

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(1);
    expect(user.name).toBe('Test User');
    expect(user.borrows).toEqual([]);
  });

  it('should handle user borrows relationship', () => {
    const user = new User();
    const bookBorrow1 = new BookBorrow();
    const bookBorrow2 = new BookBorrow();

    user.borrows = [bookBorrow1, bookBorrow2];

    expect(user.borrows).toHaveLength(2);
    expect(user.borrows).toContain(bookBorrow1);
    expect(user.borrows).toContain(bookBorrow2);
  });
}); 