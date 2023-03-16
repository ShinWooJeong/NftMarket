import { Table, Column, Model, DataType, AllowNull } from 'sequelize-typescript'

@Table({modelName: 'nft_auction_data', tableName: 'nft_auction_data', freezeTableName: false, engine: 'InnoDB', initialAutoIncrement: '1', charset: 'utf8'})
export class schema_nft_auction_data extends Model<schema_nft_auction_data> {
  @Column({type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true})
  idx: number

  @Column({type: DataType.INTEGER(10), defaultValue: null, allowNull: true})
  member_idx: number

  @Column({type: DataType.INTEGER(10), defaultValue: null, allowNull: true})
  listing_idx: number

  @Column({type: DataType.INTEGER(10), defaultValue: null, allowNull: true})
  mint_idx: number

  @Column({type: DataType.INTEGER(1), defaultValue: null, allowNull: true})
  currency_type: number

  @Column({type: DataType.STRING(255), defaultValue: null, allowNull: true})
  auction_eth: string

  @Column({type: DataType.STRING(255), defaultValue: null, allowNull: true})
  auction_krw: string

  @Column({type: DataType.STRING(45), defaultValue: null, allowNull: true})
  max_eth: string

  @Column({type: DataType.TEXT, defaultValue: "", allowNull: false})
  my_eth: string

  @Column({type: DataType.STRING(1), defaultValue: "N"})
  ac_winner: string

  @Column({type: DataType.STRING(1), defaultValue: "N"})
  alert_flag: string

  @Column({type: DataType.STRING(255), defaultValue: null, allowNull: true})
  set_date: string

  @Column({type: DataType.INTEGER(1).UNSIGNED, defaultValue: 1})
  use_flag: number
}
