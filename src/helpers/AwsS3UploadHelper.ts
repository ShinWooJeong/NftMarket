import {app} from "../app";
const fs = require('fs')
import * as AWS from "aws-sdk";


export class AwsS3UploadHelper {

  static async doUploadPublicS3 (bucketName, subPath, fileName, contentType, filePath) {
    try {
      const s3 = new AWS.S3({
        region: app().config.aws.region,
        credentials: {
          accessKeyId: app().config.aws.key,
          secretAccessKey: app().config.aws.secret
        }
      })

      const file = fs.createReadStream(filePath)
      let key

      if (subPath !== null) {
        key = subPath + "/" + fileName
      } else {
        key = fileName
      }

      const params = {
        Bucket: bucketName,
        Key: key,
        ContentType: contentType,
        ContentDisposition: "inline",
        ACL: 'public-read',
        Body: file,
      }

      await s3.upload(params).promise()
    } catch (e) {
      console.log(e)

    }
  }

  static async doDeleteS3(bucketName, subPath, fileName) {
    try {
      const s3 = new AWS.S3({
        region: app().config.aws.region,
        credentials: {
          accessKeyId: app().config.aws.key,
          secretAccessKey: app().config.aws.secret
        }
      })
      const params = {
        Bucket: bucketName,
        Key: subPath + fileName
      }
      await s3.deleteObject(params).promise()

    } catch (e) {

    }

  }

}
