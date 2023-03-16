import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "op_email_template", tableName: "op_email_template", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8mb4" })
export class schema_op_email_template extends Model<schema_op_email_template> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.STRING(45), allowNull: false, comment: "목적" })
  name: string

  @Column({ type: DataType.STRING(45), unique: "key_UNIQUE", allowNull: false, comment: "서비스 연동 키" })
  service_key: string

  @Column({ type: DataType.STRING(255), allowNull: false, comment: "메일 제목" })
  title_ko: string

  @Column({ type: DataType.TEXT, defaultValue: null, comment: "메일 내용" })
  content_ko: string

  @Column({ type: DataType.STRING(255), allowNull: false, comment: "메일 제목" })
  title_en: string

  @Column({ type: DataType.TEXT, allowNull: false, comment: "메일 내용" })
  content_en: string

  @Column({ type: DataType.INTEGER(1), allowNull: false, defaultValue: 1, comment: "1:정상 | 9:삭제" })
  use_flag: number

  @Column({ type: DataType.STRING(45), allowNull: false, comment: "생성일시 한국시간 datetime" })
  set_date: string

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0, comment: "생성일시 UTC timestamp" })
  created_at: number
}
