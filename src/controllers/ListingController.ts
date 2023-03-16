import { Controller, Post, Get, Headers, Body, Query, UseInterceptors } from "@nestjs/common"
import { ApiRunningTimeInterceptor } from "../interceptor/ApiRunningTimeInterceptor"
import { Response } from "../helpers/ResponseHelper"
import { getListingData } from "../lib/Pagination"
import { NftMintDataService } from "../services/NftMintDataService"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"
import { NftListingDataService } from "../services/NftListingDataService"
import { MemberService } from "../services/MemberService"
import { NftOwnedDataService } from "../services/NftOwnedDataService"
import { DateHelpers } from "../helpers/DateHelpers"
import { AxiosHelpers } from "../helpers/AxiosHelpers"
import { NftAuctionDataService } from "../services/NftAuctionDataService"

interface auctionListing {
  user: any
  mintNum: number
  walletAddress: string // nftCreator
  startDate: string
  finishDate: string
}

interface fixedPriceListing {
  user: any
  mintNum: number
  walletAddress: string // nftCreator
  txId: string
}

interface onchainReq {
  user: any
  txId: string
  tokenIdx: number
  blockHash: string
  blockNumber: number
}

@Controller("/listing")
export class ListingController {
  @Get("/market")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async loadListingData(@Query() param) {
    const perPage = await ParamCheckHelper.doCheckParam(param.per, "number", 12)
    const reqPage = await ParamCheckHelper.doCheckParam(param.page, "number", 1)
    let returning = await getListingData(0, reqPage, perPage, param.categ, param.sale_type, param.event_type)

    return Response.success(returning)
  }

  @Get("/detail")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async getItemDetail(@Query() param) {
    let resObj = {} as { mintInfo: object; listingInfo: object; creatorInfo: object; ownerInfo: object }
    resObj.mintInfo = await NftMintDataService.getOneForDetailPage(param.mintNum)
    resObj.listingInfo = await NftListingDataService.getOneInfoByIdx(param.listingNum)

    if (resObj.mintInfo["use_flag"] != 1) {
      return Response.rejection({ message: `mintInfo.use_flag = ${resObj.mintInfo["use_flag"]}, mintInfo.nft_status = ${resObj.mintInfo["nft_status"]}` })
    }
    if (resObj.listingInfo["use_flag"] != 1) {
      return Response.rejection({ message: `listingInfo.use_flag = ${resObj.listingInfo["use_flag"]}, listingInfo.nft_status = ${resObj.listingInfo["nft_status"]}` })
    }

    resObj.creatorInfo = await MemberService.getSimpleInfoByIdx(resObj.mintInfo["member_idx"])
    resObj.ownerInfo = await MemberService.getSimpleInfoByIdx(resObj.listingInfo["member_idx"])

    return Response.success(resObj)
  }

  @Get("/bidding")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async getBiddingsByListingIdx(@Query() param) {
    const biddingList = await NftAuctionDataService.getAllByListIdx(parseInt(param.idx))
    return Response.success(biddingList)
  }

  @Post("/auction")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async submitAuctionListingPage(@Body() req: auctionListing) {
    // (@Body() req : auctionListingInterface..?)
    const mintData = await NftMintDataService.getOneInfoByIdx(req.mintNum)
    const memData = await MemberService.getUserProfileByIdx(req.user.idx) //(48)
    const utcStartDate = DateHelpers.getUTCTimestampFromDateTime(req.startDate)
    const utcFinishDate = DateHelpers.getUTCTimestampFromDateTime(req.finishDate)
    if (mintData.use_flag != 1 || mintData.admin_chk != "Y") {
      return Response.rejection({ use_flag: mintData.use_flag, nft_status: mintData.nft_status, admin_chk: mintData.admin_chk })
    }
    // sales_type 이 auction 이여야하고, 이 뜻은 발행 아이템 수량이 1이라는 뜻.
    if (mintData.sales_type != "auction") {
      return Response.rejection({ salesType: mintData.sales_type })
    }
    if (memData.account === null) {
      return Response.rejection({ message: "추후 2차판매 로열티 지급을 위해 유저 지갑 연동 필요" })
    }
    if (utcStartDate < DateHelpers.getCurrentUCTimestamp() || utcStartDate > utcFinishDate) {
      console.log("start Date Check : ", DateHelpers.getUTCTimestampFromDateTime(req.startDate), DateHelpers.getCurrentUCTimestamp())
      return Response.rejection({ message: "manage start date again" })
    }
    if (utcFinishDate < DateHelpers.getCurrentUCTimestamp() || utcFinishDate < utcStartDate) {
      console.log("finish Date Check : ", DateHelpers.getUTCTimestampFromDateTime(req.startDate), DateHelpers.getCurrentUCTimestamp())
      return Response.rejection({ message: "manage finish date again" })
    }

    const newRow = await NftOwnedDataService.doInsertOwnedByMinting(req, mintData.item_amount)
    await NftListingDataService.doInsert(req, newRow.idx)

    return Response.success()
  }

