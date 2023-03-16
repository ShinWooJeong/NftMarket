import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "member_favorite", tableName: "member_favorite", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8mb4", collate: "utf8mb4_unicode_ci" })
export class schema_member_favorite extends Model<schema_member_favorite> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.INTEGER(10).UNSIGNED, allowNull: false })
  member_idx: number

  @Column({ type: DataType.INTEGER(10).UNSIGNED, allowNull: false })
  mint_idx: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0 })
  created_at: number

  @Column({ type: DataType.STRING(45), allowNull: true, defaultValue: "1" })
  use_flag: string
}
