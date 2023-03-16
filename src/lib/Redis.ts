import * as util from "util"
import * as redis from "redis"
import * as _ from "lodash"
import { LogHelper } from "../helpers/LogHelper"
import { ServerInterface } from "../interfaces/ServerInterface"
import { RedisConfigConfig } from "../interfaces/RedisConfigInterface"

export class Redis {
  private static instance: Redis

  config: RedisConfigConfig
  redis: any
  client: any

  public static getInstance(config: RedisConfigConfig) {
    return this.instance || (this.instance = new Redis(config))
  }

  constructor(config: RedisConfigConfig) {
    this.client = redis.createClient({ host: config.host, port: config.port, password: config.password, connect_timeout: 3600 })
    this.client.on("connect", (ret) => {
      LogHelper.info(util.format("[redis][%s] connected!", config.name))
    })
  }

  async flushall() {
    return new Promise<string>((resolve, reject) => {
      this.client.flushall((err, msg) => {
        if (err) {
          return reject(err)
        }
        return resolve(msg)
      })
    })
  }

  async flushdb() {
    return new Promise<string>((resolve, reject) => {
      this.client.flushdb((err, msg) => {
        if (err) {
          return reject(err)
        }
        return resolve(msg)
      })
    })
  }

  async select(key: string) {
    return new Promise<number>((resolve, reject) => {
      this.client.select(key)
    })
  }

  async subscribe(subscribe: string | string[]): Promise<string> {
    if (_.isArray(subscribe) && subscribe.length <= 0) {
      return null
    }

    return new Promise<string>((resolve, reject) => {
      this.client.subscribe(subscribe, (err, msg: string) => {
        if (err) {
          return reject(err)
        }
        return resolve(msg)
      })
    })
  }

  async expire(key: string, seconds: number) {
    return new Promise<number>((resolve, reject) => {
      this.client.expire(key, seconds, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async hexists(key: string, field: string) {
    return new Promise<number>((resolve, reject) => {
      this.client.hexists(key, field, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async exists(key: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.client.exists(key, (err, reply) => {
        if (_.isObject(err) === true) {
          return reject(err)
        }
        // reply: 0:not exists, 1:exists
        return resolve(reply === 1)
      })
    })
  }

  async set(key: string, value: string) {
    console.log("=========================")
    // console.log(this.redis)
    return new Promise<string>((resolve, reject) => {
      this.client.set(key, value, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async lset(key: string, index: number, value: string) {
    return new Promise<string>((resolve, reject) => {
      this.client.lset(key, index, value, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async hmset(key: string, ...args: any[]) {
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

  async hset(key: string, field: string, value: string) {
    return new Promise<number>((resolve, reject) => {
      this.client.hset(key, field, value, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async get(key: string) {
    return new Promise<string>((resolve, reject) => {
      this.client.get(key, (err, res: string) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async hget(key: string, field: string) {
    return new Promise<string>((resolve, reject) => {
      this.client.hget(key, field, (err, res: string) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async hgetall(key: string) {
    return new Promise<{ [key: string]: string }>((resolve, reject) => {
      this.client.hgetall(key, (err, res: { [key: string]: string }) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async hincrby(key: string, field: string, incr: number) {
    return new Promise<number>((resolve, reject) => {
      this.client.hincrby(key, field, incr, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async zcard(key: string) {
    return new Promise<number>((resolve, reject) => {
      this.client.zcard(key, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async zrange(key: string, start: number, stop: number, withscore: string = "WITHSCORES") {
    return new Promise<string[]>((resolve, reject) => {
      this.client.zrange(key, start, stop, withscore, (err, res: string[]) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async zrevrange(key: string, start: number, stop: number, withscore: string = "WITHSCORES") {
    return new Promise<string[]>((resolve, reject) => {
      this.client.zrange(key, start, stop, withscore, (err, res: string[]) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async del(key: string) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  hdel(key: string, ...args: string[]) {
    return new Promise<number>((resolve, reject) => {
      this.client.hdel(key, args, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async keys(key: string) {
    return new Promise<string[]>((resolve, reject) => {
      this.client.keys(key, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async scan(key: string[]) {
    return new Promise<[string, string[]]>((resolve, reject) => {
      this.client.scan(key, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async srem(key: string, ...args: string[]) {
    return new Promise<number>((resolve, reject) => {
      this.client.srem(key, args, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async scard(key: string) {
    return new Promise<number>((resolve, reject) => {
      this.client.scard(key, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async sadd(key: string, args: string | any[]) {
    return new Promise<number>((resolve, reject) => {
      this.client.sadd(key, args, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async smembers(key: string) {
    return new Promise<string[]>((resolve, reject) => {
      this.client.smembers(key, (err, res: string[]) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async srandmember(key: string, count: number) {
    return new Promise<string[]>((resolve, reject) => {
      this.client.srandmember(key, count, (err, res: string[]) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async publish(channel: string, value: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.client.publish(channel, value, (err, msg: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(msg)
      })
    })
  }

  async rpush(key: string, value: string) {
    return new Promise<number>((resolve, reject) => {
      this.client.rpush(key, value, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  async rpushlist(key: string, value: string[]) {
    return new Promise<number>((resolve, reject) => {
      this.client.rpush(key, value, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  lrangeAll(key: string) {
    return new Promise<string[]>((resolve, reject) => {
      this.client.lrange(key, 0, -1, (err, res: string[]) => {
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
      this.client.lrange(key, count * -1, -1, (err, res: string[]) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  lindexLast(key: string) {
    return new Promise<string>((resolve, reject) => {
      this.client.lindex(key, -1, (err, res: string) => {
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
      this.client.ltrim(key, count * -1, -1, (err, res: string) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  persist(key: string) {
    return new Promise<number>((resolve, reject) => {
      this.client.persist(key, (err, res: number) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }
}
