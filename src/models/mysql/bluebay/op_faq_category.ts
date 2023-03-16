import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "op_faq_category", tableName: "op_faq_category", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "9", charset: "utf8mb4" })
export class schema_op_faq_category extends Model<schema_op_faq_category> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.STRING(255), allowNull: false, comment: "카테고리 한글명" })
  category_name_ko: string

  @Column({ type: DataType.STRING(255), allowNull: false, comment: "카테고리 영문명" })
  category_name_en: string

  @Column({ type: DataType.INTEGER(2), allowNull: false, defaultValue: 1, comment: "1:사용 | 9:삭제" })
  use_flag: number

  @Column({ type: DataType.STRING(45), comment: "KST 입력시간" })
  set_date: string

  @Column({ type: DataType.INTEGER(10).UNSIGNED, allowNull: false, defaultValue: 0, comment: "UTC 입력시간" })
  created_at: number
}
