import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "exhibition", tableName: "exhibition", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "8", charset: "utf8" })
export class schema_exhibition extends Model<schema_exhibition> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.STRING(255), defaultValue: null })
  category: string

  @Column({ type: DataType.STRING(255), allowNull: false })
  name: string

  @Column({ type: DataType.STRING(100), defaultValue: null })
  artist: string

  @Column({ type: DataType.TEXT, defaultValue: null })
  content: string

  @Column({ type: DataType.STRING(255), allowNull: false })
  image_url: string

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0 })
  start_at: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0 })
  finish_at: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0 })
  view_hit: number

  @Column({ type: DataType.INTEGER(2).UNSIGNED, allowNull: false, defaultValue: 1 })
  use_flag: number

  @Column({ type: DataType.INTEGER(10).UNSIGNED, allowNull: false, defaultValue: 0 })
  created_at: number

  @Column({ type: DataType.INTEGER(2), allowNull: false, defaultValue: 0 })
  priority: number

  @Column({ type: DataType.STRING(45), defaultValue: null })
  set_date: string
}
