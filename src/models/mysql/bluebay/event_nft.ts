import { Column, Table, DataType, Model } from "sequelize-typescript"

@Table({ modelName: "event_nft", tableName: "event_nft", freezeTableName: false, engine: "InnoDB", initialAutoIncrement: "1", charset: "utf8mb4" })
export class schema_event_nft extends Model<schema_event_nft> {
  @Column({ type: DataType.INTEGER(10).UNSIGNED, primaryKey: true, autoIncrement: true })
  idx: number

  @Column({ type: DataType.INTEGER(10).UNSIGNED, defaultValue: 0, comment: "이벤트 테이블 idx값" })
  event_idx: number

  @Column({ type: DataType.INTEGER(10).UNSIGNED, defaultValue: 0, comment: "nft_mint_date테이블의 idx" })
  mint_idx: number

  @Column({ type: DataType.STRING(45), defaultValue: null, comment: "KST 작성시간" })
  set_date: string

  @Column({ type: DataType.INTEGER(1).UNSIGNED, defaultValue: 0, comment: "UTC 작성시간" })
  created_at: number
}
