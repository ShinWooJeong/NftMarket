import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "nft_offer_data", tableName: "nft_offer_data", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8" })
export class schema_nft_offer_data extends Model<schema_nft_offer_data> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  member_idx: number

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  listing_idx: number

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  mint_idx: number

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  owned_idx: number

  @Column({ type: DataType.INTEGER(1), allowNull: true, defaultValue: null })
  currency_type: number

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null })
  offer_price: string

  @Column({ type: DataType.TEXT, allowNull: false })
  my_balance: string

  @Column({ type: DataType.STRING(1), defaultValue: "N" })
  offer_flag: string

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null })
  finish_date: string

  @Column({ type: DataType.STRING(1), allowNull: true, defaultValue: null })
  buy_flag: string

  @Column({ type: DataType.STRING(1), defaultValue: "N" })
  alert_flag: string

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null })
  set_date: string

  @Column({ type: DataType.INTEGER(1).UNSIGNED, defaultValue: 1 })
  use_flag: number
}

// CREATE TABLE `offer_data` (
//   `idx` int(10) unsigned NOT NULL AUTO_INCREMENT,
//   `member_idx` int(10) DEFAULT NULL,
//   `listing_idx` int(10) DEFAULT NULL,
//   `mint_idx` int(10) DEFAULT NULL,
//   `owned_idx` int(10) DEFAULT NULL,
//   `owner_idx` int(10) DEFAULT NULL,
//   `currency_type` int(1) DEFAULT NULL,
//   `offer_price` varchar(255) DEFAULT NULL,
//   `my_balance` text NOT NULL,
//   `offer_flag` varchar(1) DEFAULT 'N',
//   `finish_date` varchar(255) DEFAULT NULL,
//   `buy_flag` varchar(1) DEFAULT 'N',
//   `alert_flag` varchar(1) DEFAULT 'N',
//   `set_date` varchar(255) DEFAULT NULL,
//   `use_flag` int(1) unsigned DEFAULT '1',
//   PRIMARY KEY (`idx`)
// ) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
