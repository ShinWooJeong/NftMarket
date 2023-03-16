import * as _ from 'lodash'
import * as winston from 'winston'
import * as mkdirp from 'mkdirp'
import { DateHelpers } from "./DateHelpers";

let winstonLogger: winston.Logger = null

export interface LogHelperOptions {
  log_path?: string
  json_log?: boolean
}

export namespace LogHelper {
  let option: LogHelperOptions = {}

  export function init(_option: LogHelperOptions = {}) {
    option = _.assign(option, _option)

    mkdirp(option.log_path)

    const logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [],
    })

    const colorizer = winston.format.colorize()
    if (option.json_log === true) {
      logger.add(
        new winston.transports.Console({
          format: winston.format.json(),
        }),
      )
    } else {
      const currentDateTime = DateHelpers.getCurrentUTCDateTime()
      logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
            winston.format.printf(msg =>
              colorizer.colorize(msg.level, `[ ${currentDateTime} ] ${msg.level}: ${msg.message}`),
            ),
          ),
        }),
      )
    }

    winstonLogger = logger

    return logger
  }

  export function objToString(obj: any) {
    if (_.isString(obj)) {
      return obj
    }
    if (_.isString(obj.message)) {
      const message = obj.message
      delete obj.message
      return `${message}\n${JSON.stringify(obj)}`
    }
    return JSON.stringify(obj)
  }

  export function errorToString(e: any) {
    if (_.isString(e)) {
      return e
    }
    if (e instanceof Error) {
      return `${e.message}\n${JSON.stringify(e)}\n${e.stack}`
    }
    return `Obj : ${JSON.stringify(e)}`
  }

  export function info(obj: any, params: object = null) {
    let newObj = obj
    if (params) {
      newObj = {...params, message: obj}
    }

    if (winstonLogger == null) {
      return console.log(newObj)
    }
    if (option.json_log === true) {
      return winstonLogger.info(newObj)
    }

    return winstonLogger.info(objToString(newObj))
  }

  export function warn(obj: any, params: object = null) {
    let newObj = obj
    if (params) {
      newObj = {message: obj, ...params}
    }

    if (winstonLogger == null) {
      return console.log(newObj)
    }

    if (option.json_log === true) {
      return winstonLogger.warn(newObj)
    }

    return winstonLogger.warn(objToString(newObj))
  }

  export function error(err: any, params: object = null) {
    let newErr = err
    if (params) {
      newErr = Object.assign(err, params)
    }

    if (winstonLogger == null) {
      return console.log(`error : ${errorToString(err)}`)
    }

    if (option.json_log === true) {
      if (err instanceof Error) {
        newErr = _.assign({message: err.message, stack: err.stack.split('\n')}, err)

        const at = new Error().stack.split('at ')
        newErr.func = at[1].split(' ')[0]
        newErr.func = newErr.func === 'Object.error' ? at[2].split(' ')[0] : newErr.func
      }

      return winstonLogger.error(newErr)
    }

    return winstonLogger.error(errorToString(newErr))
  }
}
