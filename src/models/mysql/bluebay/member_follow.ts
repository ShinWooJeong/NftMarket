import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "member_follow", tableName: "member_follow", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8" })
export class schema_member_follow extends Model<schema_member_follow> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.INTEGER(10).UNSIGNED, allowNull: false })
  member_idx: number

  @Column({ type: DataType.INTEGER(10).UNSIGNED, allowNull: false })
  follow_idx: number

  @Column({ type: DataType.STRING(255), allowNull: false })
  set_date: string

  @Column({ type: DataType.STRING(1), allowNull: false, defaultValue: "1" })
  use_flag: string

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0 })
  created_at: number
}
