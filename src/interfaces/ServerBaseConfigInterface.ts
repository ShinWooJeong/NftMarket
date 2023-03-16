import { ConnectionMysql } from "../modules/ConnectionMysql"
import { ConnectionRedis } from "../modules/ConnectionRedis"
import { ServerInfoInterface } from "./ServerInfoInterface";


export interface ServerBaseConfigInterface {
  info?: ServerInfoInterface

  redis?: { [id: string]: ConnectionRedis }
  mysql?: { [id: string]: ConnectionMysql }

  env?: string
  publish?: string // test, qa, prod



  sequentialConnectDB?: boolean
  jsonLog?: boolean
  sequelizeLog?: boolean
  ignoreSyncWarning?: boolean
}
