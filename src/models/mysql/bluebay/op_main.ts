import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "op_main", tableName: "op_main", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8mb4" })
export class schema_op_main extends Model<schema_op_main> {
  @Column({ type: DataType.INTEGER(11).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.INTEGER(11), defaultValue: 0 })
  mint_idx: number

  @Column({ type: DataType.TEXT, defaultValue: null })
  name: string

  @Column({ type: DataType.TEXT, defaultValue: null })
  description: string

  @Column({ type: DataType.INTEGER(11), allowNull: false, defaultValue: 0 })
  start_at: number

  @Column({ type: DataType.INTEGER(11), allowNull: false, defaultValue: 0 })
  finish_at: number

  @Column({ type: DataType.INTEGER(11).UNSIGNED, allowNull: false, defaultValue: 1 })
  use_flag: number

  @Column({ type: DataType.INTEGER(11), allowNull: false, defaultValue: 0 })
  priority: number

  @Column({ type: DataType.STRING(45), defaultValue: null })
  set_date: string

  @Column({ type: DataType.STRING(45), defaultValue: null })
  status: string

  @Column({ type: DataType.STRING(128), defaultValue: null })
  link_url_web: string

  @Column({ type: DataType.STRING(128), defaultValue: null })
  link_url_mo: string

  @Column({ type: DataType.STRING(128), defaultValue: null })
  nft_url: string

  @Column({ type: DataType.STRING(128), defaultValue: null })
  image_url: string

  @Column({ type: DataType.STRING(45), defaultValue: "_self" })
  link_tarage: string

  @Column({ type: DataType.STRING(10), defaultValue: null })
  background_class_name: string

  @Column({ type: DataType.STRING(128), defaultValue: null })
  background_img

  @Column({ type: DataType.INTEGER(11).UNSIGNED, allowNull: false, defaultValue: 0 })
  created_at: number
}
