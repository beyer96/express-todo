import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import Users from "./users";

@Entity()
export default class Posts extends BaseEntity {
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
