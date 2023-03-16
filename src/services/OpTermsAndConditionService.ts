import { app } from "../app"

export class OpTermsAndConditionsService {
  /**
   * 서비스 이용약관 제공하기.
   * @param idx
   */
  static async getOneByIdx(idx: number) {
    return await app().config.mysql.bluebay.op_terms_and_condition.findOne({ where: { idx: idx }, raw: true })
  }
}
