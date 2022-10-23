import { Column, Entity, PrimaryGeneratedColumn } from "indexdb-util";

@Entity("familymember")
export class FamilyMember {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  asset!: number;

  @Column()
  debt!: number;
}
