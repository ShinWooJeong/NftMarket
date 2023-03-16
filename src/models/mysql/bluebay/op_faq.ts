import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "op_faq", tableName: "op_faq", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "51", charset: "utf8mb4" })
export class schema_op_faq extends Model<schema_op_faq> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0, comment: "카테고리 아이디" })
  category_id: number

  @Column({ type: DataType.STRING(255), allowNull: false, comment: "카테고리 제목" })
  title_ko: string

  @Column({ type: DataType.TEXT, allowNull: false, comment: "내용 제목" })
  content_ko: string

  @Column({ type: DataType.STRING(255), allowNull: false, comment: "카테고리 제목" })
  title_en: string

  @Column({ type: DataType.TEXT, allowNull: false, comment: "내용 제목" })
  content_en: string

  @Column({ type: DataType.INTEGER(11), allowNull: false, defaultValue: 0, comment: "우선순위" })
  priority: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0, comment: "본 수" })
  view_hit: number

  @Column({ type: DataType.STRING(45), comment: "KST 입력시간" })
  set_date: string

  @Column({ type: DataType.INTEGER(1), allowNull: false, defaultValue: 1, comment: "1:정상 | 9:삭제" })
  use_flag: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0 })
  created_at: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0, comment: "도움이 된 카운트" })
  help_ok: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0, comment: "도움이 안된 수" })
  help_no: number
}
