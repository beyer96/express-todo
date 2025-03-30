import { BaseEntity, Column, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Users from "./users";
import Tasks from "./tasks";


export default class Projects extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  is_done: boolean;

  @ManyToOne(() => Users, user => user.projects)
  @JoinColumn({ name: "user_id" })
  user: Users;

  @OneToMany(() => Tasks, task => task.project)
  tasks: Tasks[];
}
