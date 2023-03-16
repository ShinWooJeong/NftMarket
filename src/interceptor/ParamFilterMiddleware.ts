import { Injectable } from "@nestjs/common/decorators"
import { NestMiddleware } from "@nestjs/common/interfaces"
import { Request, Response, NextFunction } from "express"
import * as _ from "lodash"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"

type ReqDictionary = {}
type ReqBody = { [key: string]: string | number | Array<any> | object }
type ReqQuery = { [key: string]: string }
type ResBody = { [key: string]: string | number | Array<any> | object }
type SomeHandlerRequest = Request<ReqDictionary, ResBody, ReqBody, ReqQuery>

@Injectable()
export class ParamFilterMiddleware implements NestMiddleware {
  use(req: SomeHandlerRequest, res: Response, next: NextFunction) {
    // console.log("13131313131", req.params)

    if (!_.isEmpty(req.query)) {
      for (let i in req.query) {
        console.log("param log :: ", i, ": ", req.query[i])
        const buffer = req.query[i]
        let filteredValue = ParamCheckHelper.doCheckParam(buffer, "string", "", true, true)
        req.query[i] = filteredValue
      }
    }
    if (!_.isEmpty(req.body)) {
      for (let i in req.body) {
        const buffer = req.body[i]
        let filteredValue
        filteredValue = ParamCheckHelper.doCheckParam(buffer, typeof buffer, "", true, true)
        req.body[i] = filteredValue
      }
    }
    console.log("--------------- XSS middleware ---------------")
    next()
  }
}
