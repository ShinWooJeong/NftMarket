import { Body, Controller, Headers, Post, UploadedFile, UseInterceptors } from "@nestjs/common"
import { ApiRunningTimeInterceptor } from "../interceptor/ApiRunningTimeInterceptor"
import { Jwt } from "../lib/JsonWebToken"
import { Response } from "../helpers/ResponseHelper"
import * as _ from "lodash"
import { NftMintDataService } from "../services/NftMintDataService"
import { DateHelpers } from "../helpers/DateHelpers"
import { NftListingDataService } from "../services/NftListingDataService"
import { FileInterceptor } from "@nestjs/platform-express"
import { jwt } from "../config/Dev"
import { EventParticipatedService } from "../services/EventParticipatedService"
import { AwsS3Uploader } from "../lib/AwsS3Uploader"

@Controller("/event")
export class EventController {
  @Post("/ddp_req_check")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async ddpRequireCheck(@Headers("access_token") access_token) {
    try {
      if (_.isUndefined(access_token) || _.isNull(access_token)) {
        return Response.rejection("로그인필요")
      }
      const user = await Jwt.verifyToken(access_token)
      const mintData = await NftMintDataService.getAllInfoByMemIdx(user.idx)
      let acceptable_mintdata = []
      acceptable_mintdata = mintData.filter((element) => Date.parse(element.set_date) > Date.parse("2022-09-01 00:00:00"))
      if (_.isUndefined(acceptable_mintdata) || _.isNull(acceptable_mintdata) || acceptable_mintdata.length == 0) {
        return Response.rejection("NFT 민팅 필요")

        //console.log("민팅")
      }

      // 승인중...!!!! 승인 거부도 필요할까..?

      // const listgData = await NftListingDataService
      const listingData = await NftListingDataService.getAllInfoByIdx(user.idx)
      let acceptable_listingData = []
      acceptable_listingData = listingData.filter((element) => Date.parse(element.set_date) > Date.parse("2022-09-01 00:00:00"))
      if (acceptable_listingData.length <= 0) {
        return Response.rejection("NFT 리스팅 필요")

        //console.log("리스팅")
      }
      return Response.success()
    } catch (err) {
      return Response.failure(err)
    }
  }

  @Post("/ddp_participate_page")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async ddpParticipationPage() {}

  @Post("/ddp_participate_submit")
  @UseInterceptors(ApiRunningTimeInterceptor)
  @UseInterceptors(FileInterceptor("art_file"))
  async ddpParticipationSubmit(@Headers("access_token") access_token, @Body() req, @UploadedFile() file: Express.Multer.File) {
    const user = await Jwt.verifyToken(access_token, "access")
    // console.log("^&^&^&^&^&^&^&^&^&^&", user.idx, " && ", file, " && ", req)

    //- event_participated 테이블에 4번 까지 밖에 못 넣음 이벤트인덱스와 유저인덱스 확인,
    const participatedCount = await EventParticipatedService.participationCountByIdx(27, 1) // (user.idx, 1)
    if (participatedCount >= 3) {
      return Response.rejection("참여횟수초과") //({ reject: "참여횟수제한" })
    }
    // 나중에 필요 없으면 지우지 뭐.. nft_mint_idx로 들어온 작품이 유저의 작품이 맞는지 체크
    const art_check = await NftMintDataService.getOneInfoByIdx(1212)

    // aws upload -> needs refactoring
    const cloudfront_url = await AwsS3Uploader.uploadFile(file, "bluebay-mint", "event", 100000000) // 100MB

    // req data 정제...  는 service 부분에서 paramcheck & sql injection 체크를 같이 해버리는게 코드가 더 깔끔할듯.. ?

    // db에 저장
    await EventParticipatedService.doInsert() // 음... 내가 민팅해서 리스팅된 작품을 응모할 때 그 작품 등록을 어케하지..

    return Response.success()
  }
}
