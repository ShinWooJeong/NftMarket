import { Jwt } from "../lib/JsonWebToken"
import { Controller, Post, Headers, UseInterceptors, Delete, Get, Query, Header, Body } from "@nestjs/common"
import { MemberService } from "../services/MemberService"
import { Response } from "../helpers/ResponseHelper"
import { ApiRunningTimeInterceptor } from "../interceptor/ApiRunningTimeInterceptor"
import { Express } from "express"
import { FileInterceptor } from "@nestjs/platform-express"
import { UploadedFile } from "@nestjs/common"
import { AwsS3Uploader } from "../lib/AwsS3Uploader"
import { NftOwnedDataService } from "../services/NftOwnedDataService"
import { NftMintDataService } from "../services/NftMintDataService"
import { DspService } from "../services/DspService"
import { app } from "../app"
let md5 = require("md5")

import { DateHelpers } from "../helpers/DateHelpers"
import { NftListingDataService } from "../services/NftListingDataService"
import { NftAuctionDataService } from "../services/NftAuctionDataService"
// import { Sequelize } from "sequelize-typescript"
import { Sequelize, Transaction } from "sequelize"
import { ConnectionMysql } from "../modules/ConnectionMysql"

interface editMyProfile {
  user: any
  userName?: string
  profile_comment?: string
  website?: string
  twitter?: string
  instagram?: string
  youtube?: string
}

interface deleteMintedNft {
  user: any
  nftIdx: number
}

interface burnNft {
  user: any
  // mintIdx: number
  // listIdx: number
  ownedIdx: number
  burnTxId: string
  burnBlockHash?: string
  burnBlockNum?: number
}

@Controller("/member")
@UseInterceptors(ApiRunningTimeInterceptor)
export class MemberProfileController {
  @Delete("del_profile_img")
  async deleteProfileImg(@Headers("access_token") access_token) {
    const userInfo = await Jwt.verifyToken(access_token)
    const url = await MemberService.getUrlByIdx(userInfo.idx)
    const fileName = url.slice(url.lastIndexOf("/"), url.length)
    if (fileName !== "/ico_default.png") {
      await AwsS3Uploader.deleteProfile(fileName)
    }
    await MemberService.doDefaultProfileByIdx(userInfo.idx)
    return Response.success()
  }

  @Post("/upload_profile_img")
  @UseInterceptors(FileInterceptor("file"))
  async uploadProfileImg(@UploadedFile() file: Express.Multer.File, @Headers("access_token") access_token) {
    const tokenInfo = await Jwt.verifyToken(access_token, "access")
    //const imgUrl = await AwsS3Uploader.uploadProfile(file)
    const bucket = app().config.aws.bucket_name
    let extension = file.mimetype.split("/")
    const savingName = md5(file.originalname + DateHelpers.getCurrentUTCDateTime()) + "." + extension[1]
    const imgUrl = await AwsS3Uploader.uploadFile(file, bucket, "member_profile", 10000000, savingName)
    await MemberService.doUpdateProfileByIdx(tokenInfo.idx, imgUrl)
    return Response.success()
  }

  // upload 기능 테스트 // =========================================
  @Post("/test_upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadImgTest(@UploadedFile() file: Express.Multer.File) {
    const bucket = app().config.aws.bucket_name
    let extension = file.mimetype.split("/")
    const savingName = md5(file.originalname + DateHelpers.getCurrentUTCDateTime()) + "." + extension[1]
    const imgUrl = await AwsS3Uploader.uploadFile(file, bucket, "member_profile", 10000000, savingName)
    console.log("imgUrl: ", imgUrl)
    // await MemberService.doUpdateProfileByIdx(tokenInfo.idx, imgUrl)
    return Response.success()
  }

  // 마이 페이지에서 프로필 사항들 수정
  @Post("/edit_profile")
  async editMyProfil(@Body() req: editMyProfile) {
    // console.log("erererer???", req)
    await MemberService.doUpdateByIdx(req.user.idx, req)
    return Response.success()
  }

