import * as util from "util"
import * as redis from "redis"
import * as _ from "lodash"
import { LogHelper } from "../helpers/LogHelper"
import { ServerInterface } from "../interfaces/ServerInterface"
import { RedisConfigConfig } from "../interfaces/RedisConfigInterface"

export class ConnectionRedis {
  config: RedisConfigConfig
  server: ServerInterface
  redis: redis.RedisClient
  handlerDict: { [id: string]: Function } = {}

  constructor(config: RedisConfigConfig) {
    this.config = config
  }

  async connect(server: ServerInterface) {
    this.server = server
    this.redis = await this.createRedisClient(this.config.name, this.config.host, this.config.port, this.config.select, this.config.subscribe)
  }

  createRedisClient(name, host, port, select, subscribe): Promise<redis.RedisClient> {
    const self = this

    LogHelper.info(util.format("[redis][%s] connect to %s:%d", name, host, port))
    return new Promise<redis.RedisClient>((resolve, reject) => {
      const client: redis.RedisClient = redis.createClient(port, host, {
        retry_strategy(options) {
          return 10000
        }
      })

      client.on("connect", (ret) => {
        LogHelper.info(util.format("[redis][%s] connected!", name))
        if (self.server.onceStarted === true) {
          self.server.resume()
        }
      })

      client.on("subscribe", (channel, count) => {
        LogHelper.info(util.format("[redis][%s] subscribed channel = %s, count = %d", name, channel, count))
      })
      client.on("message", (channel, message) => {
        try {
          const handler = self.handlerDict[channel]

          if (handler) {
            handler(message)
          }

          // self.server.messageWrap(channel, message, self.config)
        } catch (err) {
          LogHelper.error(err)
        }
      })

      client.once("ready", (ret) => {
        if (self.server.onceStarted === true) {
          LogHelper.info(util.format("[redis][%s] recovered!", name))
        } else {
          LogHelper.info(util.format("[redis][%s] ready!", name))
        }
        if (select >= 0 && subscribe === undefined) {
          client.select(select, (err, res) => {
            if (err) {
              LogHelper.error(util.format("[redis][%s] select %d error:", name, select))
              LogHelper.error(err.stack)
            } else {
              LogHelper.info(util.format("[redis][%s] select %d succeed!", name, select))
              resolve(client)
            }
          })
        } else if (subscribe && subscribe.length > 0) {
          client.subscribe(subscribe, (err, msg) => {
            resolve(client)
          })
        } else {
          resolve(client)
        }
      })
      client.on("reconnecting", (ret) => {})
      client.on("error", () => {})
      client.on("end", () => {
        LogHelper.warn(util.format("[redis][%s] end!", name))
        self.server.stop("mdb", name)
      })
    })
  }

  async setHandler(handlerDict: { [id: string]: Function }) {
    this.handlerDict = handlerDict

    await this.subscribe(Object.keys(handlerDict))
  }

  flushall() {
    return new Promise<string>((resolve, reject) => {
      this.redis.flushall((err, msg) => {
        if (err) {
          return reject(err)
        }
        return resolve(msg)
      })
    })
  }

  flushdb() {
    return new Promise<string>((resolve, reject) => {
      this.redis.flushdb((err, msg) => {
        if (err) {
          return reject(err)
        }
        return resolve(msg)
      })
    })
  }

  select(key: string) {
    return new Promise<number>((resolve, reject) => {
      this.redis.select(key)
    })
  }

  subscribe(subscribe: string | string[]): Promise<string> {
    if (_.isArray(subscribe) && subscribe.length <= 0) {
      return null
    }

    return new Promise<string>((resolve, reject) => {
      this.redis.subscribe(subscribe, (err, msg: string) => {
        if (err) {
          return reject(err)
        }
        return resolve(msg)
      })
    })
  }

