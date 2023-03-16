import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ modelName: "file_upload", tableName: "file_upload", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8" })
export class schema_file_upload extends Model<schema_file_upload> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.STRING(100), defaultValue: null, allowNull: true })
  user_idx: number

  @Column({ type: DataType.TEXT, allowNull: false })
  link_name: string

  @Column({ type: DataType.STRING(255), defaultValue: null, allowNull: true })
  thumb_link: string

  @Column({ type: DataType.TEXT, allowNull: false })
  upload_filename: string

  @Column({ type: DataType.TEXT, allowNull: false })
  db_filename: string

  @Column({ type: DataType.TEXT, allowNull: false })
  file_path: string

  @Column({ type: DataType.TEXT, allowNull: false })
  file_size: string

  @Column({ type: DataType.TEXT, allowNull: false })
  file_type: string

  @Column({ type: DataType.TEXT, allowNull: false })
  upload_date: string

  @Column({ type: DataType.TEXT, allowNull: false })
  ip: string

  @Column({ type: DataType.TEXT, allowNull: false })
  width: string

  @Column({ type: DataType.TEXT, allowNull: false })
  height: string

  @Column({ type: DataType.STRING(30), allowNull: true, defaultValue: null })
  img_ratio: string

  @Column({ type: DataType.INTEGER(1).UNSIGNED, defaultValue: 0 })
  rotate: number
}

// CREATE TABLE `file_upload` (
//   `idx` int(10) unsigned NOT NULL AUTO_INCREMENT,
//   `user_idx` varchar(100) DEFAULT NULL,
//   `link_name` text NOT NULL,
//   `thumb_link` varchar(255) DEFAULT NULL,
//   `upload_filename` text NOT NULL,
//   `db_filename` text NOT NULL,
//   `file_path` text NOT NULL,
//   `file_size` text NOT NULL,
//   `file_type` text NOT NULL,
//   `upload_date` text NOT NULL,
//   `ip` text NOT NULL,
//   `width` text NOT NULL,
//   `height` text NOT NULL,
//   `img_ratio` varchar(30) DEFAULT NULL,
//   `rotate` int(1) unsigned DEFAULT '0',
//   PRIMARY KEY (`idx`)
// ) ENGINE=InnoDB AUTO_INCREMENT=617 DEFAULT CHARSET=utf8;
