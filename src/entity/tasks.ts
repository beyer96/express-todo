import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Users from "./users";
import Projects from "./projects";
import { IsString, IsBoolean } from "class-validator";

@Entity()
export default class Tasks extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString({ message: "Value has to be string." })
  title: string;

  @Column({
    type: "text",
    nullable: true
  })
  @IsString({ message: "Value has to be string." })
  description: string;

  @Column({
    type: "boolean",
    default: false
  })
  @IsBoolean({ message: "Property only accepts boolean value." })
  is_done: boolean;

  @ManyToOne(() => Users, user => user.tasks)
  @JoinColumn({ name: "user_id" })
  user: Users;

  @ManyToOne(() => Projects, project => project.tasks)
  @JoinColumn({ name: "project_id" })
  project: Projects;
}
