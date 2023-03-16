import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "nft_owned_data", tableName: "nft_owned_data", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8" })
export class schema_nft_owned_data extends Model<schema_nft_owned_data> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  listing_idx: number

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  mint_idx: number

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  member_idx: number

  @Column({ type: DataType.TEXT })
  nft_owner: string

  @Column({ type: DataType.STRING(255), unique: "tx_id_UNIQUE", allowNull: true, defaultValue: null })
  tx_id: string

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  token_idx: number

  @Column({ type: DataType.TEXT })
  block_hash: string

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  block_number: number

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null })
  contract_usd: string

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null })
  contract_eth: string

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  total_amount: number

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  remain_amount: number

  @Column({ type: DataType.STRING(45), allowNull: true, defaultValue: null })
  nft_status: string

  @Column({ type: DataType.STRING(45), allowNull: true, defaultValue: null })
  sales_type: string

  @Column({ type: DataType.STRING(1), defaultValue: "N" })
  offer_flag: string

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null })
  set_date: string

  @Column({ type: DataType.INTEGER(1).UNSIGNED, defaultValue: 1 })
  use_flag: number

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null })
  burn_tx_id: string

  @Column({ type: DataType.TEXT, allowNull: true, defaultValue: null })
  burn_block_hash: string

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  burn_block_number: number
}

// CREATE TABLE `nft_owned_data` (
//   `idx` int(10) unsigned NOT NULL AUTO_INCREMENT,
//   `listing_idx` int(10) DEFAULT NULL,
//   `mint_idx` int(10) DEFAULT NULL,
//   `member_idx` int(10) DEFAULT NULL,
//   `nft_owner` text,
//   `tx_id` varchar(255) DEFAULT NULL,
//   `token_idx` int(10) DEFAULT NULL,
//   `block_hash` text,
//   `block_number` int(10) DEFAULT NULL,
//   `contract_usd` varchar(255) DEFAULT NULL,
//   `contract_eth` varchar(255) DEFAULT NULL,
//   `nft_status` varchar(45) DEFAULT NULL,
//   `sales_type` varchar(45) DEFAULT NULL,
//   `offer_flag` varchar(1) DEFAULT 'N',
//   `set_date` varchar(255) DEFAULT NULL,
//   `use_flag` int(1) unsigned DEFAULT '1',
//   PRIMARY KEY (`idx`),
//   UNIQUE KEY `tx_id_UNIQUE` (`tx_id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8;
