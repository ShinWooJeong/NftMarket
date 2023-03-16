import { app } from "../app"
import { DbNotFoundException } from "../exceptions/DbNotFoundException"

export class MemberSignupApproveCodeService {
  /**
   * 입력하기
   * @param message
   */
  static async doInsert(message: any) {
    let returned = await app().config.mysql.bluebay.member_signup_approve_code.create({
      email: message.email,
      type: message.type,
      approve_code: message.approve_code,
      expired_at: message.expired_at
    })
  }

  // code로 조회하기 및 expired_at && code check
  static async doSelectByCode(code) {
    try {
      const result = await app().config.mysql.bluebay.member_signup_approve_code.findOne({ where: { approve_code: code } })
      if (result == null) {
        throw new DbNotFoundException("데이터가 없습니다")
      }
      return result.dataValues
    } catch (err) {
      throw new DbNotFoundException("데이터가 없습니다")
    }
  }
  static async doSelectByEmail(email, type) {
    try {
      const result = await app().config.mysql.bluebay.member_signup_approve_code.findOne({
        where: { email: email, type: type },
        order: [["idx", "DESC"]]
      })
      if (result == null) {
        throw new DbNotFoundException("데이터가 없습니다")
      }
      return result.dataValues
    } catch (err) {
      throw new DbNotFoundException("데이터가 없습니다")
    }
  }

  /**
   * 업데이트하기
   *
   * @param emaiil
   * @param code
   */
  static async doUpdateByCode(email, code, at) {
    const dbData = await app().config.mysql.bluebay.member_signup_approve_code.findOne({
      where: {
        email: email,
        approve_code: code
      }
    })
    return dbData.updateAttributes({ is_used: "Y", approved_at: at })
  }

  /**
   * idx 조건절에 있는부분 삭제하기
   * @param idx
   */
  static async doDeleteByIdx(idx: number) {
    return await app().config.mysql.bluebay.member.destroy({
      where: { idx: idx }
    })
  }

  /**
   * idx 조건절 정보 1개 가져오기
   * @param idx
   */
  static async getOneInfoByIdx(idx: number) {
    return await app().config.mysql.bluebay.member.findOne({
      where: { idx: idx }
    })
  }
}
