import axios from "axios"
import { LogHelper } from "./LogHelper"

export class AxiosHelpers {
  /**
   * 외부 통신 하는 라이브 러리
   * @param url
   * @param param
   * @param method
   */
  static async doCallApiUrlAndGetData(url: string, param: string, method) {
    LogHelper.info("axios url : " + url)
    LogHelper.info("axios param : " + param)
    LogHelper.info("axios method : " + method)

    const response = await axios({
      url: url + param,
      method: method
    })

    LogHelper.info("axios response : " + JSON.stringify(response.data))
    return response.data
  }

  static async doCallApiUrlAndGetDataAndSetHeader(method, url: string, param?: string, data?, auth_key?, contentType?: string) {
    LogHelper.info("axios url : " + url)
    LogHelper.info("axios param : " + param)
    LogHelper.info("axios method : " + method)

    let config = {
      url: url,
      method: method,
      headers: {
        "content-type": "application/json; charset=UTF-8" // 'application/x-www-form-urlencoded'
      }
    }
    if (param) {
      config.url = url + param
    }
    if (data) {
      config["data"] = data
    }
    if (auth_key) {
      config.headers["authorization"] = "Bearer " + auth_key
    }
    if (contentType) {
      config.headers["content-type"] = contentType
    }

    let responseforReturn

    await axios(config)
      .then(function(response) {
        responseforReturn = response.data
      })
      .catch(function(error) {
        if (error.response) {
          console.log("error.response.data : ", error.response.data)
          responseforReturn = error.response.data
        } else if (error.request) {
          //console.log("DDD", error.request)
        } else {
          //console.log("Error... ", error.message)
        }
        //console.log("FFF", error.config)
      })

    LogHelper.info("axios response : " + JSON.stringify(responseforReturn.data))
    return responseforReturn
  }
}
