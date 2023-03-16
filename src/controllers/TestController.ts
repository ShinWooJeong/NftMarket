import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from "@nestjs/common"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { app } from "../app"
import { AxiosHelpers } from "../helpers/AxiosHelpers"
import { Response } from "../helpers/ResponseHelper"
import { NftListingDataService } from "../services/NftListingDataService"
import { NftMintDataService } from "../services/NftMintDataService"
import { filter } from "lodash"
import { MemberService } from "../services/MemberService"
import { NftAuctionDataService } from "../services/NftAuctionDataService"
const fs = require("fs")
const formData = require("form-data")
const url = "https://api.nft.storage/upload"

@Controller("test")
export class TestController {
  @Get("get")
  async TestGet() {
    const previousBids = await NftAuctionDataService.getAllByListIdx(140)
    return previousBids
  }

  @Post("post")
  async TestPost(@Body() body) {
    console.log("post test", body)
    return Response.success()
  }

  @Post("ipfs")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "thumbNail", maxCount: 1 },
      { name: "content", maxCount: 1 }
    ])
  )
  async TestIpfs(@UploadedFiles() files: { thumbNail: Express.Multer.File[]; content: Express.Multer.File[] }, @Body() body) {
    let originName
    let extension
    for (let file in files) {
      originName = "one.last.time.jfif" //files[file][0].originalname
      console.log("origin file name : ", originName)
      let temp = originName.split(".") //files[file][0].mimetype.split("/")
      console.log("mime type extension : ", temp[temp.length - 1])
      extension = temp[temp.length - 1]
      if (extension == "jfif") {
        extension = "jpg"
      }
    }

    // 로컬에 이미지 파일로 만들어서 저장
    await fs.writeFile(`./${originName}`, files["content"][0].buffer, (err) => {
      if (err) throw err
    })

    // IPFS에 업로드 : 먼저 이미지만
    let fd = new formData()
    let loadedFile = await fs.createReadStream(`./${originName}`)
    await fd.append("file", loadedFile)
    const contentType = "multipart/form-data; boundary=" + (await fd.getBoundary())
    const first = await AxiosHelpers.doCallApiUrlAndGetDataAndSetHeader("post", url, "", fd, app().config.nft_storage_key, contentType)
    const fileCID = first.value?.cid

    // // IPFS에 업로드 : 리턴받은 이미지의 CID를 추가해 MetaData 생성후
    // let meta = {
    //   image: "https://ipfs.io/ipfs/" + fileCID + "/" + fileName,
    //   name: req.title,
    //   description: req.desc,
    //   type: files["content"][0].mimetype,
    //   external_url: "https://www.01etc.com/live/marketplace", // TODO : 환경설정으로 빼서
    //   attributes: []
    // }
    // const second = await AxiosHelpers.doCallApiUrlAndGetDataAndSetHeader("post", url, "", meta, app().config.nft_storage_key)
    // const metadataURL = second.value.cid

    // 로컬에 저장한 파일 삭제
    await fs.rm(`./${originName}`, (err) => {
      if (err) console.error("error in delete nftcontent file : ", err)
    })
  }
}
