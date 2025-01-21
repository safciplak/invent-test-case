import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BookBorrow } from "./BookBorrow";

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => BookBorrow, borrow => borrow.book)
  borrows!: BookBorrow[];
} 