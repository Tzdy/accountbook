import { Column, Entity, PrimaryGeneratedColumn } from "indexdb-util";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn({
    autoIncrement: true,
  })
  id!: number;

  @Column()
  asset!: number;

  @Column()
  debt!: number;
}
