import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "exhibition_nft", tableName: "exhibition_nft", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "17", charset: "utf8mb4" })
export class schema_exhibition_nft extends Model<schema_exhibition_nft> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.INTEGER(10).UNSIGNED, defaultValue: null })
  exhibition_idx: number

  @Column({ type: DataType.INTEGER(10).UNSIGNED, defaultValue: null })
  mint_idx: number

  @Column({ type: DataType.STRING(45), defaultValue: null })
  set_date: string

  @Column({ type: DataType.INTEGER(1).UNSIGNED, allowNull: false, defaultValue: 0 })
  created_at: number
}
