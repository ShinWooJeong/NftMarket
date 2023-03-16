import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "member", tableName: "member", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8mb4", collate: "utf8mb4_unicode_ci" })
export class schema_member extends Model<schema_member> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.STRING(64), defaultValue: null, allowNull: true })
  account: string

  @Column({ type: DataType.STRING(100), unique: "email_UNIQUE", allowNull: false })
  email: string

  @Column({ type: DataType.STRING(64), defaultValue: null, allowNull: true })
  pw: string

  @Column({ type: DataType.STRING(100), defaultValue: "Unnamed", allowNull: true })
  nick_name: string

  @Column({ type: DataType.STRING(5), allowNull: false })
  user_code: string

  @Column({ type: DataType.STRING(100), defaultValue: null, allowNull: true })
  recommend_code: string

  @Column({ type: DataType.STRING(255), defaultValue: "/live/img/ico_default.png", allowNull: true })
  profile_img: string

  @Column({ type: DataType.STRING(50), defaultValue: null, allowNull: true })
  profile_comment: string

  @Column({ type: DataType.STRING(255), defaultValue: null, allowNull: true })
  web_link: string

  @Column({ type: DataType.STRING(255), defaultValue: null, allowNull: true })
  insta_link: string

  @Column({ type: DataType.STRING(255), defaultValue: null, allowNull: true })
  twitter_link: string

  @Column({ type: DataType.STRING(255), defaultValue: null, allowNull: true })
  youtube_link: string

  @Column({ type: DataType.INTEGER(10), defaultValue: 0 })
  collections: number

  @Column({ type: DataType.INTEGER(10), defaultValue: 0 })
  created: number

  @Column({ type: DataType.INTEGER(10), defaultValue: 0 })
  owned: number

  @Column({ type: DataType.INTEGER(10).UNSIGNED, defaultValue: 0 })
  followers: number

  @Column({ type: DataType.INTEGER(10).UNSIGNED, defaultValue: 0 })
  following: number

  @Column({ type: DataType.STRING(1), defaultValue: "Y" })
  auction_flag: string

  @Column({ type: DataType.STRING(1), defaultValue: "Y" })
  offer_flag: string

  @Column({ type: DataType.STRING(1), defaultValue: "N" })
  approve_flag: string

  @Column({ type: DataType.STRING(255), allowNull: false })
  set_date: string

  @Column({ type: DataType.STRING(255), defaultValue: null, allowNull: true })
  del_date: string

  @Column({ type: DataType.STRING(45), defaultValue: null, allowNull: true })
  permission: string

  @Column({ type: DataType.STRING(1), defaultValue: "1", allowNull: false })
  use_flag: string

  @Column({ type: DataType.STRING(255), unique: "refresh_token_unique", allowNull: true, defaultValue: null })
  refresh_token: string

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0, comment: "마지막 로그인 성공시점" })
  last_login_at: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0, comment: "로그인 실패 카운트" })
  login_fail_cnt: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0, comment: "마지막 비밀번호 변경시점" })
  last_pw_update_at: number

  @Column({ type: DataType.INTEGER(10), allowNull: false, defaultValue: 0 })
  created_at: number
}

// CREATE TABLE `member` (
//   `idx` int(10) unsigned NOT NULL AUTO_INCREMENT,
//   `account` varchar(255) DEFAULT NULL,
//   `email` varchar(100) CHARACTER SET utf8 NOT NULL,
//   `pw` varchar(255) DEFAULT NULL,
//   `nick_name` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
//   `user_code` varchar(5) NOT NULL,
//   `recommend_code` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
//   `profile_img` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
//   `profile_comment` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
//   `web_link` varchar(255) DEFAULT NULL,
//   `insta_link` varchar(255) DEFAULT NULL,
//   `twitter_link` varchar(255) DEFAULT NULL,
//   `youtube_link` varchar(255) DEFAULT NULL,
//   `collections` int(10) DEFAULT '0',
//   `created` int(10) DEFAULT '0',
//   `owned` int(10) DEFAULT '0',
//   `followers` int(10) DEFAULT '0',
//   `following` int(10) DEFAULT '0',
//   `auction_flag` varchar(1) DEFAULT 'Y',
//   `offer_flag` varchar(1) DEFAULT 'Y',
//   `approve_flag` varchar(1) DEFAULT 'N',
//   `set_date` varchar(255) CHARACTER SET utf8 NOT NULL,
//   `del_date` varchar(255) DEFAULT NULL,
//   `permission` varchar(45) DEFAULT NULL,
//   `use_flag` varchar(1) CHARACTER SET utf8 NOT NULL DEFAULT '1',
//   PRIMARY KEY (`idx`),
//   UNIQUE KEY `email_UNIQUE` (`email`)
// ) ENGINE=InnoDB AUTO_INCREMENT=8738 DEFAULT CHARSET=utf8mb4;
