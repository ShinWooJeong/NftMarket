import { Controller, Post, Body, Headers, UseInterceptors } from "@nestjs/common"
import { Response } from "../helpers/ResponseHelper"
import { MemberService } from "../services/MemberService"
import { Jwt } from "../lib/JsonWebToken"
import { JwtException } from "../exceptions/JwtException"
import { LoginDto } from "../interfaces/AccountInterface"
import { ApiRunningTimeInterceptor } from "../interceptor/ApiRunningTimeInterceptor"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"
import { EnDecryptHelper } from "../helpers/EnDecryptHelper"
import { MemberLoginHistoryService } from "../services/MemberLoginHistoryService"
import { app } from "../app"
import { Redis } from "../lib/Redis"

@Controller("/auth")
export class AuthController {
  @Post("/do_login")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async doLogin(@Body() loginDto) {
    loginDto.email = await ParamCheckHelper.xssFilter(loginDto.email)
    const fromDB = await MemberService.doLoginByEmail(loginDto)
    await MemberLoginHistoryService.doInsert(fromDB.idx, loginDto.platform)
    let payload = {
      refresh: "",
      access: ""
    }

    if (fromDB["refresh_token"] == null) {
      let refresh = await Jwt.issueToken(fromDB["idx"], fromDB["email"], "refresh")
      await MemberService.doUpdateTokenByIdx(fromDB["idx"], refresh)
      payload.refresh = refresh
    } else {
      await Jwt.verifyToken(fromDB["refresh_token"], "refresh") // 있으면 검증후
      payload.refresh = fromDB["refresh_token"]
    }

    payload.access = await Jwt.issueToken(fromDB["idx"], fromDB["email"], "access")
    return Response.success(payload)
  }

  @Post("/logout")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async doLogout(@Headers("access_token") access_token) {
    const result = await Jwt.verifyToken(access_token, "access")
    const cache = Redis.getInstance(app().config.redis_local)
    await cache.set(`Logout:${result.idx}`, access_token)
    await cache.expire(`Logout:${result.idx}`, 7200)
    return Response.success()
  }

  // Access Token 유효성 검사
  @Post("/verify_access_token")
  async checkAccessToken(@Headers("access_token") access_token: string) {
    const result = await Jwt.verifyToken(access_token, "access")
    return Response.success(result)
  }

  // Access Token 재발급 요청
  @Post("/refresh_access_token")
  async reissueAccess(@Body() req) {
    //(@Headers("refresh_token") refresh_token) {
    try {
      const verified = await Jwt.verifyToken(req.refresh_token, "refresh")
      const fromDB = await MemberService.getOneInfoByIdx(verified.idx)
      if (verified.payload) {
        throw new JwtException("payload obj added")
      }
      if (fromDB.refresh_token !== req.refresh_token) {
        throw new JwtException("토큰이 일치하지 않습니다.")
      }
      const newToken = await Jwt.issueToken(verified.idx, verified.email, "access")
      return Response.success(newToken)
    } catch (err) {
      throw err
    }
  }
}