  expire(key: string, seconds: number) {
    return new Promise<number>((resolve, reject) => {
      this.redis.expire(key, seconds, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  hexists(key: string, field: string) {
    return new Promise<number>((resolve, reject) => {
      this.redis.hexists(key, field, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  exists(key: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.redis.exists(key, (err, reply) => {
        if (_.isObject(err) === true) {
          return reject(err)
        }
        // reply: 0:not exists, 1:exists
        return resolve(reply === 1)
      })
    })
  }

  set(key: string, value: string) {
    console.log("=========================")
    // console.log(this.redis)
    return new Promise<string>((resolve, reject) => {
      this.redis.set(key, value, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  lset(key: string, index: number, value: string) {
    return new Promise<string>((resolve, reject) => {
      this.redis.lset(key, index, value, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  hmset(key: string, ...args: any[]) {
    return new Promise<any>((resolve, reject) => {
      let newArgs = args
      if (args.length > 0 && _.isObject(args[0])) {
        newArgs = args[0] as any
      }

      this.redis.hmset(key, newArgs as any, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  hset(key: string, field: string, value: string) {
    return new Promise<number>((resolve, reject) => {
      this.redis.hset(key, field, value, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  get(key: string) {
    return new Promise<string>((resolve, reject) => {
      this.redis.get(key, (err, res: string) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  hget(key: string, field: string) {
    return new Promise<string>((resolve, reject) => {
      this.redis.hget(key, field, (err, res: string) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  hgetall(key: string) {
    return new Promise<{ [key: string]: string }>((resolve, reject) => {
      this.redis.hgetall(key, (err, res: { [key: string]: string }) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  hincrby(key: string, field: string, incr: number) {
    return new Promise<number>((resolve, reject) => {
      this.redis.hincrby(key, field, incr, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  zcard(key: string) {
    return new Promise<number>((resolve, reject) => {
      this.redis.zcard(key, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  zrange(key: string, start: number, stop: number, withscore: string = "WITHSCORES") {
    return new Promise<string[]>((resolve, reject) => {
      this.redis.zrange(key, start, stop, withscore, (err, res: string[]) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  zrevrange(key: string, start: number, stop: number, withscore: string = "WITHSCORES") {
    return new Promise<string[]>((resolve, reject) => {
      this.redis.zrange(key, start, stop, withscore, (err, res: string[]) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  del(key: string) {
    return new Promise((resolve, reject) => {
      this.redis.del(key, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  hdel(key: string, ...args: string[]) {
    return new Promise<number>((resolve, reject) => {
      this.redis.hdel(key, args, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  keys(key: string) {
    return new Promise<string[]>((resolve, reject) => {
      this.redis.keys(key, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  scan(key: string[]) {
    return new Promise<[string, string[]]>((resolve, reject) => {
      this.redis.scan(key, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  srem(key: string, ...args: string[]) {
    return new Promise<number>((resolve, reject) => {
      this.redis.srem(key, args, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  scard(key: string) {
    return new Promise<number>((resolve, reject) => {
      this.redis.scard(key, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  sadd(key: string, args: string | any[]) {
    return new Promise<number>((resolve, reject) => {
      this.redis.sadd(key, args, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  smembers(key: string) {
    return new Promise<string[]>((resolve, reject) => {
      this.redis.smembers(key, (err, res: string[]) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  srandmember(key: string, count: number) {
    return new Promise<string[]>((resolve, reject) => {
      this.redis.srandmember(key, count, (err, res: string[]) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  publish(channel: string, value: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.redis.publish(channel, value, (err, msg: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(msg)
      })
    })
  }

  rpush(key: string, value: string) {
    return new Promise<number>((resolve, reject) => {
      this.redis.rpush(key, value, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  rpushlist(key: string, value: string[]) {
    return new Promise<number>((resolve, reject) => {
      this.redis.rpush(key, value, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  lrangeAll(key: string) {
    return new Promise<string[]>((resolve, reject) => {
      this.redis.lrange(key, 0, -1, (err, res: string[]) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  // 최신�이���가��기능
  lrangeLasts(key: string, count: number) {
    return new Promise<string[]>((resolve, reject) => {
      if (count <= 0) {
        reject(new Error("lrangeLasts count invalid!!"))
        return
      }
      this.redis.lrange(key, count * -1, -1, (err, res: string[]) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  lindexLast(key: string) {
    return new Promise<string>((resolve, reject) => {
      this.redis.lindex(key, -1, (err, res: string) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  ltrim(key: string, count: number) {
    return new Promise<string>((resolve, reject) => {
      if (count <= 0) {
        reject(new Error(`ltrim count(${count}) invalid`))
        return
      }
      // this.redis.ltrim(key, 0, count, function(err, res: string) {
      this.redis.ltrim(key, count * -1, -1, (err, res: string) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  /*
    set(key:string, value:string)
    {
        return new Promise<string>((resolve, reject)=>{
            this.redis.set(key, value, function (err,res:string) {
                if(err)
                {
                    return reject(err)
                }
                resolve(res)
            })
        })
    }

    get(key:string)
    {
        return new Promise<string>((resolve, reject)=>{
            this.redis.get(key, function (err,res) {
                if(err)
                {
                    return reject(err)
                }
                resolve(res)
            })
        })
    }
*/
  persist(key: string) {
    return new Promise<number>((resolve, reject) => {
      this.redis.persist(key, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  exec(multi) {
    return new Promise<string>((resolve, reject) => {
      multi.exec((err, msg: string) => {
        if (_.isObject(err) === true) {
          reject(err)
        } else {
          // msg:'OK'
          resolve(msg)
        }
      })
    })
  }
}
