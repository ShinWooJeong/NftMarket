import * as moment from 'moment';

export class CommonHelpers {

  static async currentTimestamp() {
    const date = new Date()
    const year = date.getFullYear()
    const month = "0" + (date.getMonth() + 1)
    const day = "0" + date.getDate()
    const hour = "0" + date.getHours()
    const minute = "0" + date.getMinutes()
    const second = "0" + date.getSeconds()
    return year + "-" + month.slice(-2) + "-" + day.slice(-2) + " " + hour.slice(-2) + ":" + minute.slice(-2) + ":" + second.slice(-2)
  }

  static async utcTimestampInSeconds() {
    return Math.floor(new Date().getTime() / 1000)
  }

  static async utcTimestamp() {
    return Math.floor(new Date().getTime())
  }

  /**
   *
   */
  static async randomUserCode() {
    // 랜던 스트링 (1, I,  0 , O 문자열은 나중에 헷갈릴수 있어서 제거함.)
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXTZ"
    const stringLength = 5
    let randomstring = ""
    for (let i = 0; i < stringLength; i++) {
      const rnum = Math.floor(Math.random() * chars.length)
      randomstring += chars.substring(rnum, rnum + 1)
    }
    return randomstring
  }


}
