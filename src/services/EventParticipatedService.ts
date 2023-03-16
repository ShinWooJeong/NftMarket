import { app } from "../app"

export class EventParticipatedService {
  /**
   * 사용자가 이벤트에 몇번 참여했는지 확인
   * @param idx
   * @param eventIdx event 테이블에 있는 확인하고픈 이벤트 idx
   */
  static async participationCountByIdx(idx: number, eventIdx: number) {
    const result = await app().config.mysql.bluebay.event_participated.count({
      where: {
        member_idx: idx,
        event_idx: eventIdx
      }
    })
    return result
  }

  static async doInsert() {
    const result = await app().config.mysql.bluebay.event_participated.create()
  }
}
