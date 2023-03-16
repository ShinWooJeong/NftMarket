import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "dsp", tableName: "dsp", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8mb4" })
export class schema_dsp extends Model<schema_dsp> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.INTEGER(10), allowNull: false })
  member_idx: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0 })
  mint_idx: number

  @Column({ type: DataType.STRING(20), allowNull: false })
  type: string

  @Column({ type: DataType.STRING(255), allowNull: false })
  title: string

  @Column({ type: DataType.DECIMAL(64, 0), allowNull: false })
  balance: string

  @Column({ type: DataType.INTEGER(1), allowNull: false, defaultValue: "1" })
  use_flag: number

  @Column({ type: DataType.STRING(20), allowNull: false })
  set_date: string

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0 })
  created_at: number
}
