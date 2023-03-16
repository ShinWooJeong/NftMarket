import * as _ from "lodash"
const MODEL_NAME_KEY = "sequelize:modelName"
const ATTRIBUTES_KEY = "sequelize:attributes"
const OPTIONS_KEY = "sequelize:options"

import { Sequelize, IPartialDefineAttributeColumnOptions, IFindOptions, ICreateOptions, ICountOptions, Model } from "sequelize-typescript"
import { FilteredModelAttributes } from "sequelize-typescript/lib/models/Model"
import { UpsertOptions, DestroyOptions, UpdateOptions, InstanceIncrementDecrementOptions, BulkCreateOptions, Transaction } from "sequelize"
import { IFindOrInitializeOptions } from "sequelize-typescript/lib/interfaces/IFindOrInitializeOptions"

import { ServerInterface } from "../interfaces/ServerInterface"
import { LogHelper } from "../helpers/LogHelper"
import { MysqlConfigInterface } from "../interfaces/MysqlConfigInterface"

export function getModelName(target) {
  return Reflect.getMetadata(MODEL_NAME_KEY, target)
}

export function getAttributes(target) {
  const attributes = Reflect.getMetadata(ATTRIBUTES_KEY, target)
  if (attributes == null) {
    return null
  }
  return Object.keys(attributes).reduce((copy, key) => {
    copy[key] = { ...attributes[key] }
    return copy
  }, {})
}

export function getOptions(target) {
  const options = Reflect.getMetadata(OPTIONS_KEY, target)
  if (options == null) {
    return null
  }
  return { ...options }
}

export abstract class BaseRdbModel {
  modelName
  attributes
  options
  connection: ConnectionMysql

  init(connection: ConnectionMysql) {}
}

function checkColumnType(sequelizeType, rawDbType: string) {
  const lengthExec = /\((.+)\)/.exec(rawDbType)
  const lengthStr = lengthExec ? lengthExec[1] : null
  const lengthAndDecimal = lengthStr ? lengthStr.split(",") : []
  let decimalLength: number = null
  let typeLength = Number(lengthStr)
  if (lengthAndDecimal.length >= 2) {
    typeLength = Number(lengthAndDecimal[0])
    decimalLength = Number(lengthAndDecimal[1])
  }

  const dbType = lengthExec ? rawDbType.substr(0, lengthExec.index) : rawDbType

  if (sequelizeType.key === "UUID") {
    if (rawDbType === "CHAR(36)") {
      return true
    }
  } else if (sequelizeType.key === "STRING") {
    if (dbType === "VARCHAR" && (!sequelizeType._length || sequelizeType._length === typeLength)) {
      return true
    }
  } else if (sequelizeType.key === "INTEGER") {
    if (dbType === "INT" && (!sequelizeType._length || sequelizeType._length === typeLength)) {
      return true
    }
  } else if (sequelizeType.key === "BIGINT") {
    if (dbType === "BIGINT" && (!sequelizeType._length || sequelizeType._length === typeLength)) {
      return true
    }
  } else if (sequelizeType.key === "SMALLINT") {
    if (dbType === "SMALLINT" && (!sequelizeType._length || sequelizeType._length === typeLength)) {
      return true
    }
  } else if (sequelizeType.key === "TINYINT") {
    if (dbType === "TINYINT" && (!sequelizeType._length || sequelizeType._length === typeLength)) {
      return true
    }
  } else if (sequelizeType.key === "FLOAT") {
    if (dbType === "FLOAT" && (!sequelizeType._length || (sequelizeType._length === typeLength && sequelizeType._decimals === decimalLength))) {
      return true
    }
  } else if (sequelizeType.key === "DECIMAL") {
    if (dbType === "DECIMAL" && (!sequelizeType._length || (sequelizeType._length === typeLength && sequelizeType._decimals === decimalLength))) {
      return true
    }
  } else if (sequelizeType.key === "BOOLEAN") {
    if (rawDbType === "TINYINT(1)") {
      return true
    }
  } else if (sequelizeType.key === "DATE") {
    if (dbType === "DATETIME" && (!sequelizeType._length || sequelizeType._length === typeLength)) {
      return true
    }
  } else if (sequelizeType.key === "JSON") {
    if (rawDbType === "JSON") {
      return true
    }
  } else if (sequelizeType.key === "LONGTEXT") {
    if (rawDbType === "TEXT" || rawDbType === "LONGTEXT") {
      return true
    }
  } else if (sequelizeType.key === "TEXT") {
    if (rawDbType === "TEXT" || rawDbType === "LONGTEXT") {
      return true
    }
  } else if (sequelizeType === rawDbType) {
    return true
  }

  return false
}

