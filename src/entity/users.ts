import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export default class Users {
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
}
