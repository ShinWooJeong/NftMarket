import { ENUM, INTEGER, STRING } from "sequelize"
import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "nft_mint_data", tableName: "nft_mint_data", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8" })
export class schema_nft_mint_data extends Model<schema_nft_mint_data> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: "user" })
  mint_type: string

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0 })
  collection_idx: number

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null }) // 작품을 등록하는 사용자 계정의 idx
  member_idx: number

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null }) // 작품을 등록하는 사용자의 지갑주소인듯
  nft_creator: string

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null }) // mime type
  nft_type: string

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null }) // 작품을 등록할 때 등록자가 넣는 로얄티 fee
  nft_royalty: string

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null }) // 등록할 때 받는 카테고리
  nft_category: string

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null }) // cf로된 이미지 주소
  nft_img: string

  @Column({ type: DataType.TEXT, allowNull: false })
  nft_title: string

  @Column({ type: DataType.TEXT, allowNull: false })
  nft_desc: string

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null })
  nft_price: string

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null })
  metadata_url: string

  @Column({ type: DataType.TEXT })
  ipfs_url: string

  @Column({ type: DataType.TEXT })
  nft_url: string

  @Column({ type: DataType.TEXT })
  ios_url: string

  @Column({ type: DataType.INTEGER(10), allowNull: true, defaultValue: null })
  item_amount: number

  @Column({ type: DataType.STRING(45), allowNull: false, defaultValue: "create" })
  nft_status: string

  @Column({ type: DataType.STRING(45), allowNull: false, defaultValue: "aution" })
  sales_type: string

  @Column({ type: DataType.INTEGER(10), defaultValue: 0 })
  view_hit: number

  @Column({ type: DataType.STRING(1), defaultValue: "Y" })
  search_flag: string

  @Column({ type: DataType.INTEGER(10), defaultValue: 0 })
  currency: number

  @Column({ type: DataType.ENUM("N", "Y"), defaultValue: "Y" })
  is_main_display: string

  @Column({ type: DataType.TEXT, allowNull: true, defaultValue: null })
  nft_tag: string

  @Column({ type: DataType.INTEGER(1).UNSIGNED, defaultValue: 1 })
  use_flag: number

  @Column({ type: DataType.STRING(1), allowNull: false, defaultValue: "N" })
  admin_chk: string

  @Column({ type: INTEGER(10), allowNull: false, defaultValue: 0 })
  admin_chk_at: number

  @Column({ type: STRING(15), defaultValue: "#e7eff4" })
  background: string

  @Column({ type: INTEGER(10), allowNull: false, defaultValue: 0 })
  favorite_cnt: number

  @Column({ type: DataType.STRING(64), allowNull: true, defaultValue: null })
  event_type: string

  @Column({ type: DataType.STRING(255), allowNull: true, defaultValue: null })
  set_date: string

  @Column({ type: INTEGER(10), allowNull: false, defaultValue: 0 })
  created_at: number
}

// CREATE TABLE `nft_mint_data` (
//   `idx` int(10) unsigned NOT NULL AUTO_INCREMENT,
//   `mint_type` varchar(255) DEFAULT NULL,
//   `author_idx` int(10) DEFAULT NULL,
//   `collection_idx` int(10) DEFAULT NULL,
//   `member_idx` int(10) DEFAULT NULL,
//   `nft_creator` varchar(255) DEFAULT NULL,
//   `nft_type` varchar(255) DEFAULT NULL,
//   `nft_royalty` varchar(255) DEFAULT NULL,
//   `nft_category` varchar(255) DEFAULT NULL,
//   `nft_img` varchar(255) DEFAULT NULL,
//   `nft_title` text NOT NULL,
//   `nft_desc` text NOT NULL,
//   `nft_price` varchar(255) DEFAULT NULL,
//   `metadata_url` varchar(255) DEFAULT NULL,
//   `ipfs_url` text,
//   `nft_url` text,
//   `ios_url` text,
//   `item_amount` int(10) DEFAULT NULL,
//   `nft_status` varchar(45) DEFAULT NULL,
//   `sales_type` varchar(45) DEFAULT NULL,
//   `view_hit` int(10) DEFAULT '0',
//   `search_flag` varchar(1) DEFAULT 'Y',
//   `currency` int(10) DEFAULT '0',
//   `nft_tag` text,
//   `admin_chk` varchar(1) DEFAULT 'N',
//   `set_date` varchar(255) DEFAULT NULL,
//   `use_flag` int(1) unsigned DEFAULT '1',
//   PRIMARY KEY (`idx`)
// ) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8;
