import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Users from "./users";
import Tasks from "./tasks";
import { IsBoolean, IsString } from "class-validator";


@Entity()
export default class Projects extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString({ message: "Value has to be string." })
  title: string;

  @Column({
    type: "boolean",
    default: false
  })
  @IsBoolean({ message: "Property only accepts boolean value." })
  is_done: boolean;

  @ManyToOne(() => Users, user => user.projects)
  @JoinColumn({ name: "user_id" })
  user: Users;

  @OneToMany(() => Tasks, task => task.project)
  tasks: Tasks[];
}
