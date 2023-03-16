import { schema_nft_auction_data } from "../models/mysql/bluebay/nft_auction_data"
import { app } from "../app"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"
import { DateHelpers } from "../helpers/DateHelpers"

export class NftAuctionDataService {
  /**
   * 입찰 bidding 내용 db insert
   * @param body
   * @param mintInfo 해당 nft가 minting 된 체인 통화
   * @returns
   */
  static async doInsertRow(body, mintInfo) {
    try {
      const result = await app().config.mysql.bluebay.nft_auction_data.create({
        member_idx: body.user.idx,
        listing_idx: body.listingIdx,
        mint_idx: body.mintIdx,
        currency_type: mintInfo.currency,
        auction_eth: body.auctionEth,
        auction_krw: body.auctionKrw,
        max_eth: "0",
        my_eth: body.walletBalance,
        ac_winner: "N",
        alert_flag: "N",
        set_date: DateHelpers.getCurrentUTCDateTime(),
        use_flag: 1
      })

      return await ParamCheckHelper.doCheckDbDataValues(result?.dataValues, {}, false, false)
    } catch (err) {
      throw err
    }
  }

  static async getOneInfoByIdx(idx) {
    try {
      const result = await app().config.mysql.bluebay.nft_auction_data.findOne({
        where: { idx: idx },
        raw: true
      })
      return await ParamCheckHelper.doCheckDbDataValues(result, {}, false, false)
    } catch (err) {
      throw err
    }
  }

  /**
   * member_idx 로 해당 멤버의 bids rows 얻기
   * @param idx
   * @returns
   */
  static async getAllByMemIdx(idx: number) {
    try {
      const result = await app().config.mysql.bluebay.nft_auction_data.findAll({
        where: { member_idx: idx },
        raw: true
      })
      return await ParamCheckHelper.doCheckDbDataValues(result, {}, false, true)
    } catch (err) {
      throw err
    }
  }

  static async getAllByListIdx(idx: number) {
    try {
      const result = await app().config.mysql.bluebay.nft_auction_data.findAll({
        where: { listing_idx: idx },
        raw: true
      })

      return await ParamCheckHelper.doCheckDbDataValues(result, [], false, true)
    } catch (err) {
      throw err
    }
  }
}
