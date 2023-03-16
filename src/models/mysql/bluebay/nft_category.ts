import { Table, Column, Model, DataType } from 'sequelize-typescript'

@Table({modelName: 'nft_category', tableName: 'nft_category', freezeTableName: false, engine: 'InnoDB', initialAutoIncrement: '1', charset: 'utf8mb4'})
export class schema_nft_category extends Model<schema_nft_category> {
  @Column({type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true})
  idx: number

  @Column({type: DataType.STRING(255), allowNull: true, defaultValue: null})
  category_name: string

  @Column({type: DataType.STRING(45), allowNull: true, defaultValue: null})
  set_date: string

  @Column({type: DataType.INTEGER(1), defaultValue: 1})
  use_flag: number

}


// CREATE TABLE `nft_category` (
//   `idx` int(10) unsigned NOT NULL AUTO_INCREMENT,
//   `` varchar(255) DEFAULT NULL,
//   `set_date` varchar(45) DEFAULT NULL,
//   `use_flag` int(1) DEFAULT '1',
//   PRIMARY KEY (`idx`)
// ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

