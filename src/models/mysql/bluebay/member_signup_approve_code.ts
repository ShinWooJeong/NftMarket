import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "member_signup_approve_code", tableName: "member_signup_approve_code", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8mb4" })
export class schema_member_signup_approve_code extends Model<schema_member_signup_approve_code> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.STRING(100), allowNull: false })
  email: string

  @Column({ type: DataType.STRING(15), defaultValue: "signup", allowNull: false, comment: "signup / reset_password" })
  type: string

  @Column({ type: DataType.STRING(6), defaultValue: "", allowNull: false })
  approve_code: string

  @Column({ type: DataType.ENUM("N", "Y"), defaultValue: "N", allowNull: false })
  is_used: string

  @Column({ type: DataType.INTEGER(10), allowNull: false })
  expired_at: number

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  approved_at: number
}
