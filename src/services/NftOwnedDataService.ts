import { raw } from "express"
import { Op } from "sequelize"
import { app } from "../app"
import { DateHelpers } from "../helpers/DateHelpers"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"

export class NftOwnedDataService {
  /**
   * 발행하여 소유 발생(고정가 온체인, 경매리스팅)
   * @param message
   */
  static async doInsertOwnedByMinting(message: any, totalAmount) {
    try {
      const result = await app().config.mysql.bluebay.nft_owned_data.create({
        mint_idx: message.mintNum,
        member_idx: message.user.idx,
        nft_owner: message.walletAddress,
        total_amount: totalAmount,
        remain_amount: totalAmount,
        tx_id: message.txId ? message.txId : null,
        token_idx: message.tokenIdx ? message.tokenIdx : null,
        block_hash: message.blockHash ? message.blockHash : null,
        block_number: message.blockNumber ? message.blockNumber : null,
        nft_status: "owned",
        set_date: DateHelpers.getCurrentUTCDateTime(),
        use_flag: 1
      })
      // console.log("owned data is inserted : ", result.dataValues)
      return await ParamCheckHelper.doCheckDbDataValues(result.dataValues, {}, false, false)
    } catch (err) {
      throw err
    }
  }
  /**
   * 구매하여 소유 발생 (고정가, 경매 둘 다 온체인)
   * @param param
   */
  static async doInsertOwnedByPurchase(param, purchaseAmount) {
    try {
      const result = await app().config.mysql.bluebay.nft_owned_data.create({
        listing_idx: param.listingIdx,
        mint_idx: param.mintNum,
        member_idx: param.user.idx,
        nft_owner: param.walletAddress,
        tx_id: param.txId ? param.txId : null,
        token_idx: param.tokenIdx ? param.tokenIdx : null,
        block_hash: param.blockHash ? param.blockHash : null,
        block_number: param.blockNumber ? param.blockNumber : null,
        total_amount: purchaseAmount,
        remain_amount: purchaseAmount,
        contract_usd: param.contractUsd,
        contract_eth: param.contractEth,
        nft_status: "owned",
        set_date: DateHelpers.getCurrentUTCDateTime(),
        use_flag: 1
      })
      // console.log("owned data is inserted : ", result.dataValues)
      return await ParamCheckHelper.doCheckDbDataValues(result.dataValues, {}, false, false)
    } catch (err) {
      throw err
    }
  }
  /**
   * NFT 상태값 업데이트하기
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
  /**
   * remain amount 수량 -1 감소
   * @param idx
   * @param amount
   * @returns
   */
  static async doDecreaseRemainByIdx(idx: number, amount: number) {
    try {
      const result = await app().config.mysql.bluebay.nft_owned_data.increment({ remain_amount: amount }, { where: { idx: idx } })
      return await ParamCheckHelper.doCheckDbDataValues(result, {}, false, false)
    } catch (err) {
      throw err
    }
  }

  /**
   * 업데이트하기
   *
   * @param idx
   * @param params
   */
  static async doUpdateByIdx(idx: number, params) {
    const dbData = await app().config.mysql.bluebay.nft_owned_data.findOne({ where: { idx: idx } })
    return dbData.updateAttributes({ ip: params.ip })
  }

  static async doUpdateByTxId(reqBody) {
    try {
      const result = await app().config.mysql.bluebay.nft_owned_data.update(
        { token_idx: reqBody.tokenIdx, block_hash: reqBody.blockHash, block_number: reqBody.blockNumber },
        {
          where: { tx_id: reqBody.txId }
        }
      )
      return await ParamCheckHelper.doCheckDbDataValues(result, {}, false, false)
    } catch (err) {
      throw err
    }
  }

  static async doUpdateBurnInfoByIdx(idx, burnTxId?, burnBlockHash?, burnBlockNum?, transaction?) {
    try {
      const result = await app().config.mysql.bluebay.nft_owned_data.update(
        {
          burn_tx_id: burnTxId ? burnTxId : null,
          burn_block_hash: burnBlockHash ? burnBlockHash : null,
          burn_block_number: burnBlockNum ? burnBlockNum : null
        },
        { where: { idx: idx }, transaction }
      )

      return await ParamCheckHelper.doCheckDbDataValues(result, {}, false, true)
    } catch (err) {
      throw err
    }
  }

  /**
   * idx 조건절에 있는부분 삭제하기
   * @param idx
   */
  static async doDeleteByIdx(idx: number) {
    return await app().config.mysql.bluebay.nft_owned_data.destroy({ where: { idx: idx } })
  }

  /**
   * idx 조건절 정보 1개 가져오기
   * @param idx
   */
  static async getOneInfoByIdx(idx: number) {
    return await app().config.mysql.bluebay.nft_owned_data.findOne({ where: { idx: idx } })
  }

  /**
   * myPage를 위한 비공개과 공개, onwed 와 soldout 포함 data
   * @param idx
   */
  static async getMyInfoByMemIdx(idx: number) {
    try {
      const result = await app().config.mysql.bluebay.nft_owned_data.findAll({
        where: {
          member_idx: idx,
          use_flag: [1, 8]
        },
        raw: true
      })
      return await ParamCheckHelper.doCheckDbDataValues(result, {}, false, true)
    } catch (err) {
      throw err
    }
  }

  /**
   * idx 조건절 정보 다 가져오기 use_flag = 1 정상값들만
   * @param idx
   */
  static async getAllInfoByMemIdx(idx: number) {
    const result = await app().config.mysql.bluebay.nft_owned_data.findAll({
      where: {
        member_idx: idx,
        use_flag: 1
      },
      raw: true
    })
    return await ParamCheckHelper.doCheckDbDataValues(result, {}, true, true)
  }

  /**
   * 정상값 (use_flag = 1) 중에서 소유한 것만 (nft_status = 'owned')
   * @param idx
   * @returns
   */
  static async getAllOnlyOwnedByMemIdx(idx: number) {
    try {
      const result = await app().config.mysql.bluebay.nft_owned_data.findAll({
        where: {
          member_idx: idx,
          use_flag: 1,
          nft_status: "owned"
        },
        raw: true
      })
      return await ParamCheckHelper.doCheckDbDataValues(result, {}, false, false)
    } catch (err) {
      throw err
    }
  }
}
