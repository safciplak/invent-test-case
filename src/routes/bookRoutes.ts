import { Router } from 'express';
import { BookController } from '../controllers/bookController';
import { body } from 'express-validator';
import { validate } from '../middleware/validator';

const router = Router();
const bookController = new BookController();

router.get('/', bookController.getBooks.bind(bookController));
router.get('/:id', bookController.getBook.bind(bookController));
router.post('/',
  [
    body('name').isString().notEmpty().withMessage('Name is required and must be a string'),
  ],
  validate,
  bookController.createBook.bind(bookController)
);

export default router;