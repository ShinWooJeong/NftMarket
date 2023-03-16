import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "op_privacy_policy", tableName: "op_privacy_policy", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "2", charset: "utf8mb4" })
export class schema_op_privacy_policy extends Model<schema_op_privacy_policy> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.TEXT, defaultValue: null })
  content_ko_web: string

  @Column({ type: DataType.TEXT, defaultValue: null })
  content_en_web: string

  @Column({ type: DataType.TEXT, defaultValue: null })
  content_ko_mobile: string

  @Column({ type: DataType.TEXT, defaultValue: null })
  content_en_mobile: string
}
