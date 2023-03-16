import { DateHelpers } from "./../helpers/DateHelpers"
import { Response } from "./../helpers/ResponseHelper"
import { Body, Controller, Post, UseInterceptors } from "@nestjs/common"
import { ApiRunningTimeInterceptor } from "../interceptor/ApiRunningTimeInterceptor"
import { MemberService } from "../services/MemberService"
import { NftMintDataService } from "../services/NftMintDataService"
import { NftListingDataService } from "../services/NftListingDataService"
import { NftAuctionDataService } from "../services/NftAuctionDataService"
import { NftOwnedDataService } from "../services/NftOwnedDataService"
import * as _ from "lodash"

interface bidreqs {
  user: any
  listingIdx: number
  mintIdx: number
  currencyType: number | boolean
  auctionEth: string
  auctionKrw: string
  walletBalance: string
}
interface purchaseReq {
  user: any
  bidIdx: number
  listingIdx: number
  mintIdx: number
  txId: string
  auctionEth: string
  auctionUsd: string
  walletAddress: string
}
interface onchainReq {
  user: any
  txId: string
  tokenIdx: number
  blockHash: string
  blockNumber: number
}

@Controller("/auction")
export class AuctionController {
  @Post("/bid")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async auctionbid(@Body() body: bidreqs) {
    const userInfo = await MemberService.getUserProfileByIdx(body.user.idx)
    if (!userInfo.account) return Response.rejection({ message: "metamask를 통한 지갑연동 필요" })

    const mintInfo = await NftMintDataService.getOneInfoByIdx(body.mintIdx)
    const listingInfo = await NftListingDataService.getOneInfoByIdx(body.listingIdx)
    if (listingInfo.mint_idx != mintInfo.idx) {
      return Response.rejection({ message: "mintIdx와 listingIdx 값 확인 필요" })
    }
    if (mintInfo.use_flag != 1 || listingInfo.use_flag != 1) {
      return Response.rejection({ message: `mint 또는 listing use_flag 값 확인` })
    }
    if (listingInfo.sales_type != "auction") {
      return Response.rejection({ message: "경매 상품이 아닙니다" })
    }
    if (body.currencyType != mintInfo.currency) {
      return Response.rejection({ message: "currency가 일치하지 않습니다" })
    }
    if (DateHelpers.getUTCTimestampFromDateTime(listingInfo.finish_date) < DateHelpers.getCurrentUCTimestamp()) {
      return Response.rejection({ message: `경매가 종료되었습니다` })
    }
    // 지갑에 있는 금액이 제시한 입찰 금액보다 적음
    if (body.walletBalance < body.auctionEth) {
      return Response.rejection({ message: `제시한 금액보다 지갑에 가지고 있는 금액이 적습니다` })
    }
    // 해당 경매의 입찰 리스트를 불러와서 이전 입찰이 있으면, 제시한 금액이 입찰 최고 금액보다 적으면 리젝
    ////// sequelize로 불러올 때 max 함수를 쓰고 싶었지만.. 이 프로젝트를 구축하실때 커스텀 sequelize를 사용하셔서 일부 sequelize 함수가 없다..
    const previousBids = await NftAuctionDataService.getAllByListIdx(body.listingIdx)
    if (_.isEmpty(previousBids)) {
      await NftAuctionDataService.doInsertRow(body, mintInfo)
      return Response.success()
    } else {
      const highestBid = Math.max(...previousBids.map((o) => Number(o.auction_eth)))

      if (highestBid > Number(body.auctionEth)) {
        return Response.rejection({ message: "입찰금액이 현재 입찰된 최대 입찰액보다 적습니다", highestBid: highestBid, yourBid: Number(body.auctionEth) })
      } else {
        await NftAuctionDataService.doInsertRow(body, mintInfo)
        return Response.success()
      }
    }
  }

  // 경매 낙착자 구매
  @Post("/purchase")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async buyAuctionNft(@Body() body: purchaseReq) {
    const userInfo = await MemberService.getUserProfileByIdx(body.user.idx)
    if (!userInfo.account) {
      return Response.rejection({ message: "metamask를 통한 지갑연동 필요" })
    }
    if (userInfo.account != body.walletAddress) {
      return Response.rejection({ message: "등록한 지갑주소와 결제하는 지갑주소가 일치하지 않음" })
    }

    const auctionBidInfo = await NftAuctionDataService.getOneInfoByIdx(58)
    if (auctionBidInfo.member_idx != body.user.idx) {
      return Response.rejection({ message: "입찰한 유저정보와 일치하지 않습니다" })
    }
    if (auctionBidInfo.listing_idx != body.listingIdx) {
      return Response.rejection({ message: "Invalid listingIdx" })
    }
    if (auctionBidInfo.mint_idx != body.mintIdx) {
      return Response.rejection({ message: "Invalid mintIdx" })
    }

    const listingInfo = await NftListingDataService.getAllInfoByIdx(body.listingIdx)

    // await NftListingDataService.doUpdateByIdx()
    const purchaseAmount = 1
    // buyer 구매 소유 추가
    const newOwned = await NftOwnedDataService.doInsertOwnedByPurchase(body, purchaseAmount) ///////////
    // seller 소유 owned_data 감소
    console.log("dfdfdfdfdfwhattttt : ", listingInfo)
    // await NftOwnedDataService.doDecreaseRemainByIdx(, -1)//listingInfo.owned_idx
    // 거래된 listing row remain 수량 감소
    const remainAmount = await NftListingDataService.doDecreaseRemainByIdx(body.listingIdx, -1)
    // 거래된 listing row의
    await NftListingDataService.doUpdateStatusAndFlagByIdx(body.listingIdx, "soldout", 1)
    //

    return Response.success(auctionBidInfo)
  }

  @Post("/onchain_info")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async buyOnchainInfo(@Body() body: onchainReq) {
    await NftListingDataService.doUpdateByTxId(body)
    await NftOwnedDataService.doUpdateByTxId(body)
    return Response.success()
  }
}
