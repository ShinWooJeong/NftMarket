import { Body, Controller, Post, Get, Query } from "@nestjs/common"
import { VerificationCodeMail } from "../modules/VerifCodeMailer"
import { Response } from "../helpers/ResponseHelper"
import { Email, LoginDto } from "../interfaces/AccountInterface"
import { MemberService } from "../services/MemberService"
import * as _ from "lodash"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"
import { OpTermsAndConditionsService } from "../services/OpTermsAndConditionService"
import { OpPrivacyPolicyService } from "../services/OpPrivacyPolicyService"
import { Jwt } from "../lib/JsonWebToken"
import { MemberSignupApproveCodeService } from "../services/MemberSignupApproveCodeService"

@Controller("/account")
export class CreateAccountController {
  constructor(private emailService: VerificationCodeMail) {}
  // 인증메일 보내기
  @Post("/send_mail")
  async sendVerifCodeEmail(@Body() body) {
    const result = await this.emailService.sendMemberVerificationCode(body.email, body.type, body.lang)
    return Response.success(result)
  }

  // 이메일 인증코드 확인
  @Get("/verify_code")
  async verifyTheCodeFromUser(@Query() req) {
    const email = await ParamCheckHelper.doCheckParam(req.email, "string", "")
    const type = await ParamCheckHelper.doCheckParam(req.type, "string", "")
    const at = await this.emailService.CompareAndCheckCode(email, type, req.hash)
    let dbData = await MemberSignupApproveCodeService.doSelectByEmail(email, type)
    await this.emailService.VerifCompleteUpdate(email, dbData.approve_code, at)
    const token = await Jwt.issueForTemporary(email, dbData.approve_code, "verifiedByEmail")
    return Response.success(token)
  }

  // 새 계정 INSERT
  @Post("/create_user")
  async CreateAccount(@Body() userInfo) {
    await Jwt.verifyTemporaryToken(userInfo.token, "verifiedByEmail")
    userInfo.email = await ParamCheckHelper.doCheckParam(userInfo.email, "string", "")
    userInfo.pw = await ParamCheckHelper.doCheckParam(userInfo.pw, "string", "")
    await MemberService.doInsert(userInfo)
    return Response.success()
  }

  /**
   * 계정상태 확인
   * @param req.email
   */
  @Post("/check_account")
  async checkAccount(@Body() req) {
    req.email = await ParamCheckHelper.doCheckParam(req.email, "string", "")
    await MemberService.checkAccountFlagByEmail(req.email)
    return Response.success()
  }
  // 비빌번호 변경
  @Post("/reset_pw")
  async ResetPassword(@Body() body) {
    await Jwt.verifyTemporaryToken(body.token, "verifiedByEmail")
    await MemberService.doResetPwByEmail(body)
    return Response.success()
  }

  @Get("/terms")
  async TermsPolicySender() {
    const termsAndCond = await OpTermsAndConditionsService.getOneByIdx(1)
    const privacyPolicy = await OpPrivacyPolicyService.getOneByIdx(1)

    return Response.success({ termsAndCond, privacyPolicy })
  }
}
