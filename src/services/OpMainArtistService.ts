import { Op } from "sequelize"
import { app } from "../app"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"

export class OpMainArtistService {
  static async doInsert() {
    return
  }

  static async getMainArtist() {
    try {
      const result = await app().config.mysql.bluebay.op_main_artist.findAll({
        where: { use_flag: { [Op.ne]: 9 } },
        order: [["priority", "ASC"]],
        raw: true
      })
      return await ParamCheckHelper.doCheckDbDataValues(result, {}, false, true)
    } catch (err) {
      throw err
    }
  }
}
