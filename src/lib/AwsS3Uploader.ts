import * as AWS from "aws-sdk"
import { app } from "../app"
import { Response } from "../helpers/ResponseHelper"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"
import { DateHelpers } from "../helpers/DateHelpers"
import * as _ from "lodash"
let md5 = require("md5")

export class AwsS3Uploader {
  static async setS3Config() {
    await AWS.config.update({
      region: app().config.aws.region,
      credentials: {
        accessKeyId: app().config.aws.key,
        secretAccessKey: app().config.aws.secret
      }
    })
  }
  ////////////////////////////////////////////////////
  static async deleteProfile(fileName) {
    await this.setS3Config
    const s3Params = {
      Bucket: app().config.aws.bucket_name,
      Key: "member_profile" + fileName
    }
    await new AWS.S3().deleteObject(s3Params, (err, data) => {
      if (err) throw err
    })
    return Response.success()
  }
  ////////////////////////////////////////////////////
  static async uploadFile(file, bucket, subPath, sizeLimit?, saveName?) {
    if (file.size > sizeLimit) {
      return Response.rejection("too large profile size")
    }
    let extension = file.mimetype.split("/")
    let savingName = saveName
    if (_.isUndefined(savingName) || _.isNull(savingName) || saveName.length == 0) {
      savingName = md5(file.originalname + DateHelpers.getCurrentUTCDateTime()) + "." + extension[1]
    }
    const s3Parms = {
      Key: savingName,
      Body: file.buffer,
      Bucket: bucket + "/" + subPath,
      ACL: "public-read",
      ContentType: extension[1],
      ContentDisposition: "inline"
    }
    await this.setS3Config()
    await new AWS.S3().putObject(s3Parms, (err, data) => {
      if (err) throw err
    })
    return app().config.aws.cloudfront_url + "/" + subPath + "/" + savingName
  }
  ////////////////////////////////////////////////////
  static async uploadTest(file) {
    ////=================================================
    await this.checkFileSize(file.size, 10000000) ///////////
  }
  ////////////////////////////////////////////////////

  static async uploadArt(files) {
    if (files.thumbNail[0].size > 10000000 || files.content[0].size > 100000000) {
      // 10MB 100MB
      return Response.failure("too large size")
    }
    let fileNms = new Object()
    await this.setS3Config()
    for (let file in files) {
      //console.log("uploaded files iterate :", files[file], " : ", files[file][0].mimetype)

      let originName = files[file][0].originalname
      // console.log("origin file name : ", originName)
      let temp = originName.split(".") //files[file][0].mimetype.split("/")
      // console.log("mime type extension : ", temp[temp.length - 1])
      let extension = temp[temp.length - 1]
      if (extension == "jfif") {
        extension = "jpg"
      }

      //let extension = files[file][0].mimetype.split("/")
      let savingName = md5(files[file][0].originalname + DateHelpers.getCurrentUTCDateTime())

      let folderName = "/nft"
      if (file == "thumbNail") {
        folderName = "/thumbs"
      }

      const s3Parms = {
        Key: savingName,
        Body: files[file][0].buffer,
        Bucket: app().config.aws.bucket_name + folderName,
        ACL: "public-read",
        ContentType: extension,
        ContentDisposition: "inline"
      }
      await new AWS.S3().putObject(s3Parms, (err, data) => {
        if (err) throw err
      })
      //fileNms.push(savingName)
      fileNms[file] = savingName
    }
    return fileNms
  }

  static async checkFileSize(fileSize: number, limitSize: number) {
    if (fileSize > limitSize) {
      return Response.failure("too large size")
    } else {
      return Response.success()
    }
  }
}
