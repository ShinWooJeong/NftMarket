import { Table, Column, Model, DataType } from 'sequelize-typescript'

@Table({modelName: 'nft_history', tableName: 'nft_history', freezeTableName: false, engine: 'InnoDB', initialAutoIncrement: '1', charset: 'utf8'})
export class schema_nft_history extends Model<schema_nft_history> {
  @Column({type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true})
  idx: number

  @Column({type: DataType.INTEGER(10), allowNull: true, defaultValue: null})
  mint_idx: number

  @Column({type: DataType.INTEGER(10), allowNull: true, defaultValue: null})
  member_idx: number

  @Column({type: DataType.STRING(255), unique: 'tx_id_UNIQUE', allowNull: true, defaultValue: null})
  tx_id: string

  @Column({type: DataType.STRING(255), allowNull: true, defaultValue: null})
  history_type: string

  @Column({type: DataType.STRING(255), allowNull: true, defaultValue: null})
  history_memo: string

  @Column({type: DataType.STRING(255), allowNull: true, defaultValue: null})
  history_memo_ko: string

  @Column({type: DataType.STRING(255), allowNull: true, defaultValue: null})
  set_date: string

  @Column({type: DataType.STRING(1), defaultValue: '1'})
  use_flag: string
}
