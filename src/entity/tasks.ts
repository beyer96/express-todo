import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Users from "./users";
import Projects from "./projects";

@Entity()
export default class Tasks extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: "text",
    nullable: true
  })
  description: string;

  @Column({
    type: "boolean",
    default: false
  })
  is_done: boolean;

  @ManyToOne(() => Users, user => user.tasks)
  @JoinColumn({ name: "user_id" })
  user: Users;

  @ManyToOne(() => Projects, project => project.tasks)
  @JoinColumn({ name: "project_id" })
  project: Projects;
}
