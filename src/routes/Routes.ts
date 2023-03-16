import { Module } from "@nestjs/common"
import { AuctionController } from "../controllers/AuctionController"
import { AuthController } from "../controllers/AuthController"
import { SocialController } from "../controllers/SocialController"
import { MemberProfileController } from "../controllers/MemberProfileController"
import { CreateAccountController } from "../controllers/CreateAccountController"
import { VerificationCodeMail } from "../modules/VerifCodeMailer"
import { OpFaqController } from "../controllers/OpFaqController"
import { OpNoticeController } from "../controllers/OpNoticeController"
import { IndexController } from "../controllers/IndexController"
import { CreateMetadataController } from "../controllers/CreateMetadataController"
import { ListingController } from "../controllers/ListingController"
import { MainController } from "../controllers/MainController"
import { EventController } from "../controllers/EventController"
import { MiddlewareConsumer, NestModule } from "@nestjs/common/interfaces"
import { ParamFilterMiddleware } from "../interceptor/ParamFilterMiddleware"
import { AuthMiddleware } from "../interceptor/AuthMiddleware"
import { TempAuthMiddleware } from "../interceptor/TempAuthMiddleware"
import { RequestMethod } from "@nestjs/common/enums"
import { TestController } from "../controllers/TestController"

@Module({
  imports: [],
  controllers: [
    IndexController,
    AuctionController,
    AuthController,
    CreateAccountController,
    SocialController,
    MemberProfileController,
    OpFaqController,
    OpNoticeController,
    CreateMetadataController,
    ListingController,
    MainController,
    EventController,
    TestController
  ],
  providers: [VerificationCodeMail]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ParamFilterMiddleware).forRoutes("*")
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: "account/check_account", method: RequestMethod.POST },
        { path: "account/send_mail", method: RequestMethod.POST },
        { path: "auth/do_login", method: RequestMethod.POST },
        { path: "/account/reset_pw", method: RequestMethod.POST },
        { path: "account/create_user", method: RequestMethod.POST }
      )
      .forRoutes({ path: "*", method: RequestMethod.POST })
    consumer.apply(TempAuthMiddleware).forRoutes({ path: "account/reset_pw", method: RequestMethod.POST }, { path: "account/create_user", method: RequestMethod.POST })
  }
}
