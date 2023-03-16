import { Op, Transaction } from "sequelize"
import { app } from "../app"
import { NftMintDataService } from "./NftMintDataService"
import { DateHelpers } from "../helpers/DateHelpers"
import { getAttributes } from "../modules/ConnectionMysql"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"
import { Param } from "@nestjs/common"

export class NftListingDataService {
  /**
   * 입력하기
   * @param message
   */
  static async doInsert(message: any, ownedIdx: number) {
    try {
      const mint = await NftMintDataService.getOneInfoByIdx(message.mintNum)
      await app().config.mysql.bluebay.nft_listing_data.create({
        mint_idx: message.mintNum,
        owned_idx: ownedIdx,
        member_idx: message.user.idx,
        nft_creator: message.walletAddress,
        sales_type: mint.sales_type,
        open_date: DateHelpers.getCurrentUTCDateTime(),
        start_date: message.startDate ? message.startDate : null,
        finish_date: message.finishDate ? message.finishDate : null,
        sales_royalty: mint.nft_royalty,
        nft_price: mint.nft_price,
        tx_id: message.txId ? message.txId : null,
        nft_status: "sales",
        total_amount: mint.item_amount,
        remain_amount: mint.item_amount,
        use_flag: 1,
        set_date: DateHelpers.getCurrentUTCDateTime(),
        created_at: DateHelpers.getCurrentUCTimestamp()
      })
    } catch (err) {
      throw err
    }
  }

  /*
   * 데이터 카운트
   */
  static async countListingData() {
    return await app().config.mysql.bluebay.nft_listing_data.count({
      where: {
        use_flag: { [Op.ne]: 9 }
      }
    })
  }

  /*
   * 가져오기 for listing pagination
   */
  static async getListForPagination(offset: number, limit: number) {
    try {
      const returned = await app().config.mysql.bluebay.nft_listing_data.findAll({
        where: {
          use_flag: 1 //{ [Op.ne]: 9 },
          //sales_type: "auction" //["auction", "basic"]
        },
        order: [["set_date", "DESC"]],
        offset: offset,
        limit: limit,
        raw: true
      })

      return await ParamCheckHelper.doCheckDbDataValues(returned, {}, false, false)
      // select  * from nft_listing_data nld where use_flag != 9 LIMIT 24,6;
    } catch (err) {
      throw err
    }
  }

  /**
   * 최신 아이템 가져오기
   * @param itemNum 가져올 아이템 수
   */
  static async getRecentItems(itemNum: number) {
    try {
      const result = await app().config.mysql.bluebay.nft_listing_data.findAll({
        where: {
          use_flag: { [Op.ne]: 9 },
          nft_status: ["listing", "soldout"]
        },
        order: [["set_date", "DESC"]],
        limit: itemNum,
        raw: true
      })
      return await ParamCheckHelper.doCheckDbDataValues(result, {}, false, false)
    } catch (err) {
      throw err
    }
  }

  /**
   * NFT 상태값 업데이트하기
   *
   * @param idx
   * @param params
   */
  static async doUpdateStatusAndFlagByIdx(idx: number, status: string, flag: number, transaction?) {
    try {
      const result = await app().config.mysql.bluebay.nft_listing_data.update(
        {
          nft_status: status,
          use_flag: flag
        },
        { where: { idx: idx }, transaction: transaction }
      )
      return await ParamCheckHelper.doCheckDbDataValues(result, {}, false, false)
    } catch (err) {
      throw err
    }
  }

  static async doDecreaseRemainByIdx(idx: number, amount: number) {
    try {
      const result = await app().config.mysql.bluebay.nft_listing_data.increment({ remain_amount: amount }, { where: { idx: idx } })
      return await ParamCheckHelper.doCheckDbDataValues(result, {}, false, false)
    } catch (err) {
      throw err
    }
  }

  static async doUpdateByTxId(reqBody) {
    try {
      const result = await app().config.mysql.bluebay.nft_listing_data.update(
        { item_idx: reqBody.tokenIdx, block_hash: reqBody.blockHash, block_number: reqBody.blockNumber },
        {
          where: {
            tx_id: reqBody.txId
          }
        }
      )
      return await ParamCheckHelper.doCheckDbDataValues(result, {}, false, false)
    } catch (err) {
      throw err
    }
  }

  /**
   * idx 조건절에 있는부분 삭제하기
   * @param idx
   */
  static async doDeleteByIdx(idx: number) {
    return await app().config.mysql.bluebay.nft_listing_data.destroy({ where: { idx: idx } })
  }

  /**
   * idx 조건절 정보 1개 가져오기
   * @param idx
   */
  static async getOneInfoByIdx(idx: number) {
    try {
      const result = await app().config.mysql.bluebay.nft_listing_data.findOne({ where: { idx: idx }, raw: true })
      return await ParamCheckHelper.doCheckDbDataValues(result, {}, false, true)
    } catch (err) {
      throw err
    }
  }

  /**
   * idx 로 전체정보 가져오기
   * @param idx
   */
  static async getAllInfoByIdx(idx: number) {
    try {
      const result = await app().config.mysql.bluebay.nft_listing_data.findAll({
        where: {
          idx: idx,
          use_flag: 1
        },
        raw: true
      })
      return await ParamCheckHelper.doCheckDbDataValues(result, {}, true, true)
    } catch (err) {
      throw err
    }
  }

  /**
   *"idx", "member_idx", "mint_idx", "sales_type", "open_date", "start_date", "finish_date", "nft_price", "tx_id"
   */
  static async getOneInfoByMintIdx(mintIdx: number) {
    const result = await app().config.mysql.bluebay.nft_listing_data.findOne({
      attributes: ["idx", "member_idx", "mint_idx", "sales_type", "open_date", "start_date", "finish_date", "nft_price", "tx_id"],
      where: {
        mint_idx: mintIdx,
        nft_status: { [Op.notIn]: ["create", "delist", "deleted"] }
      },
      raw: true
    })
    return result
  }

  /**
   * gets by mint_idx where use_flag = 1 (= "sales, soldout, display", 정상공개)
   *"idx", "member_idx", "mint_idx", "sales_type", "open_date", "start_date", "finish_date", "nft_price", "tx_id"
   * @param mintIdx
   * @returns
   */
  static async getOneInfoByMintIdxFlag(mintIdx: number) {
    const result = await app().config.mysql.bluebay.nft_listing_data.findOne({
      attributes: ["idx", "member_idx", "mint_idx", "sales_type", "open_date", "start_date", "finish_date", "nft_price", "tx_id"],
      where: {
        mint_idx: mintIdx,
        use_flag: 1
      },
      raw: true
    })
    return result
  }

  /**
   * gets by mint_idxes where use_flag = 1 (= "sales, soldout, display", 정상공개)
   *"idx", "member_idx", "mint_idx", "sales_type", "open_date", "start_date", "finish_date", "nft_price", "tx_id"
   * @param mintIdx
   * @returns
   */
  static async getInfoByMintIdxesFlag(mintIdxes: []) {
    const result = await app().config.mysql.bluebay.nft_listing_data.findAll({
      attributes: ["idx", "member_idx", "mint_idx", "sales_type", "open_date", "start_date", "finish_date", "nft_price", "tx_id"],
      where: {
        mint_idx: mintIdxes,
        use_flag: 1
      },
      raw: true
    })
    return await ParamCheckHelper.doCheckDbDataValues(result, [], false, true)
  }
}
