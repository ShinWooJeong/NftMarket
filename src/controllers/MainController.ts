import { Controller, Post, Get, UseInterceptors, Query } from "@nestjs/common"
import { ApiRunningTimeInterceptor } from "../interceptor/ApiRunningTimeInterceptor"
import { OpMainService } from "../services/OpMainService"
import { Response } from "../helpers/ResponseHelper"
import { OpMainArtistService } from "../services/OpMainArtistService"
import { MemberService } from "../services/MemberService"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"
import { ExhibitionService } from "../services/ExhibitionService"
import { OpBannerService } from "../services/OpBannerService"
import { ExhibitionNftService } from "../services/ExhibitionNftService"
import { NftMintDataService } from "../services/NftMintDataService"
import { NftListingDataService } from "../services/NftListingDataService"
import { filter } from "lodash"

@Controller("/main")
export class MainController {
  @Get("/")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async getMain() {
    const result = (await OpMainService.getMains()) as { mint_idx: number; nft?: Object; member?: Object }[]
    console.log("dddddddddd", result)
    for (let obj of result) {
      const mintData = await NftMintDataService.getOneInfoByIdx(obj.mint_idx)
      obj.nft = { idx: mintData.idx, nft_title: mintData.nft_title }
      obj.member = await MemberService.getProfileThingsByIdx(mintData.member_idx)
    }
    return Response.success(result)
  }

  /**
   * 공모전 했던( 혹은 운영에서 소개하고 싶은) 작가들
   * @returns
   */
  @Get("/artist")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async artist() {
    const result = await OpMainArtistService.getMainArtist()
    return Response.success(result)
  }

  /**
   * 기획전 NFT 리스팅 Array
   * @param param
   * @returns
   */
  @Get("/exh_nft")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async exhibitionNft(@Query() param?) {
    let mintList = await ExhibitionNftService.getMintListByExbIdxArr()
    // result = await ExhibitionNftService.getMintListByExbIdxArr(param.arr.split(",").map((e) => parseInt(e)))
    let listingInfo = await NftMintDataService.getByIdxes(mintList)
    return Response.success(listingInfo)
  }

  /**
   *
   * @returns
   */
  @Get("/recent")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async recentItems() {
    const results = {} as { listingInfo?: any[]; mintInfo?: any[]; userInfo?: any[] }
    const items = await NftListingDataService.getRecentItems(4)
    results.listingInfo = items
    if (results.listingInfo.length) {
      const mintInfo = await NftMintDataService.getByIdxes(items.map((o) => o.mint_idx))
      const userInfo = await MemberService.getSimpleInfoByIdxes(mintInfo.map(o => o.member_idx))

      results.mintInfo = mintInfo
      results.userInfo = userInfo
    } else {
      results.mintInfo = []
      results.userInfo = []
    }

    return Response.success(results)
  }

  @Get("/high_view")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async hotItems(@Query() req) {
    const num = await ParamCheckHelper.doCheckParam(parseInt(req.itemNum), "number", 4)
    const items = (await NftMintDataService.getHighViewItems(num)) as { member_idx: number; member?: Object }[]
    for (let item of items) {
      item.member = await MemberService.getSimpleInfoByIdx(item.member_idx)
    }

    return Response.success(items)

    // 상세페이지, detail page 들어왔을 때 nft_mint_data의 view_hit count 올려주기 추가...!
  }

  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  /**
   * 진행했던 공모전들이 간단히 나열되어 있는 페이지,,
   * @returns
   */
  @Get("/exhibition")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async getExhibition() {
    const result = await ExhibitionService.getExhibition()
    return Response.success(result)
  }

  /**
   * 기획전 상세페이지 :: 메인 배너? 같은 곳의 More View를 누르면 상세페이지로
   * @param exhIdx
   * @returns
   */
  @Get("/exh/detail")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async getExhDetail(@Query() exhIdx) {
    console.log("@@@@@@@@@@@@", exhIdx.exhIdx)
    const mintList = await ExhibitionNftService.getMintListByExbIdx(exhIdx.exhIdx)
    const result = await NftMintDataService.getByIdxes(mintList)
    return Response.success(result)
  }

  @Get("/banner") // 어디에 쓰는거지..? op_banner 테이블은 지금 운영DB에서 아무 데이터가 없는데...
  @UseInterceptors(ApiRunningTimeInterceptor)
  async banner() {
    const result = await OpBannerService.getList()
    return Response.success(result)
  }
}
