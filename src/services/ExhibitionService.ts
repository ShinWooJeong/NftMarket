import { app } from "../app"
import { Op } from "sequelize"

export class ExhibitionService {
  static async getExhibition() {
    return await app().config.mysql.bluebay.exhibition.findAll({
      where: { use_flag: { [Op.ne]: 9 } },
      order: [["priority", "ASC"]],
      raw: true
    })
  }
}
