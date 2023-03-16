import { Table, Column, Model, DataType } from 'sequelize-typescript'

@Table({modelName: 'cron_data', tableName: 'cron_data', freezeTableName: false, engine: 'InnoDB', initialAutoIncrement: '1', charset: 'utf8mb4'})
export class schema_cron_data extends Model<schema_cron_data> {
  @Column({type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true})
  idx: number

  @Column({type: DataType.STRING(255), defaultValue: null, allowNull: true})
  memo: string

  @Column({type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW})
  date: string

  @Column({type: DataType.INTEGER(1).UNSIGNED, defaultValue: 1})
  use_flag: number
}


// CREATE TABLE `cron_data` (
//   `idx` int(10) unsigned NOT NULL AUTO_INCREMENT,
//   `memo` varchar(255) DEFAULT NULL,
//   `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   `use_flag` int(1) DEFAULT '1',
//   PRIMARY KEY (`idx`)
// ) ENGINE=InnoDB AUTO_INCREMENT=721 DEFAULT CHARSET=utf8mb4;


