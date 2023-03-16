import { Controller, Get } from "@nestjs/common"
import { Response } from "../helpers/ResponseHelper"


@Controller("/")
export class IndexController {
  @Get("/")
  async doInsert() {
    return Response.success()
  }

}
