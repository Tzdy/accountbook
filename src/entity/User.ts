import { Column, Entity, PrimaryGeneratedColumn } from "indexdb-util";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  asset!: number;

  @Column()
  debt!: number;
}
