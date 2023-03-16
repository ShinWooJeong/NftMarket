import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "dsp_transfer", tableName: "dsp_transfer", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8" })
export class schema_dsp_transfer extends Model<schema_dsp_transfer> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true, defaultValue: null })
  idx: number

  @Column({ type: DataType.INTEGER(10), defaultValue: null })
  member_idx: number

  @Column({ type: DataType.STRING(64), defaultValue: null })
  from_wallet: string

  @Column({ type: DataType.STRING(64), defaultValue: null })
  to_wallet: string

  @Column({ type: DataType.INTEGER(10), defaultValue: null })
  balance: string

  @Column({ type: DataType.TEXT, defaultValue: null })
  tx_id: string

  @Column({ type: DataType.INTEGER(10), defaultValue: null })
  chain_idx: number

  @Column({ type: DataType.TEXT, defaultValue: null })
  block_hash: string

  @Column({ type: DataType.INTEGER(10), defaultValue: null })
  block_number: number

  @Column({ type: DataType.STRING(255), defaultValue: null })
  contract_krw: string

  @Column({ type: DataType.STRING(255), defaultValue: null })
  contract_eth: string

  @Column({ type: DataType.STRING(1), defaultValue: "N" })
  delivery_info: string

  @Column({ type: DataType.STRING(255), defaultValue: null })
  set_date: string

  @Column({ type: DataType.INTEGER(1).UNSIGNED, defaultValue: 1 })
  use_flag: string

  @Column({ type: DataType.INTEGER(1).UNSIGNED, defaultValue: 1 })
  created_at: number
}
