import * as moment from "moment"

export class DateHelpers {
  /**
   * 결과값 : 12132341231
   */
  public static getCurrentUCTimestamp() {
    return moment().unix()
  }

  /**
   * 결과값 : 2020-01-01 00:00:12 // KST(foramt default == locale)
   */
  public static getCurrentUTCDateTime() {
    return moment().format("YYYY-MM-DD HH:mm:ss")
  }

  public static getUTCTimestampFromDateTime(dateTime: string) {
    return moment(dateTime, ["YYYY-MM-DD HH:mm:ss"]).unix()
  }
}
