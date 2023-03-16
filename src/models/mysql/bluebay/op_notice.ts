import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "op_notice", tableName: "op_notice", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8mb4" })
export class schema_op_notice extends Model<schema_op_notice> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.STRING(45), defaultValue: null })
  notice_type: string

  @Column({ type: DataType.STRING(255), defaultValue: null })
  title_ko: string

  @Column({ type: DataType.TEXT, defaultValue: null })
  content_ko: string

  @Column({ type: DataType.STRING(255), defaultValue: null })
  title_en: string

  @Column({ type: DataType.TEXT, defaultValue: null })
  content_en: string

  @Column({ type: DataType.INTEGER(11), allowNull: false, defaultValue: 0 })
  priority: number

  @Column({ type: DataType.INTEGER(10), defaultValue: 0 })
  view_hit: number

  @Column({ type: DataType.STRING(45), defaultValue: "Bluebay" })
  reg_adm: string

  @Column({ type: DataType.STRING(45), allowNull: false })
  set_date: string

  @Column({ type: DataType.INTEGER(1), allowNull: false, defaultValue: 1, comment: "1:정상 | 9:삭제" })
  use_flag: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0 })
  created_at: number
}
