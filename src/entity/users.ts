import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from "typeorm";
import Posts from "./posts";

@Entity()
export default class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  age: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({
    type: "simple-json",
    nullable: true
  })
  additional_info: {
    shoeSize: number;
    hairColor: string;
  }

  @Column({
    type: "simple-array",
    default: []
  })
  family_members: string[]

  @OneToMany(
    () => Posts,
    post => post.user
  )
  posts: Posts[]
}
