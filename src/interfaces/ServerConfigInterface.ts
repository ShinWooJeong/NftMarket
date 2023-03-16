import { MysqlPrimaryDB } from "../models/mysql/bluebay"
import { ConnectionRedis } from "../modules/ConnectionRedis"
import { ServerBaseConfigInterface } from "./ServerBaseConfigInterface"

export interface ServerConfigInterface extends ServerBaseConfigInterface {
  routingLog: boolean
  express_redis_session_ttl: number
  express_redis_session_maxAge: number

  port: {
    api_port: number
  }

  redis_local: any
  redis_global: any

  redis: {
    local?: ConnectionRedis
    global?: ConnectionRedis
  }

  mysql: {
    bluebay: MysqlPrimaryDB
  }

  mailer: {
    user: string
    password: string
  }

  jwt: {
    access_secret: string
    refresh_secret: string
    access_exp: number
    refresh_exp: number
  }

  crypto: {
    cipher: string
    secret: string
    iv: string
  }

  aws: {
    key: string
    secret: string
    region: string
    bucket_name: string
    cloudfront_url: string
  }
  nft_storage_url: string
  nft_storage_key: string
}
