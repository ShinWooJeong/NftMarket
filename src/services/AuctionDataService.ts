import { app } from "../app"

export class AuctionDataService {
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
    const dbData = await app().config.mysql.bluebay.nft_auction_data.findOne({ where: { idx: idx } })
    return dbData.updateAttributes({ ip: params.ip })
  }

  /**
   * idx 조건절에 있는부분 삭제하기
   * @param idx
   */
  static async doDeleteByIdx(idx: number) {
    return await app().config.mysql.bluebay.nft_auction_data.destroy({ where: { idx: idx } })
  }

  /**
   * idx 조건절 정보 1개 가져오기
   * @param idx
   */
  static async getOneInfoByIdx(idx: number) {
    return await app().config.mysql.bluebay.nft_auction_data.findOne({ where: { idx: idx } })
  }

  /**
   * idx 조건절 정보 여러개 가져오기
   * @param idx
   */
  static async getAllInfoByIdxes(listing_idx, mint_idx: number) {
    try {
      const result = await app().config.mysql.bluebay.nft_auction_data.findAll({
        where: {
          listing_idx: listing_idx,
          mint_idx: mint_idx
        }
      })
      if (result == null) {
        return null
      }
      return result
    } catch (err) {
      throw Error(err)
    }
  }

  /**
   * idx 조건절 정보 여러개 가져오기
   * @param idx
   */
  static async getWinnterByIdxes(listing_idx, mint_idx: number) {
    try {
      const result = await app().config.mysql.bluebay.nft_auction_data.findOne({
        where: {
          listing_idx: listing_idx,
          mint_idx: mint_idx,
          ac_winner: "Y"
        }
        //order:[['list_idx', 'ASC'],['mint']]
      })
      if (result == null) {
        return null
      }
      return result
    } catch (err) {
      throw Error(err)
    }
  }
}
