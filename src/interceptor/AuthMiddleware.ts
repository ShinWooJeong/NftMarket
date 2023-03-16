import { Headers } from "@nestjs/common"
import { Injectable } from "@nestjs/common/decorators"
import { NestMiddleware } from "@nestjs/common/interfaces"
import { Request, Response, NextFunction } from "express"
import * as _ from "lodash"
import { JwtException } from "../exceptions/JwtException"
import { Jwt } from "../lib/JsonWebToken"

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.method == "POST") {
      if (!req.headers.access_token) {
        throw new JwtException("token is missing")
      }
      const token = req.headers.access_token
      const userInfo = await Jwt.verifyToken(token, "access")
      Object.assign(req.body, { user: userInfo })
    }
    console.log("MIDDLEWARE : ", req.method, req.body)

    console.log("--------------- Auth middleware ---------------")
    next()
  }
}