export interface RdbModelOption<T extends Model<T>> {
  model?: new (any) => T
  modelName?: string
  rdbModel?: BaseRdbModel
}

export class RdbModel<T extends Model<T>> extends BaseRdbModel {
  model = class G extends Model<G> {} as any

  constructor(modelClassOrRdbModel: (new (any) => T) | RdbModelOption<T>) {
    super()

    const rdbOptions = modelClassOrRdbModel as RdbModelOption<T>

    let model

    if ((modelClassOrRdbModel as any).prototype) {
      model = modelClassOrRdbModel
    } else if (rdbOptions.model) {
      model = rdbOptions.model as any
    }

    if (model) {
      const anyModel = model
      this.modelName = rdbOptions.modelName || getModelName(anyModel.prototype)
      this.attributes = getAttributes(anyModel.prototype)
      this.options = getOptions(anyModel.prototype)
    } else {
      this.modelName = _.clone(rdbOptions.rdbModel.modelName)
      this.attributes = _.clone(rdbOptions.rdbModel.attributes)
      this.options = _.clone(rdbOptions.rdbModel.options)
    }

    if (!this.options) throw new Error(`@Table annotation is missing on class "${model.name}"`)

    this.options.modelName = this.modelName

    this.model.isInitialized = false
  }

  init(connection: ConnectionMysql) {
    this.connection = connection
    this.options.sequelize = this.connection.sequelize
    ;(this.model as any).init(this.attributes, this.options)
    this.model.isInitialized = true
  }

  build() {
    return this.model.build()
  }

  count(options?: ICountOptions<T>): Promise<number> {
    return this.model.count(options)
  }

  find(options?: IFindOptions<T>): Promise<T | null> {
    return this.model.find(options)
  }

  findOne(options?: IFindOptions<T>): Promise<T | null> {
    return this.model.findOne(options)
  }

  findAll(options?: IFindOptions<T>): Promise<T[]> {
    return this.model.findAll(options)
  }

  findAndCountAll(options?: IFindOptions<T>): Promise<{ rows: T[]; count: number }> {
    return this.model.findAndCountAll(options)
  }

  findOrCreate(options?: IFindOrInitializeOptions<FilteredModelAttributes<T>>): Promise<[T, boolean]> {
    return this.model.findOrCreate(options)
  }

  bulkCreate(records: FilteredModelAttributes<T>[], options?: BulkCreateOptions): Promise<T[]> {
    return this.model.bulkCreate(records, options)
  }

  upsert<A>(values: A, options?: UpsertOptions): Promise<boolean> {
    return this.model.upsert(values, options)
  }

  update(values: FilteredModelAttributes<T>, options: UpdateOptions): Promise<[number, Array<T>]> {
    return this.model.update(values, options)
  }

  increment(
    fields: string | string[] | Object,
    options?: (InstanceIncrementDecrementOptions & { silent?: boolean }) | { attributes: FilteredModelAttributes<T> }
  ): Promise<[Array<T>, number]> | Promise<[number, void]> {
    return this.model.increment(fields, options)
  }

  create(values?: FilteredModelAttributes<T>, options?: ICreateOptions): Promise<T> {
    return this.model.create(values, options)
  }

  destroy(options?: DestroyOptions) {
    return this.model.destroy(options)
  }
}

export class ConnectionMysql {
  name: string = ""
  sequelize: Sequelize = null
  config: MysqlConfigInterface
  server: ServerInterface
  models: { [id: string]: BaseRdbModel } = {}

  constructor(config: MysqlConfigInterface = null) {
    this.config = config
  }

