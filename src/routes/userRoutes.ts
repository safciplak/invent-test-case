import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { body } from 'express-validator';
import { validate } from '../middleware/validator';

const router = Router();
const userController = new UserController();

router.get('/', userController.getUsers.bind(userController));
router.get('/:id', userController.getUser.bind(userController));
router.post('/', 
  [body('name').isString().notEmpty()],
  validate,
  userController.createUser.bind(userController)
);
router.post('/:userId/borrow/:bookId', userController.borrowBook.bind(userController));
router.post('/:userId/return/:bookId',
  [body('score').isInt({ min: 0, max: 10 })],
  validate,
  userController.returnBook.bind(userController)
);

export default router;