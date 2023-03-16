import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "op_banner", tableName: "op_banner", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8" })
export class schema_op_banner extends Model<schema_op_banner> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.STRING(30), defaultValue: null })
  banner_type: string

  @Column({ type: DataType.STRING(255), defaultValue: null })
  image_url: string

  @Column({ type: DataType.STRING(255), defaultValue: null })
  link_url: string

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 1 })
  priority: number

  @Column({ type: DataType.STRING(25), defaultValue: null })
  set_date: string

  @Column({ type: DataType.STRING(1), allowNull: false, defaultValue: 1 })
  use_flag: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0 })
  created_at: number
}
