import { app } from "../app"

export class OpPrivacyPolicyService {
  /**
   * 개인정보 약관 제공하기.
   * @param idx
   */
  static async getOneByIdx(idx: number) {
    return await app().config.mysql.bluebay.op_privacy_policy.findOne({ where: { idx: idx }, raw: true })
  }
}
