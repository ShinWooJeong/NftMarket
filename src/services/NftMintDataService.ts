import { orderBy } from "lodash"
import { Op } from "sequelize"
import { idText } from "typescript"
import { app } from "../app"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"

export class NftMintDataService {
  /**
   * 입력하기
   * @param message
   */
  static async doInsert(data: any) {
    try {
      let event_type = ""
      if (data.event_type == "ddp-01" || data.event_type == 1) {
        event_type = "event_ddp_01"
      } else {
        event_type = null
      }
      await app().config.mysql.bluebay.nft_mint_data.create({
        mint_type: "user",
        member_idx: data.member_idx, //userInfo.idx, //*
        nft_creator: data.nft_creator, //member db에서 가져와야함(지갑!) // 없으면 지값이 없다고 에러처리 *
        nft_type: data.nft_type, //files["content"][0].mimetype, //*
        nft_royalty: data.nft_royalty, //req.royalty, //#
        nft_category: data.nft_category, //req.category, //#
        nft_img: data.nft_img, //app().config.aws.cloudfront_url + '/thumbs/' + fileNames["thumbNail"], // 아 이게 썸네일인듯! *
        nft_title: data.nft_title, //req.title, //#
        nft_desc: data.nft_desc, //req.desc, //#
        nft_price: data.nft_price, //req.price, //#
        metadata_url: data.metadata_url, //"https://ipfs.io/ipfs/" + metadataURL, //*
        ipfs_url: data.ipfs_url, //fileCID, //*
        nft_url: data.nft_url, //app().config.aws.cloudfront_url + '/thumbs/' + fileNames["content"], // 이게 content
        item_amount: data.item_amount, //req.amount, //# 아마 # of editions to issue 인듯..?
        sales_type: data.sales_type, //req.saleType, //default value 있음 #
        nft_tag: data.nft_tag, //req.tag, //#
        currency: data.currency,
        event_type: event_type,
        set_date: data.set_date, //util.timestamp, // 이거 아니면 helper에 있는 date 기능
        created_at: data.created_at //util.utctimestamp,
      })
    } catch (err) {
      if (err) throw new Error(err)
    }
  }

  /**
   * marketPlace Pagination
   *
   */
  static async getList(reqPage, perPage, category, sale_type, event_type = "") {
    let where = {
      use_flag: 1, //{ [Op.ne]: 9 },
      nft_status: "listing",
      nft_category: category,
      sales_type: Array.isArray(sale_type)
        ? {
            [Op.in]: sale_type
          }
        : sale_type //"auction" //["auction", "basic"],
    }
    if (event_type.length > 0) where["event_type"] = event_type

    const result = await app().config.mysql.bluebay.nft_mint_data.findAll({
      where: where,
      order: [["set_date", "DESC"]],
      offset: reqPage,
      limit: perPage,
      raw: true
    })
    return await ParamCheckHelper.doCheckDbDataValues(result, [], false, true)
  }

  /**
   * 최신 아이템 가져오기
   * @param itemNum 가져올 아이템 수
   */
  static async getRecentItems(itemNum: number) {
    const result = await app().config.mysql.bluebay.nft_mint_data.findAll({
      where: {
        use_flag: { [Op.ne]: 9 },
        nft_status: ["listing", "soldout"]
      },
      order: [["set_date", "DESC"]],
      limit: itemNum,
      raw: true
    })
    return result
  }

  // view_hot 높은 순 가져오기
  static async getHighViewItems(itemNum: number) {
    const result = await app().config.mysql.bluebay.nft_mint_data.findAll({
      attributes: ["idx", "member_idx", "nft_img", "nft_title", "nft_price", "sales_type", "nft_status", "favorite_cnt"],
      where: {
        use_flag: 1,
        nft_status: "listing"
      },
      order: [["view_hit", "DESC"]],
      limit: itemNum,
      raw: true
    })
    return await ParamCheckHelper.doCheckDbDataValues(result, {}, false, true)
  }

  /**
   * 업데이트하기
   *
   * @param idx
   * @param params
   */
  static async doUpdateByIdx(idx: number, params) {
    const dbData = await app().config.mysql.bluebay.nft_mint_data.findOne({ where: { idx: idx } })
    return dbData.updateAttributes({ ip: params.ip })
  }

