import { Table, Column, Model, DataType } from 'sequelize-typescript'

@Table({modelName: 'op_server_setting', tableName: 'op_server_setting', freezeTableName: false, engine: 'InnoDB', initialAutoIncrement: '1', charset: 'utf8mb4'})
export class schema_op_server_setting extends Model<schema_op_server_setting> {
  @Column({type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true})
  idx: number

  @Column({type: DataType.STRING(255), allowNull: true, defaultValue: null})
  platform_address: string

  @Column({type: DataType.STRING(255), allowNull: true, defaultValue: null})
  fee_rate: string

  @Column({type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW})
  date: string

  @Column({type: DataType.INTEGER(1).UNSIGNED, defaultValue: 1})
  use_flag: number

}


