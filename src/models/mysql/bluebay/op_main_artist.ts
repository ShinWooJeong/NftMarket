import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "op_main_artist", tableName: "op_main_artist", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8" })
export class schema_op_main_artist extends Model<schema_op_main_artist> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false })
  idx: number

  @Column({ type: DataType.STRING(255), defaultValue: null })
  mint_idx: string

  @Column({ type: DataType.STRING(255), allowNull: false })
  name: string

  @Column({ type: DataType.STRING(255), allowNull: false })
  image_url: string

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0, comment: "노출 시작시간 UTC" })
  start_at: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0, comment: "노출 종료시간 UTC" })
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

  @Column({ type: DataType.STRING(128), defaultValue: null, comment: "웹용 링크" })
  link_url_web: string

  @Column({ type: DataType.STRING(128), defaultValue: null, comment: "모바일용 링크" })
  link_url_mo: string
}
