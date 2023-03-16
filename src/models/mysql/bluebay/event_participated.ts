import { Column, Table, DataType, Model } from "sequelize-typescript"

@Table({ modelName: "event_participated", tableName: "event_participated", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8mb4" })
export class schema_event_participated extends Model<schema_event_participated> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.INTEGER(10).UNSIGNED, allowNull: false, defaultValue: 0, comment: "회원 테이블 idx값" })
  member_idx: number

  @Column({ type: DataType.INTEGER(10).UNSIGNED, allowNull: false, defaultValue: 0, comment: "이벤트 테이블 idx값" })
  event_idx: number

  @Column({ type: DataType.INTEGER(10).UNSIGNED, allowNull: false, defaultValue: 0 })
  mint_idx: number

  @Column({ type: DataType.STRING(45), defaultValue: null })
  name: string

  @Column({ type: DataType.STRING(45), defaultValue: null })
  email: string

  @Column({ type: DataType.STRING(45), defaultValue: null })
  phone_number: string

  @Column({ type: DataType.TEXT, defaultValue: null })
  artist_info: string

  @Column({ type: DataType.TEXT, defaultValue: null })
  collecting_info: string

  @Column({ type: DataType.STRING(255), defaultValue: null })
  file: string

  @Column({ type: DataType.STRING(45), defaultValue: null, comment: "KST 작성시간" })
  set_date: string

  @Column({ type: DataType.INTEGER(1).UNSIGNED, defaultValue: 0, comment: "UTC 작성시간" })
  created_at: number
}
