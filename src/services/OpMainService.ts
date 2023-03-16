import { Op } from "sequelize"
import { app } from "../app"

export class OpMainService {
  static async getMains() {
    const result = await app().config.mysql.bluebay.op_main.findAll({
      where: { use_flag: { [Op.ne]: 9 } },
      order: [["priority", "ASC"]],
      raw: true
    })
    return result
  }

  static async getOneByIdx(idx: number) {
    const result = await app().config.mysql.bluebay.op_main.findOne({ where: { idx: idx } })
    return result
  }
}