  /**
   * nft_status && use_flag 업데이트하기
   * @param idx
   * @param status
   * @param flagNum
   * @returns
   */
  static async doUpdateStatusFlagByIdx(idx: number, status, flagNum, transition?) {
    try {
      const dbData = await app().config.mysql.bluebay.nft_mint_data.findOne({ where: { idx: idx }, transaction: transition })
      return dbData.updateAttributes({ use_flag: flagNum, nft_status: status })
    } catch (err) {
      throw err
    }
  }

  /**
   * idx 조건절에 있는부분 삭제하기
   * @param idx
   */
  static async doDeleteByIdx(idx: number) {
    return await app().config.mysql.bluebay.nft_mint_data.destroy({ where: { idx: idx } })
  }

  /**
   * idx 조건절 정보 1개 가져오기
   * @param idx
   */
  static async getOneInfoByIdx(idx: number) {
    const result = await app().config.mysql.bluebay.nft_mint_data.findOne({ where: { idx: idx } })
    return await ParamCheckHelper.doCheckDbDataValues(result?.dataValues, "", false, true)
  }

  /**
   * idx들의 배열로 썸네일용 튜플을 얻을 수 있음.
   * "idx", "member_idx", "nft_royalty", "nft_img", "nft_title", "nft_desc", "nft_price", "currency", "nft_status", "use_flag", "admin_chk"
   * @param idx
   */
  static async getByIdxes(idx: number[]) {
    const result = await app().config.mysql.bluebay.nft_mint_data.findAll({
      attributes: ["idx", "member_idx", "nft_royalty", "nft_img", "nft_title", "nft_desc", "nft_price", "currency", "nft_status", "use_flag", "admin_chk", "sales_type"],
      where: { idx: { [Op.in]: idx } },
      raw: true
    })
    return await ParamCheckHelper.doCheckParam(result, "array", [], false, false)
  }

  /**
   * idx 조건절 정보 전체 가져오기
   * @param idx
   */
  static async getAllInfoByMemIdx(idx: number) {
    const result = await app().config.mysql.bluebay.nft_mint_data.findAll({
      //// 필요한 만큼 콜라서 가져오자..!
      where: {
        member_idx: idx,
        use_flag: { [Op.ne]: 9 }
      },
      raw: true
    })

    return await ParamCheckHelper.doCheckDbDataValues(result, {}, false, false) //result
  }

  /**
   * detail page mint data
   * @param idx mint idx
   * @returns
   */
  static async getOneForDetailPage(idx) {
    try {
      const result = await app().config.mysql.bluebay.nft_mint_data.findOne({
        attributes: [
          "idx",
          "member_idx",
          "nft_type",
          "nft_img",
          "nft_title",
          "nft_desc",
          "nft_price",
          "metadata_url",
          "ipfs_url",
          "nft_url",
          "item_amount",
          "sales_type",
          "view_hit",
          "currency",
          "nft_tag",
          "favorite_cnt",
          "background",
          "use_flag",
          "nft_status"
        ],
        where: {
          idx: idx
          //use_flag: { [Op.in]: [1] } // use_flag 9 삭제, 2 비공개 제외하기
          //nft_status: { [Op.notIn]: ["create", "delist", "deleted"] }
        }
      })
      return await ParamCheckHelper.doCheckDbDataValues(result.dataValues, {}, false, false)
    } catch (err) {
      throw err
    }
  }

  /**
   * 해당 유저의 minted Items // 삭제처리된 데이터만 뺴고 제공 // 리스팅 되고있는 항목도 제공
   * @param idx user의 idx
   * @returns
   */
  static async getAllforCreatedByMemIdx(idx) {
    const result = await app().config.mysql.bluebay.nft_mint_data.findAll({
      attributes: ["idx", "member_idx", "nft_type", "nft_img", "nft_title", "nft_desc", "nft_price", "nft_status", "admin_chk_at", "use_flag", "sales_type"],
      where: { member_idx: idx, use_flag: { [Op.or]: [1, 8] } },
      order: [
        ["use_flag", "ASC"],
        ["created_at", "DESC"]
      ],
      raw: true
    })
    return await ParamCheckHelper.doCheckDbDataValues(result, {}, true, true)
  }
}
