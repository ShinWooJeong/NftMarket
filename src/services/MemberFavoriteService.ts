import { Op } from "sequelize"
import { app } from "../app"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"

export class MemberFavoriteService {
  /**
   * 입력하기
   * @param message
   */
  static async doInsert(message: any) {}

  /**
   * 업데이트하기
   *
   * @param idx
   * @param params
   */
  static async doUpdateByIdx(idx: number, params) {
    const dbData = await app().config.mysql.bluebay.member_favorite.findOne({ where: { idx: idx } })
    return dbData.updateAttributes({ ip: params.ip })
  }

  /**
   * idx 조건절에 있는부분 삭제하기
   * @param idx
   */
  static async doDeleteByIdx(idx: number) {
    return await app().config.mysql.bluebay.member_favorite.destroy({ where: { idx: idx } })
  }

  /**
   * idx 조건절 정보 1개 가져오기
   * @param idx
   */
  static async getOneInfoByIdx(idx: number) {
    return await app().config.mysql.bluebay.member_favorite.findOne({ where: { idx: idx } })
  }

  /**
   * idx 조건절 정보 다 가져오기
   * @param idx
   */
  static async getAllInfoByMemIdx(idx: number) {
    const result = await app().config.mysql.bluebay.member_favorite.findAll({
      where: {
        member_idx: idx,
        use_flag: { [Op.ne]: 9 }
      }
    })
    return await ParamCheckHelper.doCheckParam(result, "object", {})
  }
}
