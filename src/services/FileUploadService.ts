import { app } from "../app"

export class FileUploadService {

  /**
   * 입력하기
   * @param message
   */
  static async doInsert(message: any) {
  }

  /**
   * 업데이트하기
   *
   * @param idx
   * @param params
   */
  static async doUpdateByIdx(idx: number, params) {
    const dbData = await app().config.mysql.bluebay.file_upload.findOne({where: {idx: idx}})
    return dbData.updateAttributes({ip: params.ip})
  }

  /**
   * idx 조건절에 있는부분 삭제하기
   * @param idx
   */
  static async doDeleteByIdx(idx: number) {
    return await app().config.mysql.bluebay.file_upload.destroy({where: {idx: idx}})
  }

  /**
   * idx 조건절 정보 1개 가져오기
   * @param idx
   */
  static async getOneInfoByIdx(idx: number) {
    return await app().config.mysql.bluebay.file_upload.findOne({where: {idx: idx}})
  }


}
