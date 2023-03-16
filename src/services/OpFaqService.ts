import { app } from "../app"

export class OpFaqService {
  static async getAllList(page: number, limit: number, categId) {
    const offset = (page - 1) * limit
    const options = {
      attributes: ["idx", "title_ko", "title_en", "created_at"],
      where: { use_flag: 1, category_id: categId },
      order: [["created_at", "DESC"]],
      offset: offset,
      limit: limit,
      raw: true
    }
    return await app().config.mysql.bluebay.op_faq.findAndCountAll(options)
  }

  static async getDetail(idx: number) {
    const options = {
      attributes: ["idx", "title_ko", "title_en", "content_ko", "content_en", "created_at"],
      where: { idx: idx },
      raw: true
    }
    return await app().config.mysql.bluebay.op_faq.findOne(options)
  }

  static async increaseViewHit(idx: number) {
    return await app().config.mysql.bluebay.op_faq.increment({ view_hit: 1 }, { where: { idx: idx } })
  }

  static async didHelp(bool: boolean, idx: number) {
    if (bool) {
      return await app().config.mysql.bluebay.op_faq.increment({ help_ok: 1 }, { where: { idx: idx } })
    } else {
      return await app().config.mysql.bluebay.op_faq.increment({ help_no: 1 }, { where: { idx: idx } })
    }
  }
}
