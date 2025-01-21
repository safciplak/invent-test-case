import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Book } from "./Book";
import { User } from "./User";

@Entity("book_borrows")
export class BookBorrow {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.borrows)
  user!: User;

  @ManyToOne(() => Book, book => book.borrows)
  book!: Book;

  @CreateDateColumn()
  borrowDate!: Date;

  @Column({ nullable: true })
  returnDate!: Date;

  @Column({ nullable: true })
  score!: number;
} 