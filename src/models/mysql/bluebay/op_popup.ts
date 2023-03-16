import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "op_popup", tableName: "op_popup", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8" })
export class schema_op_popup extends Model<schema_op_popup> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.STRING(30), defaultValue: null })
  popup_type: string

  @Column({ type: DataType.STRING(255), defaultValue: null })
  image_url: string

  @Column({ type: DataType.STRING(255), defaultValue: null })
  link_url: string

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 1 })
  priority: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0 })
  start_at: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0 })
  finish_at: number

  @Column({ type: DataType.STRING(25), defaultValue: null })
  set_date: string

  @Column({ type: DataType.STRING(1), allowNull: false, defaultValue: "1" })
  use_flag: String

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0 })
  created_at: number
}
