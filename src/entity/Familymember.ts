import { Column, Entity, PrimaryGeneratedColumn } from "indexdb-util";

@Entity("familymember")
export class FamilyMember {
  @PrimaryGeneratedColumn({
    autoIncrement: true,
  })
  id!: number;

  @Column()
  name!: string;

  @Column()
  asset!: number;

  @Column()
  debt!: number;

  @Column()
  color!: string;
}
