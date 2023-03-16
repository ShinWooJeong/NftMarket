import { EnDecryptHelper } from "../helpers/EnDecryptHelper"

let jwt = require("jsonwebtoken")
import { app } from "../app"
import { InvalidTokenException } from "../exceptions/InvalidTokenException"
import { payload } from "../interfaces/AccountInterface"
import { Redis } from "./Redis"

export class Jwt {
  /**
   * 회원 정보로 토큰 만들기.
   * @param idx 회원은 unique
   * @param email 회원 전자메일
   * @param type 토큰 타입
   */
  public static async issueToken(idx: number, email: string, type: string) {
    try {
      const now = Math.floor(Date.now() / 1000)
      const secretKey = type === "refresh" ? app().config.jwt.refresh_secret : app().config.jwt.access_secret

      const payload: payload = {
        idx: idx,
        email: email,
        iat: now,
        ...(type === "refresh"
          ? {
              token_type: "refresh",
              exp: now + app().config.jwt.refresh_exp
            }
          : {
              token_type: "access",
              exp: now + app().config.jwt.access_exp
            })
      }

      const newToken = await jwt.sign(payload, secretKey)
      return await EnDecryptHelper.encrypt(newToken)
    } catch (err) {
      throw new InvalidTokenException("err in issueToken")
    }
  }

  /**
   * 토큰 체크
   * @param token 유저가 입력한 토큰
   * @param type access | refresh 중에 하나.
   */
  public static async verifyToken(token, type: string = "access") {
    const decryptedToken = await EnDecryptHelper.decrypt(token)
    try {
      let secretKey = app().config.jwt.access_secret
      if (type == "refresh") {
        secretKey = app().config.jwt.refresh_secret
      }

      const varified = await jwt.verify(decryptedToken, secretKey)
      // 유저가 로그아웃처리한 토큰인지 확인
      const cache = await Redis.getInstance(app().config.redis_local)
      const logoutT = await cache.get(`Logout:${varified.idx}`)
      if (token === logoutT) {
        throw new Error()
      } else {
        return varified
      }
    } catch (err) {
      throw new InvalidTokenException("Invalid Token", token, err, 400)
    }
  }

  public static async issueForTemporary(email, code, key) {
    try {
      let token_type = "resetPassword"
      let expData = Math.floor(Date.now() / 1000) + 60 * 60 * 2
      let secretKey = key //'temporaryToken'

      const payload = {
        email: email,
        code: code,
        token_type: token_type,
        iat: Math.floor(Date.now()),
        exp: expData
      }

      const newToken = await jwt.sign(payload, secretKey)
      return await EnDecryptHelper.encrypt(newToken)
    } catch (err) {
      throw new InvalidTokenException("err in issueToken")
    }
  }

  public static async verifyTemporaryToken(token, key) {
    try {
      const decryptedToken = await EnDecryptHelper.decrypt(token)
      return await jwt.verify(decryptedToken, key)
    } catch (err) {
      throw new InvalidTokenException("Invalid Token", token, err, 400)
    }
  }
}
