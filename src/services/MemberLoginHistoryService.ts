import { Op } from "sequelize"
import { app } from "../app"
import { DateHelpers } from "../helpers/DateHelpers"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"
import { Response } from "../helpers/ResponseHelper"

export class MemberLoginHistoryService {
  /**
   * 입력하기
   * @param member_idx
   * @param platform 'web' / 'ios' / 'android'
   */
  static async doInsert(member_idx: number, platform: string) {
    try {
      await app().config.mysql.bluebay.member_login_history.create({
        member_idx: member_idx,
        platform: platform,
        set_date: DateHelpers.getCurrentUTCDateTime(),
        created_at: DateHelpers.getCurrentUCTimestamp()
      })
    } catch (err) {
      Response.failure(err)
    }
  }

  /**
   * 업데이트하기
   *
   * @param idx
   * @param params
   */
  static async doUpdateByIdx(idx: number, params) {
    const dbData = await app().config.mysql.bluebay.member_login_history.findOne({ where: { idx: idx } })
    return dbData.updateAttributes({ ip: params.ip })
  }

  /**
   * idx 조건절에 있는부분 삭제하기
   * @param idx
   */
  static async doDeleteByIdx(idx: number) {
    return await app().config.mysql.bluebay.member_login_history.destroy({ where: { idx: idx } })
  }

  /**
   * idx 조건절 정보 1개 가져오기
   * @param idx
   */
  static async getOneInfoByIdx(idx: number) {
    return await app().config.mysql.bluebay.member_login_history.findOne({ where: { idx: idx } })
  }

  /**
   * idx 조건절 정보 다 가져오기
   * @param idx
   */
  static async getAllInfoByMemIdx(idx: number) {
    const result = await app().config.mysql.bluebay.member_login_history.findAll({
      where: {
        member_idx: idx
      }
    })
    return await ParamCheckHelper.doCheckParam(result, "object", {})
  }
}
