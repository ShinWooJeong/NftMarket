import { app } from "../app"
import { DbNotFoundException } from "../exceptions/DbNotFoundException"
import { DateHelpers } from "../helpers/DateHelpers"

export class MemberFollowService {
  /**
   * 입력하기
   * @param message
   */

  static async doCheckThenInsert(userIdx, objIdx) {
    const result = await app().config.mysql.bluebay.member_follow.findOrCreate({
      where: {
        member_idx: userIdx,
        follow_idx: objIdx
      },
      defaults: {
        set_date: DateHelpers.getCurrentUTCDateTime(),
        created_at: DateHelpers.getCurrentUCTimestamp()
      }
    })
    const [, isInsered] = result
    if (!isInsered) {
      throw new DbNotFoundException("already followed")
    }
    return
  }

  /**
   * 조회하기
   *
   * @param idx
   * @param params
   */

  static async getFollowersByIdx(idx: number) {
    let resultAll = await app().config.mysql.bluebay.member_follow.findAll({
      attributes: ["follow_idx"],
      where: { member_idx: idx }
    })
    if (resultAll.length == 0) {
      // throw new DbNotFoundException("Db not found")
      return []
    }
    let result = []
    resultAll.forEach((element, i) => {
      result[i] = element.dataValues.follow_idx
    })
    return result
  }

  static async getFollowingsByIdx(idx: number) {
    const resultAll = await app().config.mysql.bluebay.member_follow.findAll({
      attributes: ["member_idx"],
      where: { follow_idx: idx }
    })
    if (resultAll.length == 0) {
      // throw new DbNotFoundException("Db not found")
      return []
    }
    let result = []
    resultAll.forEach((element, i) => {
      result[i] = element.dataValues.member_idx
    })
    return result
  }

  /**
   * idx 조건절에 있는부분 삭제하기
   * @param idx
   */
  static async doDeleteByIdx(userIdx, objIdx) {
    const isDeleted = await app().config.mysql.bluebay.member_follow.destroy({ where: { member_idx: userIdx, follow_idx: objIdx } })
    if (!isDeleted) {
      throw new DbNotFoundException("already deleted")
    }
    return
  }

  /**
   * idx 조건절 정보 1개 가져오기
   * @param idx
   */
  static async getOneInfoByIdx(userIdx, objIdx) {
    return await app().config.mysql.bluebay.member_follow.findOne({ where: { member_idx: userIdx, follow_idx: objIdx } })
  }
}
