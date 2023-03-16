import { Headers } from "@nestjs/common"
import { Injectable } from "@nestjs/common/decorators"
import { NestMiddleware } from "@nestjs/common/interfaces"
import { Request, Response, NextFunction } from "express"
import * as _ from "lodash"
import { Jwt } from "../lib/JsonWebToken"

export class TempAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.access_token
    Jwt.verifyTemporaryToken(token, "verifiedByEmail")
    console.log("--------------- TempAuth middleware ---------------")
    next()
  }
}
