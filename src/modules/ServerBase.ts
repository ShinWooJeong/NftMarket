import * as path from "path"
import * as EventEmitter from "events"
import * as _ from "lodash"
import * as minimist from "minimist"

import { LogHelper } from "../helpers/LogHelper"
import { ServerInterface } from "../interfaces/ServerInterface"
import { ServerBaseConfigInterface } from "../interfaces/ServerBaseConfigInterface"

export default class ServerBase extends EventEmitter implements ServerInterface {
  configPath: string
  config: ServerBaseConfigInterface
  argv: minimist.ParsedArgs
  onceStarted: boolean = false
  running: boolean = false
  tmpStopIssue: { [issue: string]: string[] } = {}
  stopIssue: { [issue: string]: string[] } = {}

  constructor(config: ServerBaseConfigInterface = null) {
    super()
    this.config = config
    this.argv = minimist(process.argv.slice(2))
    this.configPath = this.argv.config
    this.loadConfig(this.configPath)
    const loggerOption = {
      log_path: path.join(process.cwd(), "log/"),
      jsonLog: this.config.jsonLog
    }
    LogHelper.init(loggerOption)
  }


  async serverStartForApi(config = {}) {
    LogHelper.info("#################################################")
    LogHelper.info("[server base] Api Server Start...")
    try {
      _.extend(this.config, config)

      LogHelper.info("==================== DATABASE ===================")
      await this.connectDb()
      LogHelper.info("[server base] Database Connected")

      await this.doServerStartForApi()
      this.onceStarted = true
      this.running = true
      this.fixStopIssue()
    } catch (e) {
      LogHelper.error(e)
      process.exit(-1)
    }
  }

  loadConfig(config: string) {
    if (config == null) {
      return
    }
    LogHelper.info(`configFile : ${config}`)
    const configPath = path.isAbsolute(config) ? config : path.join(process.cwd(), config)
    const newConfig = require(configPath)
    this.config = Object.assign(this.config || {}, newConfig)
    LogHelper.info("config require done")
  }

  async connectDb() {
    const startTime = new Date()
    const isSequential = this.config.sequentialConnectDB === true
    const promises: Promise<any>[] = []

    for (const key in this.config.mysql || {}) {
      const rdb = this.config.mysql[key]
      rdb.config.name = key
      LogHelper.info("--------------------- mysql ---------------------")
      rdb.config.ignoreSyncWarning = this.config.ignoreSyncWarning
      rdb.config.sequelizeLog = this.config.sequelizeLog
      const promise = rdb.sync(this)
      if (isSequential) {
        await promise
      } else {
        promises.push(promise)
      }
    }

    if (isSequential === false) {
      await Promise.all(promises)
    }

    LogHelper.info(`connect db elapse : ${(new Date().getTime() - startTime.getTime()) / 1000}`)
  }

  async doServerStartForApi(): Promise<any> {}

  fixStopIssue() {
    this.stopIssue = this.tmpStopIssue
    this.tmpStopIssue = {}
  }

  stop(issue: string, detail: string) {
    const self = this

    if (issue) {
      if (detail) {
        if (Object.prototype.hasOwnProperty.call(self.tmpStopIssue, issue) === false) {
          self.tmpStopIssue[issue] = []
        }
        self.tmpStopIssue[issue].push(detail)
      } else {
        if (Object.prototype.hasOwnProperty.call(self.tmpStopIssue, "any") === false) {
          self.tmpStopIssue.any = []
        }
        self.tmpStopIssue.any.push(issue)
      }
    }

    if (self.running === true) {
      self.running = false
      LogHelper.info("server stopped.")
    }
  }

  resume() {
    const self = this

    let mdbAvailable: any = true
    for (const key in self.config.redis) {
      if (self.config.redis[key].redis.connected === false) {
        mdbAvailable = false
      }
    }

    if (self.running === true) {
      if (mdbAvailable === false) {
        LogHelper.info("waiting... some mdb to be recovered!")
        self.stop(null, null)
      }
    } else if (mdbAvailable === true) {
      LogHelper.info("server is recovered.")
      self.running = true
      self.fixStopIssue()
    }
  }
}
