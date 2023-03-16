import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "nft_listing_data", tableName: "nft_listing_data", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8" })
export class schema_nft_listing_data extends Model<schema_nft_listing_data> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  mint_idx: number

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  owned_idx: number

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  member_idx: number

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null })
  nft_creator: string

  @Column({ type: DataType.STRING(100), allowNull: true, defaultValue: null })
  sales_type: string

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null })
  open_date: string

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null })
  start_date: string

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null })
  finish_date: string

  @Column({ type: DataType.STRING(45), allowNull: true, defaultValue: null })
  sales_royalty: string

  @Column({ type: DataType.TEXT, allowNull: false })
  nft_price: string

  @Column({ type: DataType.TEXT })
  tx_id: string

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  item_idx: number

  @Column({ type: DataType.TEXT })
  block_hash: string

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  block_number: number

  @Column({ type: DataType.STRING(45), allowNull: true, defaultValue: null })
  nft_status: string

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  total_amount: number

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  remain_amount: number

  @Column({ type: DataType.TEXT })
  burn_tx_id: string

  @Column({ type: DataType.STRING(45), allowNull: true, defaultValue: null })
  resell_type: string

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null })
  set_date: string

  @Column({ type: DataType.INTEGER(1).UNSIGNED, defaultValue: 1 })
  use_flag: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0 })
  created_at: number
}

// CREATE TABLE `nft_listing_data` (
//   `idx` int(10) unsigned NOT NULL AUTO_INCREMENT,
//   `mint_idx` int(10) DEFAULT NULL,
//   `owned_idx` int(10) DEFAULT NULL,
//   `member_idx` int(10) DEFAULT NULL,
//   `nft_creator` varchar(255) DEFAULT NULL,
//   `sales_type` varchar(100) DEFAULT NULL,
//   `open_date` varchar(255) DEFAULT NULL,
//   `start_date` varchar(255) DEFAULT NULL,
//   `finish_date` varchar(255) DEFAULT NULL,
//   `sub_date` varchar(255) DEFAULT NULL,
//   `sales_royalty` varchar(45) DEFAULT NULL,
//   `nft_price` text NOT NULL,
//   `tx_id` text,
//   `item_idx` int(10) DEFAULT NULL,
//   `block_hash` text,
//   `block_number` int(10) DEFAULT NULL,
//   `nft_status` varchar(45) DEFAULT NULL,
//   `total_amount` int(10) DEFAULT NULL,
//   `remain_amount` int(10) DEFAULT NULL,
//   `burn_tx_id` text,
//   `resell_type` varchar(45) DEFAULT NULL,
//   `set_date` varchar(255) DEFAULT NULL,
//   `use_flag` int(1) unsigned DEFAULT '1',
//   PRIMARY KEY (`idx`)
// ) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8;
