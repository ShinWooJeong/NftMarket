import * as _ from "lodash"
import { values } from "lodash"
import { InvalidParameterException } from "../exceptions/InvalidParameterException"
import { DbNotFoundException } from "../exceptions/DbNotFoundException"
import { Response } from "./ResponseHelper"

export class ParamCheckHelper {
  /**
   * 유저가 입력한 파라미터는 여기서 체크한다.
   * @param paramValue
   * @param type number / string / float
   * @param defaultValue
   * @param isNullable
   * @param isEmptyAble
   */
  public static doCheckParam(paramValue: any, type: string, defaultValue: any, isNullable = false, isEmptyAble = false) {
    if ((_.isNaN(paramValue) || _.isNull(paramValue) || _.isNull(paramValue)) && !_.isNil(defaultValue)) {
      paramValue = defaultValue
    }

    if (type === "number") {
      paramValue = Number(paramValue)
    }

    if (type === "string") {
      try {
        paramValue = this.xssFilter(paramValue)
      } catch (err) {
        throw new InvalidParameterException("Invalid Parameter (xssInjection)")
      }
    }

    if (type === "object") {
      let filteredObj = this.iterateObj(paramValue)
      return filteredObj
    }

    //throw new InvalidParameterException("Invalid Parameter (It is NaN)")
    if (_.isNaN(paramValue)) {
      throw new InvalidParameterException("Invalid Parameter (It is NaN)")
    }

    if (isNullable === false && _.isNull(paramValue)) {
      throw new InvalidParameterException("Invalid Parameter (It is Null)")
    }

    if (isNullable === false && _.isNil(paramValue)) {
      throw new InvalidParameterException("Invalid Parameter (It is Nil)")
    }

    if (isEmptyAble === false && type !== "number" && _.isEmpty(paramValue)) {
      throw new InvalidParameterException("Invalid Parameter (It is Empty)")
    }

    return paramValue
  }

  public static iterateObj(obj) {
    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        this.iterateObj(obj[key])
      } else {
        obj[key] = this.doCheckParam(obj[key], typeof obj[key], "")
      }
    }
    return obj
  }

  public static xssFilter(str: string) {
    let result = ""

    result = str
    result = result
      .replace(/\</g, "&lt;")
      .replace(/\>/g, "&gt;")
      .replace(/&/g, "&amp")
      .replace(/'/g, "&#x27;")
      .replace(/"/g, "&quot;")
      .replace(/`/g, "&backtick;")
      .replace("(", "&#40;")
      .replace(")", "&#41;")
      .replace("/", "&#x2F;")
    // .replace(/select/gi, "&#x2G;")
    // .replace(/update/gi, "&#x2H;")
    // .replace(/insert/gi, "&#x2I;")
    // .replace(/delete/gi, "&#x2J;")

    // if (str != result) {
    //   throw new Error("xssInjection")
    // }

    return result
  }

  public static doCheckDbDataValues(paramValue: any, defaultValue: any, isNullable = false, isEmptyAble = false) {
    if ((_.isNaN(paramValue) || _.isNull(paramValue) || _.isNull(paramValue)) && !_.isNil(defaultValue)) {
      paramValue = defaultValue
    }

    //throw new DbNotFoundException("Invalid Parameter (It is NaN)")
    if (_.isNaN(paramValue)) {
      throw new DbNotFoundException("DbNotFoundException (It is NaN)")
    }

    if (isNullable === false && _.isNull(paramValue)) {
      throw new DbNotFoundException("DbNotFoundException (It is Null)")
    }

    if (isNullable === false && _.isNil(paramValue)) {
      throw new DbNotFoundException("DbNotFoundException (It is Nil)")
    }

    if (isEmptyAble === false && _.isEmpty(paramValue)) {
      throw new DbNotFoundException("DbNotFoundException (It is Empty)")
    }

    return paramValue
  }
}