  // 타인 프로필 페이지 눌렀을 때
  @Post("/myinfo")
  async myMemberInfo(@Body() body) {
    const memInfo = await MemberService.getOneInfoByIdx(body.user.idx)
    return Response.success(memInfo)
  }

  // 타인 프로필 페이지 눌렀을 때 타인의 유저정보
  @Get("/userpage")
  async userProfilePage(@Query() param) {
    const memberInfo = await MemberService.getUserProfileByIdx(parseInt(param.idx))
    return Response.success(memberInfo)
  }
  // 타인 프로필 페이지 눌렀을 때 타인의 created Items
  @Get("/userpage_created")
  async userProfilePageCreatedItem(@Query() param) {
    const resultVal = {} as { listingItem?: any[]; mintInfo?: any[]; userInfo?: any[] }
    const createdItem = await NftListingDataService.getAllInfoByIdx(parseInt(param.idx))
    resultVal.listingItem = createdItem
    if (createdItem.length) {
      const mintInfo = await NftMintDataService.getByIdxes(createdItem.map((o) => o.mint_idx))
      const userInfo = await MemberService.getSimpleInfoByIdxes(mintInfo.map((o) => o.member_idx))
      resultVal.mintInfo = mintInfo
      resultVal.userInfo = userInfo
    } else {
      resultVal.mintInfo = []
      resultVal.userInfo = []
    }
    return Response.success(resultVal)
  }
  // 타인 프로필 페이지 눌렀을 때 타인의 owned Items
  @Get("/userpage_owned")
  async userProfilePageOwnedItem(@Query() param) {
    const returnVal = {} as { ownedItem?: any[]; mintInfo?: any[]; userInfo?: any[] }
    const ownedItem = await NftOwnedDataService.getAllInfoByMemIdx(parseInt(param.idx))
    returnVal.ownedItem = ownedItem
    if (ownedItem.length) {
      const mintInfo = await NftMintDataService.getByIdxes(ownedItem.map((o) => o.mint_idx))
      const userInfo = await MemberService.getSimpleInfoByIdxes(mintInfo.map((o) => o.member_idx))
      returnVal.mintInfo = mintInfo
      returnVal.userInfo = userInfo
    } else {
      returnVal.mintInfo = []
      returnVal.userInfo = []
    }
    return Response.success(returnVal)
  }

  // 발행작품 리스트 탭   // dev 로 들어가면 있을듯!
  @Post("/my_mint")
  async getMyMintingData(@Body() body) {
    console.log(body.user)
    const mintInfo = await NftMintDataService.getAllforCreatedByMemIdx(body.user.idx)
    return Response.success(mintInfo)
  }

  // 리스팅하기 전, myPage에서 내가 create 한 작품의 상세정보를 보기위한 API
  @Post("/nft_detail")
  async getMyNftDetailList(@Body() body) {
    const mintInfo = await NftMintDataService.getOneForDetailPage(body.mintIdx)
    console.log("body..... : ", body, mintInfo.member_idx, body.user.idx)
    if (body.user.idx !== mintInfo.member_idx) {
      return Response.rejection({ message: "본인작품이 아닙니다" })
    }
    if (mintInfo.use_flag == 9) {
      return Response.rejection({ message: "flag : 9, 이미 삭제된 NFT 입니다." })
    }
    return Response.success(mintInfo)
  }

  // 소유작품 리스트 탭
  @Post("/my_owned")
  async getOwnedMintData(@Body() body) {
    const returnVal = {} as { ownedItem?: any[]; mintInfo?: any[]; userInfo?: any[] }
    const owned = await NftOwnedDataService.getMyInfoByMemIdx(body.user.idx)
    returnVal.ownedItem = owned
    if (owned.length) {
      const mintInfo = await NftMintDataService.getByIdxes(owned.map((o) => o.mint_idx))
      const userInfo = await MemberService.getSimpleInfoByIdxes(mintInfo.map((o) => o.member_idx))
      returnVal.mintInfo = mintInfo
      returnVal.userInfo = userInfo
    } else {
      returnVal.mintInfo = []
      returnVal.userInfo = []
    }
    return Response.success(returnVal)
  }

