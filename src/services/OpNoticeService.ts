import { app } from "../app"

export class OpNoticeService {
  /**
   * 게시판 리스트 제공용
   * @param p
   * @param limit
   */
  static async getAllList(p: any, limit: number) {
    const offset = (p - 1) * limit
    const where = {
      attributes: ["idx", "title_ko", "title_en", "created_at"],
      where: { use_flag: 1 },
      order: [["priority", "ASC"]],
      offset: offset,
      limit: limit,
      raw: true
    }
    return await app().config.mysql.bluebay.op_notice.findAndCountAll(where)
  }

  /**
   * 개시판 정보 1개 제공하기.
   * @param idx
   */
  static async getOneByInfo(idx: number) {
    return await app().config.mysql.bluebay.op_notice.findOne({ where: { idx: idx } })
  }

  static async increaseViewHit(idx: number) {
    return await app().config.mysql.bluebay.op_notice.increment({ view_hit: 1 }, { where: { idx: idx } })
  }
}
