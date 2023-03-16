import { ServerConfigInterface } from "../interfaces/ServerConfigInterface"

import { MysqlPrimaryDB } from "../models/mysql/bluebay"
import { ConnectionRedis } from "../modules/ConnectionRedis"

const config: ServerConfigInterface = {
  env: "debug",
  publish: "stage",

  port: {
    api_port: 5001
  },

  sequelizeLog: true,
  routingLog: true,
  express_redis_session_maxAge: 86400,
  express_redis_session_ttl: 7200,

  redis_local: { host: "127.0.0.1", port: 6379, select: 0, password: "2848nre0gfewryt72zfd4ttc" },
  redis_global: { host: "127.0.0.1", port: 6380, select: 0, password: "2848nre0gfewryt72zfd4ttc" },
  redis: {
    //local: new ConnectionRedis({host: "127.0.0.1", port: 6379, select: 0, password:"2848nre0gfewryt72zfd4ttc"}),
    // global: new ConnectionRedis({host: "127.0.0.1", port: 6380, select: 0})
  },

  mysql: {
    bluebay: new MysqlPrimaryDB({
      host: "bluebaycabin-db.ctinoyvdytfm.ap-northeast-2.rds.amazonaws.com",
      port: 3306,
      dialect: "mysql",
      user: "bluebaycabin_adm",
      password: "$6YtEp*m#7K9c^5wdfqs4FSb!WZRrg",
      database: "bluebay_main"
    })
  },

  jwt: {
    access_secret: "delio_bluebay",
    refresh_secret: "bluebay_FIGHTING",
    access_exp: 60 * 60 * 2,
    refresh_exp: 60 * 60 * 24 * 356
  },

  mailer: {
    user: "help@01etc.com",
    password: "Bluebay1!"
  },

  crypto: {
    cipher: "aes-256-cbc",
    secret: "@@@^^^***@@@!!!@@@DFG@@@23S@@@##",
    iv: "aaaaaaaaaaaaaaaa"
  },

  aws: {
    key: "AKIAVYKTXJIG2XLXQWHR",
    secret: "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",
    region: "ap-northeast-2",
    bucket_name: "bluebay-mint",
    cloudfront_url: "https://d2x4x1qr5ebtg0.cloudfront.net"
  },

  nft_storage_url: "https://api.nft.storage/upload",
  nft_storage_key:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweENDRmUxYTJDNTk4NkRBZGU0MjM4YzQyNUQzQjY4MzUxQmU4MTIxNkIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MTAyMTA5NDIyMiwibmFtZSI6InRob3JwZSJ9.DsXCaybdk2Ww3pkL-o-Y71f_AJ6lxk1PMOJ_5zySxfs" // Thorpe
}

export = config
