import { app } from "../app"
import { Op } from "sequelize"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"

export class ExhibitionNftService {
  /**
   * 기획전의 idx값으로 기획전 nft의 mint_idx값 추출
   * @param idx
   * @returns
   */
  static async getMintListByExbIdx(idx: number) {
    const result = await app().config.mysql.bluebay.exhibition_nft.findAll({
      where: {
        exhibition_idx: idx
      },
      raw: true
    })
    let mintList = []
    result.map((obj, i) => {
      mintList[i] = obj.mint_idx
    })
    const set = new Set(mintList)
    mintList = [...set]
    return mintList
  }

  static async getMintListByExbIdxArr(arr?) {
    try {
      let result
      if (!arr) {
        result = await app().config.mysql.bluebay.exhibition_nft.findAll({})
      } else {
        result = await app().config.mysql.bluebay.exhibition_nft.findAll({ where: { exhibition_idx: { [Op.in]: arr } } })
      }
      result = result.map((o) => o.mint_idx)
      return await ParamCheckHelper.doCheckDbDataValues(result, {}, false, true)
    } catch (err) {}
  }
}
