import { app } from "../app"
import { Op } from "sequelize"

export class OpBannerService {
  static async doInsert() {
    return
  }

  static async getList() {
    return await app().config.mysql.bluebay.op_banner.findAll({
      where: { use_flag: { [Op.ne]: 9 } },
      order: [["priority", "ASC"]],
      raw: true
    })
  }
}