  @Post("/fixed")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async submitFixedPriceListingPage(@Body() body: fixedPriceListing) {
    //(@Body() req : fixedPriceListingInterface..?)
    const mintData = await NftMintDataService.getOneInfoByIdx(body.mintNum)
    const memData = await MemberService.getUserProfileByIdx(body.user.idx) //(48)

    if (mintData.use_flag != 1 || mintData.admin_chk != "Y") {
      return Response.rejection({ use_flag: mintData.use_flag, nft_status: mintData.nft_status, admin_chk: mintData.admin_chk })
    }
    if (memData.account === null) {
      return Response.rejection({ message: "추후 2차판매 로열티 지급을 위해 유저 지갑 연동 필요" })
    }
    if (mintData.sales_type != "basic") {
      return Response.rejection({ salesType: mintData.sales_type })
    }
    if (body.txId == null) {
      return Response.rejection({ message: "basic listing은 minting Tx ID 필요" })
    }

    const newRow = await NftOwnedDataService.doInsertOwnedByMinting(body, mintData.item_amount)
    await NftListingDataService.doInsert(body, newRow.idx)
    const updated = await NftMintDataService.doUpdateStatusFlagByIdx(mintData.idx, "listing", 1)
    console.log("errerreerevvbbbb : ", updated)
    return Response.success()
  }

  @Post("/onchain_info")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async fixedPriceListingOnchainInfo(@Body() body: onchainReq) {
    await NftListingDataService.doUpdateByTxId(body)
    await NftOwnedDataService.doUpdateByTxId(body)
    return Response.success()
  }

  @Post("/page") // listing for sale page를 구성할 수 있게 데이터 전달
  @UseInterceptors(ApiRunningTimeInterceptor)
  async getListingPage(@Body() req, @Headers("access_token") access_token) {
    const result = await NftMintDataService.getOneInfoByIdx(req.mintNum)
    if (result.use_flag != 1 || result.admin_chk != "Y") {
      return Response.rejection({ use_flag: result.use_flag, nft_status: result.nft_status, admin_chk: result.admin_chk })
    }

    const res = {
      mint_idx: result.idx,
      nft_image: result.nft_img,
      nft_title: result.nft_title,
      nft_desc: result.nft_desc,
      nft_price: result.nft_price,
      nft_royalty: result.nft_royalty,
      item_amount: result.item_amount,
      sales_type: result.sales_type,
      metadata_url: result.metadata_url
    }

    return Response.success(res)
  }

  // 공모전 이벤트 리스팅
  @Get("/ddp")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async ddpListgingData(@Query() param) {
    const perPage = await ParamCheckHelper.doCheckParam(param.per, "number", 12)
    const reqPage = await ParamCheckHelper.doCheckParam(param.page, "number", 1)
    let returning = await getListingData(0, reqPage, perPage, param.categ, param.sale_type, param.event_type)

    return Response.success(returning)
  }
}

/* 
select item_name, year, price_tax_ex as price from Items where year <= 2001
Union All
select item_name, year, price_tax_in as price from Items where year >= 2002; */
