import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import Users from "./users";

@Entity()
export default class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "text" })
  text: string;

  @ManyToOne(
    () => Users,
    user => user.posts
  )
  @JoinColumn({
    name: "user_id"
  })
  user: Users
}
