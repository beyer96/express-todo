import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import Tasks from "./tasks";
import Projects from "./projects";
import { IsString, IsEmail, MinLength, Matches } from "class-validator";

@Entity()
export default class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString({ message: "Value has to be string" })
  first_name: string;

  @Column()
  @IsString({ message: "Value has to be string" })
  last_name: string;

  @Column({ unique: true })
  @IsString({ message: "Value has to be string" })
  @MinLength(8, { message: "Username has to be at least 8 characters long." })
  username: string;

  @Column({ unique: true })
  @IsEmail({}, { message: "Value is not valid email." })
  email: string;

  @Column({ type: "text" })
  @Matches(
    new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
    { message: "Password must contain at least 1 letter, 1 number and 1 special character." }
  )
  @MinLength(10, { message: "Password must be at least 10 characters long." })
  password: string;

  @OneToMany(() => Tasks, task => task.user)
  tasks: Tasks[];

  @OneToMany(() => Projects, project => project.user)
  projects: Projects[];
}
