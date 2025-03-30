import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import Tasks from "./tasks";
import Projects from "./projects";

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

  @Column({ type: "text" })
  password: string;

  @OneToMany(() => Tasks, task => task.user)
  tasks: Tasks[];

  @OneToMany(() => Projects, project => project.user)
  projects: Projects[];
}
