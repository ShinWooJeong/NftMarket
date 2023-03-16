import { Controller, Get, UseInterceptors, Query } from "@nestjs/common"
import { Response } from "../helpers/ResponseHelper"
import { ApiRunningTimeInterceptor } from "../interceptor/ApiRunningTimeInterceptor"
import { OpNoticeService } from "../services/OpNoticeService"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"
import { Redis } from "../lib/Redis"
import * as _ from "lodash"

@Controller("/notice")
export class OpNoticeController {
  @Get("/list")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async getNoticeList(@Query() param) {
    const limit = 8
    const page = await ParamCheckHelper.doCheckParam(parseInt(param.p), "number", 1)

    const cache = Redis.getInstance({ host: "127.0.0.1", port: 6379, select: 0, password: "2848nre0gfewryt72zfd4ttc" })
    const cacheData = await cache.get(`NoticePage:${page}`)
    let payload
    if (!_.isNil(cacheData)) {
      console.log("=============cache==============")
      payload = JSON.parse(cacheData)
    } else {
      console.log("==============db=============")
      payload = await OpNoticeService.getAllList(page, limit)

      await cache.set(`NoticePage:${page}`, JSON.stringify(payload))
    }

    // const { count, rows } = await OpNoticeService.getAllList(page, 10)
    // const result = await OpNoticeService.getAllList(page, 10)

    return Response.success(payload)
  }

  @Get("/detail")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async getNoticeDetail(@Query() param) {
    const idx = await ParamCheckHelper.doCheckParam(parseInt(param.id), "number", 1)

    await OpNoticeService.increaseViewHit(idx)
    const data = await OpNoticeService.getOneByInfo(idx)
    return Response.success(data)
  }
}
