import { DateHelpers } from "./../helpers/DateHelpers"
import { Injectable } from "@nestjs/common"
import { InvalidSmtpException } from "../exceptions/SmtpException"
import { MemberSignupApproveCodeService } from "../services/MemberSignupApproveCodeService"
import { DbNotFoundException } from "../exceptions/DbNotFoundException"
import { EmailOptions } from "../interfaces/AccountInterface"
import { OpEmailTemplateService } from "../services/OpEmailTemplateService"
import { InvalidParameterException } from "../exceptions/InvalidParameterException"
import { MemberService } from "../services/MemberService"
import Mail = require("nodemailer/lib/mailer")
import * as nodemailer from "nodemailer"
import * as _ from "lodash"
import { app } from "../app"
const crypto = require("crypto")

@Injectable()
export class VerificationCodeMail {
  private transporter: Mail

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.worksmobile.com",
      port: 587,
      secure: false,
      auth: {
        user: app().config.mailer.user,
        pass: app().config.mailer.password
      },
      requireTSL: true
    })
  }

  /**
   * 인증메일 보내기
   * @param emailAddress
   * @param type  'reset_password' | 'signup'
   * @param lang 'ko' | 'eng'
   */
  async sendMemberVerificationCode(emailAddress, type: string, lang: string) {
    let code = Math.floor(Math.random() * (1000000 - 100000)) + 100000
    let expiredTime = Math.floor((new Date().getTime() + 180000) / 1000)
    let mailTemplate

    if (type === "reset_password") await MemberService.checkAccountFlagByEmail(emailAddress)

    let codeData = {
      email: emailAddress,
      type: type,
      approve_code: code,
      expired_at: expiredTime
    }

    if (!lang || !type || !emailAddress) {
      throw new InvalidParameterException("parameter 값을 확인해주세요", 400)
    }

    try {
      if (type == "reset_password") {
        const result = await OpEmailTemplateService.getOneInfoByKey("find_password")
        if ((lang = "ko")) {
          mailTemplate = result.content_ko.replace("[{{code}}]", String(code))
        } else if ((lang = "eng")) {
          mailTemplate = result.content_en.replace("[{{code}}]", String(code))
        }
      } else if (type == "signup") {
        const result = await OpEmailTemplateService.getOneInfoByKey("signup_email")
        if ((lang = "ko")) {
          mailTemplate = result.content_ko.replace("[{{code}}]", String(code))
        } else if ((lang = "eng")) {
          mailTemplate = result.content_en.replace("[{{code}}]", String(code))
        }
      }

      await MemberSignupApproveCodeService.doInsert(codeData)
      const mailOptions: EmailOptions = {
        from: "help@01etc.com",
        to: emailAddress, //"essie@delio.io",
        subject: "인증 메일",
        html: mailTemplate //script
      }
      await this.transporter.sendMail(mailOptions)
    } catch (err) {
      throw new InvalidSmtpException("SMTP" + err)
    }
  }

  async CompareAndCheckCode(email, type, hash) {
    const VerifyAt = DateHelpers.getCurrentUCTimestamp()
    let dbData = await MemberSignupApproveCodeService.doSelectByEmail(email, type)
    let str = dbData.email + dbData.approve_code
    let compareHash = crypto
      .createHash("sha256")
      .update(str)
      .digest("hex")
    if (hash.toUpperCase() != compareHash.toUpperCase()) {
      throw new DbNotFoundException("코드가 일치하지 않습니다", 402)
    }
    if (dbData.is_used === "Y") {
      throw new DbNotFoundException("이미 사용한 인증코드 입니다", 401)
    }
    if (dbData.expired_at < VerifyAt) {
      throw new DbNotFoundException(`인증코드가 유효하지 않습니다 : ${dbData.expired_at}, ${VerifyAt}`, 402)
    }
    return VerifyAt
  }

  async VerifCompleteUpdate(email, code, at) {
    await MemberSignupApproveCodeService.doUpdateByCode(email, code, at)
  }
}
