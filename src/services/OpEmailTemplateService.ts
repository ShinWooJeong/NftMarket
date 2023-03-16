import { app } from "../app"

export class OpEmailTemplateService {
  /**
   * 템플릿 내용1개 제공하기.
   *
   * @param key
   */
  static async getOneInfoByKey(key: string) {
    return await app().config.mysql.bluebay.op_email_template.findOne({ where: { service_key: key }, raw: true })
  }
}
