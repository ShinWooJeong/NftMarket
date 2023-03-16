import { Jwt } from "../lib/JsonWebToken"
import { Body, Controller, Post, Get, Headers, UseInterceptors, Delete, Param, Query } from "@nestjs/common"
import { MemberService } from "../services/MemberService"
import { Response } from "../helpers/ResponseHelper"
import { MemberFollowService } from "../services/MemberFollowService"
import { ApiRunningTimeInterceptor } from "../interceptor/ApiRunningTimeInterceptor"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"

@Controller("/social")
export class SocialController {
  @Get("/get_followings")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async getFollowings(@Query() param) {
    const idx = await ParamCheckHelper.doCheckParam(parseInt(param.idx), "number", 0)
    const followingList = await MemberFollowService.getFollowingsByIdx(idx)
    const followingData = await MemberService.getFollowDetails(followingList)

    return Response.success(followingData)
  }

  @Get("/get_followers")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async getFollowers(@Query() param) {
    const idx = await ParamCheckHelper.doCheckParam(parseInt(param.idx), "number", 0)
    const followerList = await MemberFollowService.getFollowersByIdx(idx)
    const followerData = await MemberService.getFollowDetails(followerList)
    return Response.success(followerData)
  }

  @Post("/follow")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async doFollow(@Body() body, @Headers() header) {
    const decoded = await Jwt.verifyToken(header.access_token, "access")
    await MemberFollowService.doCheckThenInsert(decoded.idx, body.objIdx)
    await MemberService.doUpdateFollowings(decoded.idx, 1)
    await MemberService.doUpdateFollowers(body.objIdx, 1)
    return Response.success()
  }

  @Post("/unfollow")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async doUnfollow(@Body() body, @Headers() header) {
    const decoded = await Jwt.verifyToken(header.access_token, "access")
    await MemberFollowService.doDeleteByIdx(decoded.idx, body.objIdx)
    await MemberService.doUpdateFollowings(decoded.idx, -1)
    await MemberService.doUpdateFollowers(body.objIdx, -1)
    return Response.success()
  }

  // 타인 프로필 페이지 접속시
  @Get("/page")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async otherProfilePage(@Query() params) {
    // 해당 계정의 만든날짜, 팔로잉 팔로워, 타 연결 sns, 이미지, 지갑,, ---> 중요정보를 제외한 전부를 보내자 .
    const idx = await ParamCheckHelper.doCheckParam(params.idx, "number", 1)
    const mem = await MemberService.getUserProfileByIdx(idx)

    return Response.success(mem)
  }

  @Post("/test")
  async testApi(@Body() body) {
    console.log("arrived in controller...........")
  }
}

///////////////// req.body 해야함 세부타입
