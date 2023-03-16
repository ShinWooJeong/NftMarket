import { Controller, Get, UseInterceptors, Query } from "@nestjs/common"
import { Response } from "../helpers/ResponseHelper"
import { ApiRunningTimeInterceptor } from "../interceptor/ApiRunningTimeInterceptor"
import { OpNoticeService } from "../services/OpNoticeService"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"
import { Redis } from "../lib/Redis"
import * as _ from "lodash"
import { OpFaqService } from "../services/OpFaqService"
import { app } from "../app"

@Controller("/faq")
export class OpFaqController {
  @Get("/list")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async getNoticeList(@Query() param) {
    const limit = 15
    const page = await ParamCheckHelper.doCheckParam(parseInt(param.p), "number", 1)

    const cache = Redis.getInstance(app().config.redis_local)
    const cacheData = await cache.get(`FaqPage:${page}`)

    let payload
    if (!_.isNil(cacheData)) {
      console.log("=============cache==============")
      payload = JSON.parse(cacheData)
    } else {
      console.log("==============db=============")
      payload = await OpFaqService.getAllList(page, limit, 5)
      await cache.set(`FaqPage:${page}`, JSON.stringify(payload))
    }

    //const payload = await OpTestService.getList(page, limit, aaaa);

    return Response.success(payload)
  }

  @Get("/detail")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async getNoticeDetail(@Query() param) {
    const idx = await ParamCheckHelper.doCheckParam(parseInt(param.id), "number", 1)
    await OpFaqService.increaseViewHit(idx)
    const data = await OpFaqService.getDetail(idx)
    return Response.success(data)
  }

  @Get("/helped")
  @UseInterceptors(ApiRunningTimeInterceptor)
  async helped(@Query() param) {
    const isGood = await ParamCheckHelper.doCheckParam(param.good.toLowerCase(), "string", "1")
    if (isGood == "y") {
      await OpFaqService.didHelp(true, param.idx)
      return Response.success()
    }
    if (isGood == "n") {
      await OpFaqService.didHelp(false, param.idx)
      return Response.success()
    }

    return Response.failure(`'y' or 'n' param only`)
  }
}
