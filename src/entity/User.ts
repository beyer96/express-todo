import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  age: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: "simple-json",
    nullable: true
  })
  additionalInfo: {
    shoeSize: number;
    hairColor: string;
  }

  @Column({
    type: "simple-array",
    default: []
  })
  familyMembers: string[]
}
