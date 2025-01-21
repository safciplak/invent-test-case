import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BookBorrow } from "./BookBorrow";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => BookBorrow, borrow => borrow.user)
  borrows!: BookBorrow[];
}