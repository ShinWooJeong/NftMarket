export interface MysqlConfigInterface {
  name?: string
  host: string
  port: number
  dialect: string
  user: string
  password: string
  database: string
  ignoreCheck?: boolean
  sequelizeLog?: boolean
  ignoreSyncWarning?: boolean
  weight?: number
  id?: number
}
