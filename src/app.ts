import "source-map-support/register"

import { NestExpressApplication } from "@nestjs/platform-express"
import { NestFactory } from "@nestjs/core"
import ServerBase from "./modules/ServerBase"

import { ServerConfigInterface } from "./interfaces/ServerConfigInterface"
import { AppModule } from "./routes/Routes"


let singleton: ApiServer

export function app() {
  return singleton
}

export class ApiServer extends ServerBase {
  public app: NestExpressApplication
  public config: ServerConfigInterface

  constructor(config = null) {
    super(config)
    singleton = this
  }


  public async initApp() {
    this.app = await NestFactory.create(AppModule, {
      bodyParser: true,
    })
    this.app.enableCors()
  }


  public async doServerStartForApi() {
    await this.app.listen(this.config.port.api_port)
  }


  public async doResetDataset() {
    //await app().config.mdb.local.flushdb()
  }
}

async function bootstrap() {
  singleton = new ApiServer()
  await singleton.initApp()
  await singleton.serverStartForApi()
  //await singleton.doResetDataset()
}

bootstrap().then()

