import { Column, Entity, PrimaryGeneratedColumn } from "indexdb-util";

@Entity("account_familymember")
export class AccountFamilyMember {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  account_id!: number;

  @Column()
  familymember_id!: number;

  @Column()
  number!: number;
}
