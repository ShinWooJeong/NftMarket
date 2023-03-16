import { Controller, Post, Headers, UploadedFiles, UseInterceptors, Body, Get } from "@nestjs/common"
import { FileFieldsInterceptor } from "@nestjs/platform-express/multer"
import { ApiRunningTimeInterceptor } from "../interceptor/ApiRunningTimeInterceptor"
import { Jwt } from "../lib/JsonWebToken"

import { app } from "../app"

import { AwsS3Uploader } from "../lib/AwsS3Uploader"
import { MemberService } from "../services/MemberService"
import { Response } from "../helpers/ResponseHelper"
import { NftMintDataService } from "../services/NftMintDataService"
import { AxiosHelpers } from "../helpers/AxiosHelpers"
import { DateHelpers } from "../helpers/DateHelpers"
const fs = require("fs")
const formData = require("form-data")
// console.log(app)
const url = "https://api.nft.storage/upload"

interface createMetaData {
  user: any
  mint_type: string
  desc: string
  title: string
  royalty: string
  category: string
  price: any
  amount: number
  sale_type: "auction" | "basic" // it's not working..
  tag: string
  event_type: string
  currency: "0" | "1"
}

@Controller("/nft")
export class CreateMetadataController {
  @Post("/upload_art")
  @UseInterceptors(ApiRunningTimeInterceptor)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "thumbNail", maxCount: 1 },
      { name: "content", maxCount: 1 }
    ])
  )
  async uploadS3Art(@UploadedFiles() files: { thumbNail: Express.Multer.File[]; content: Express.Multer.File[] }, @Headers("access_token") access_token, @Body() req: createMetaData) {
    let fileName
    try {
      const userInfo = await Jwt.verifyToken(access_token) //req.user

      // 파라미터 값들 유효성 검사

      if (req.sale_type != "auction") {
        if (req.sale_type != "basic") {
          return Response.rejection({ message: "올바른 판매 타입이 아닙니다." })
        }
      }
      if (req.sale_type == "auction" && req.amount != 1) {
        return Response.rejection({ message: "경매는 발행 수량이 1개로 고정됩니다." })
      }
      if (req.sale_type == "basic" && req.amount < 1) {
        return Response.rejection({ message: "발행 수량은 1개 이상이여야 합니다." })
      }
      let priceRegExp = /^([1-9][0-9]+|[0-9])((?=[.])([.]([0-9]+)?[1-9])|$)$/
      if (!priceRegExp.test(req.price)) {
        return Response.rejection({ message: "price 값 형태가 올바르지 않습니다." })
      }
      if (!(req.currency == "0" || req.currency == "1")) {
        return Response.rejection({ message: "currency type이 올바르지 않습니다." })
      }

      let extension
      // 확장자 jfif 를 위한 처리..
      for (let file in files) {
        let originName = "one.last.time.jfif" //files[file][0].originalname
        console.log("origin file name : ", originName)
        let temp = originName.split(".") //files[file][0].mimetype.split("/")
        console.log("mime type extension : ", temp[temp.length - 1])
        extension = temp[temp.length - 1]
        if (extension == "jfif") {
          extension = "jpg"
        }
      }

      // S3에 저장
      const fileNames = await AwsS3Uploader.uploadArt(files)
      console.log("check namesssss : ", fileNames, fileNames["content"])
      // const extension = files["content"][0].mimetype.split("/")
      fileName = `${fileNames["content"]}.${extension}`

      // member DB에서 필요한 값들을 가져오자 ( 지갑주소, nickname,,,, )
      const memberInfo = await MemberService.getOneInfoByIdx(userInfo.idx)
      if (memberInfo.account == null) {
        return Response.failure({ code: 404, message: "connect wallet" })
      }
      // if (memberInfo.nick_name != "Unnamed") { // member 정보에 닉네임이 있으면 저장할 file명 앞에 닉네임 추가
      //   fileName = `${memberInfo.nick_name}_${req.title}.${extension[1]}`
      // }

      // 로컬에 이미지 파일로 만들어서 저장
      await fs.writeFile(`./${fileName}`, files["content"][0].buffer, (err) => {
        if (err) throw err
      })

      // IPFS에 업로드 : 먼저 이미지만
      let fd = new formData()
      let loadedFile = await fs.createReadStream(`./${fileName}`)
      await fd.append("file", loadedFile)
      const contentType = "multipart/form-data; boundary=" + (await fd.getBoundary())
      const first = await AxiosHelpers.doCallApiUrlAndGetDataAndSetHeader("post", url, "", fd, app().config.nft_storage_key, contentType)
      const fileCID = first.value?.cid

      // IPFS에 업로드 : 리턴받은 이미지의 CID를 추가해 MetaData 생성후
      let meta = {
        image: "https://ipfs.io/ipfs/" + fileCID + "/" + fileName,
        name: req.title,
        description: req.desc,
        type: files["content"][0].mimetype,
        external_url: "https://www.01etc.com/live/marketplace", // TODO : 환경설정으로 빼서
        attributes: []
      }
      const second = await AxiosHelpers.doCallApiUrlAndGetDataAndSetHeader("post", url, "", meta, app().config.nft_storage_key)
      const metadataURL = second.value.cid

      // DB NFT 테이블에 INSERT
      const DTO = {
        mint_type: "user",
        member_idx: userInfo.idx,
        nft_creator: memberInfo.account,
        nft_type: files["content"][0].mimetype,
        nft_royalty: req.royalty,
        nft_category: req.category,
        nft_img: app().config.aws.cloudfront_url + "/thumbs/" + fileNames["thumbNail"],
        nft_title: req.title,
        nft_desc: req.desc,
        nft_price: req.price,
        metadata_url: "https://ipfs.io/ipfs/" + metadataURL,
        ipfs_url: "https://ipfs.io/ipfs/" + fileCID + "/" + fileName,
        nft_url: app().config.aws.cloudfront_url + "/nft/" + fileNames["content"],
        item_amount: req.amount,
        sales_type: req.sale_type,
        nft_tag: req.tag,
        event_type: req.event_type,
        currency: req.currency,
        set_date: DateHelpers.getCurrentUTCDateTime(),
        created_at: DateHelpers.getCurrentUCTimestamp()
      }
      await NftMintDataService.doInsert(DTO)

      // 로컬에 저장한 파일 삭제
      await fs.rm(`./${fileName}`, (err) => {
        if (err) console.error("error in delete nftcontent file : ", err)
      })

      return Response.success()
    } catch (err) {
      // 로컬에 저장한 파일 삭제
      await fs.rm(`./${fileName}`, (err) => {
        if (err) console.error("error in delete nftcontent file : ", err)
      })
      throw err
    }
  }
}