  async initSequelize() {
    if (this.sequelize) {
      await this.sequelize.close()
    }

    const { config } = this

    this.sequelize = new Sequelize({
      database: config.database,
      username: config.user,
      password: config.password,
      dialect: config.dialect,
      host: config.host,
      port: config.port,
      logging: config.sequelizeLog,
      dialectOptions: {
        supportBigNumbers: true,
        bigNumberStrings: true
      },
      timezone: "+00:00",
      define: {
        charset: "utf8"
        //collate: 'utf8_general_ci',
      },
      retry: {
        match: [
          /ETIMEDOUT/,
          /EHOSTUNREACH/,
          /ECONNRESET/,
          /ECONNREFUSED/,
          /ETIMEDOUT/,
          /ESOCKETTIMEDOUT/,
          /EHOSTUNREACH/,
          /EPIPE/,
          /EAI_AGAIN/,
          /SequelizeConnectionError/,
          /SequelizeConnectionRefusedError/,
          /SequelizeHostNotFoundError/,
          /SequelizeHostNotReachableError/,
          /SequelizeInvalidConnectionError/,
          /SequelizeConnectionTimedOutError/
        ],
        max: 5
      }
    })
  }

  async sync(server: ServerInterface) {
    this.server = server

    this.initSequelize()

    LogHelper.info(`connect rdb name : ${this.config.name} host : ${this.config.host}`)

    await this.preSync()
    const option = {}

    let read_only = false
    const queryRes = await this.sequelize.query("SELECT @@global.read_only")

    if (_.isArray(queryRes) && _.isArray(queryRes[0]) && _.isObject(queryRes[0][0]) && queryRes[0][0]["@@global.read_only"] === "1") {
      read_only = true
    }

    await this.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", { raw: true })
    if (read_only === false) {
      await this.sequelize.sync(option)
    }

    await this.sequelize.query("SET FOREIGN_KEY_CHECKS = 1", { raw: true })
    if (this.config.ignoreCheck !== true) {
      const isOk = await this.checkAllTableDiff()
      if (this.config.ignoreSyncWarning !== true && isOk === false) {
        // throw new Error(`is not sync rdb ${this.config.name}`)
      }
    }

    LogHelper.info(`success sync rdb name : ${this.config.name} host : ${this.config.host}`)
    await this.postSync()
    LogHelper.info(JSON.stringify(this.config))
  }

  async initModels(...models: BaseRdbModel[]) {
    this.models = {}
    this.sequelize.models = {}
    for (const model of models) {
      model.init(this)
      this.models[model.modelName] = model
    }
  }

  async preSync() {
    // for override
  }

  async postSync() {
    // for override
  }

  async checkTableDiff(model: any) {
    const { attributes } = model
    const tableName = model.getTableName()

    let isOk = true
    try {
      const describeTable = await this.sequelize.getQueryInterface().describeTable(tableName)

      for (const aKey in describeTable) {
        if (attributes[aKey] === false) {
          LogHelper.info(`warning : no exist column ${aKey} in table ${tableName}`)
        }
      }

      for (const aKey in attributes) {
        const attribute: IPartialDefineAttributeColumnOptions = attributes[aKey]
        const describe = describeTable[aKey]
        if (describe == null) {
          LogHelper.info(`no exist column ${aKey} in table ${tableName}`)
          isOk = false
        }

        if (checkColumnType(attribute.type, describe.type) === false) {
          LogHelper.info(`is not sync column type ${aKey} in table ${tableName}`)
          LogHelper.info(`attribute.type ${attribute.type}, describe.type ${describe.type}`)
          isOk = false
        }

        if (attribute.primaryKey && describe.primaryKey !== true) {
          LogHelper.info(`is not sync column primaryKey ${aKey} in table ${tableName}`)
          isOk = false
        }

        if (attribute.primaryKey === false && attribute.unique !== describe.unique) {
          LogHelper.info(`is not sync column unique ${aKey} in table ${tableName}`)
          isOk = false
        }

        if (attribute.primaryKey === false && attribute.autoIncrement !== describe.autoIncrement) {
          LogHelper.info(`is not sync column autoIncrement ${aKey} in table ${tableName}`)
          isOk = false
        }

        if (attribute.allowNull && describe.allowNull !== true) {
          LogHelper.info(`is not sync column allowNull ${aKey} in table ${tableName}`)
          isOk = false
        }
      }
    } catch (e) {
      LogHelper.info(`no exist table ${tableName}`)
      isOk = false
    }

    return isOk
  }

  async checkAllTableDiff() {
    let isOk: boolean = true

    for (const mKey in this.sequelize.models) {
      const result = await this.checkTableDiff(this.sequelize.models[mKey])
      if (result === false) {
        isOk = false
      }
    }

    return isOk
  }
}