  // 즐겨찾기 탭  // 현재 기능 없음

  // 입찰작품 탭 : 내가 bidding에 참여한 정보, status //
  @Post("/my_bids")
  async getMyBidStatus(@Body() body) {
    const returnVal = {} as { bidItem?: any[]; mintInfo?: any[]; listingInfo?: any[]; userInfo?: any[] }
    const myBids = await NftAuctionDataService.getAllByMemIdx(body.user.idx)
    returnVal.bidItem = myBids
    if (myBids.length) {
      const mintInfo = await NftMintDataService.getByIdxes(myBids.map((b) => b.mint_idx))
      const listingInfo = await Promise.all(myBids.map(async (b) => await NftListingDataService.getAllInfoByIdx(parseInt(b.listing_idx))))
      const userInfo = await MemberService.getSimpleInfoByIdxes(mintInfo.map((o) => o.member_idx))
      returnVal.mintInfo = mintInfo
      returnVal.userInfo = userInfo
      returnVal.listingInfo = listingInfo.flat()
    } else {
      returnVal.mintInfo = []
      returnVal.userInfo = []
      returnVal.listingInfo = []
    }
    return Response.success(returnVal)
  }

  // 리워드 탭   /// 일단 디비에서 가져오도록 만들어는 둠.. 그러나 어떻게 저장되고 설계된지는 모르겠음! // 아마 어드민
  @Post("my_rewards")
  async getMyDSP(@Headers() header) {
    const user = await Jwt.verifyToken(header.access_token)
    const dspHistory = await DspService.getAllInfoByIdx(user.idx)
    return Response.success(dspHistory)
  }

  // 내 작품 delist 하기 ... 음... 리스팅 한 것, 안 한 것 나눠야할거같은데... DB 처리야 그냥 9번으로 끝나지만.. onChain처리는...
  @Post("del_minted")
  async deleteMyMintedData(@Body() body: deleteMintedNft) {
    const mintInfo = await NftMintDataService.getOneInfoByIdx(body.nftIdx)
    if (body.user.idx != mintInfo.member_idx) {
      return Response.rejection({ message: "본인 작품이 아닙니다." })
    }
    if (mintInfo.nft_status == "listing") {
      return Response.rejection({ message: "listing 되고 있는 NFT는 소각이 필요합니다" })
    }
    const result = await NftMintDataService.doUpdateStatusFlagByIdx(body.nftIdx, "delist", 9)
    return Response.success(result)
  }

  @Post("burn_nft")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async burnMyNft(@Body() body: burnNft) {
    //
    try {
      const ownedInfo = await NftOwnedDataService.getOneInfoByIdx(body.ownedIdx)
      if (body.user.idx != ownedInfo.member_idx) {
        return Response.rejection({ message: "본인 작품이 아닙니다." })
      }
      if (ownedInfo.nft_status !== "soldout") {
        return Response.rejection({ message: "본인 작품이 아닙니다" })
      }

      //  소각에 따른 mint Table 과 Listing Table의 처리는 기획쪽의 의사결정이 필요
      const sequelize = new Sequelize("mysql::memory:", { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
      const result = await sequelize.transaction(async (t) => {
        await NftOwnedDataService.doUpdateStatusAndFlagByIdx(body.ownedIdx, "delist", 9, t)
        await NftOwnedDataService.doUpdateBurnInfoByIdx(body.ownedIdx, body.burnTxId, 0, 0, t)
        return true
      })

      return Response.success()
    } catch (err) {
      throw err
    }
  }

  @Post("update_burn_info")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async updateNftBurnTxInfo(@Body() body: burnNft) {
    const result = await NftOwnedDataService.doUpdateBurnInfoByIdx(body.ownedIdx, body.burnTxId, body.burnBlockHash, body.burnBlockNum)
    return Response.success()
  }

  // 계정 탈퇴 //
  @Post("/del_account")
  async withdrawAccount(@Headers() header) {
    const user = await Jwt.verifyToken(header.access_token)
    await MemberService.withdrawalByIdx(user.idx)
    return Response.success()
  }
}
