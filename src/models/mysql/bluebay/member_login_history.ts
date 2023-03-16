import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "member_login_history", tableName: "member_login_history", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8mb4", collate: "utf8mb4_unicode_ci" })
export class schema_member_login_history extends Model<schema_member_login_history> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, comment: "회원IDX" })
  member_idx: number

  @Column({ type: DataType.STRING(45), allowNull: false, comment: "web / ios / android" })
  platform: string

  @Column({ type: DataType.STRING(45), allowNull: false, comment: "생성일시 한국시간 datetime" })
  set_date: string

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0, comment: "생성일시 UTC timestamp" })
  created_at: number
}
