import { app } from "../app"
import { LoginDto, NewAccount, Email } from "../interfaces/AccountInterface"
import { DbNotFoundException } from "../exceptions/DbNotFoundException"
import { Op } from "sequelize"
import { ParamCheckHelper } from "../helpers/ParamCheckHelper"
import { Response } from "../helpers/ResponseHelper"
import { CommonHelpers } from "../helpers/CommonHelpers"
import { DateHelpers } from "../helpers/DateHelpers"
import { Redis } from "../lib/Redis"
import * as _ from "lodash"
import { InvalidLoginException } from "../exceptions/InvalidLoginException"

let md5 = require("md5")

export class MemberService {
  /**
   * 사용자 계정 상태 flag 확인
   * @param email 확인하고싶은 사용자의 이메일
   */
  static async checkAccountFlagByEmail(email: string) {
    const result = await app().config.mysql.bluebay.member.findOne({ where: { email: email }, raw: true })
    // 정보가 존재하지 않을 때 :
    if (!result) {
      // if에 lodash 로 바꾸기
      throw new DbNotFoundException("계정이 존재하지 않습니다", 1)
    }
    // 탈퇴회원일 때
    if (result.use_flag == "9") {
      throw new DbNotFoundException("계정이 비활성화 상태입니다", 2)
    }
    // 정상 사용 계정
    if (result.use_flag == "1") {
      return
    } else {
      throw new DbNotFoundException("계정 플래그를 확인해주세요", 3)
    }
  }

  ///////////////////////  CREATE ACCOUNT  ////////////////////////////
  /**
   * 사용자 계정 추가하기
   *
   * @param userInfo
   */
  static async doInsert(userInfo: LoginDto) {
    try {
      return await app().config.mysql.bluebay.member.create({
        email: userInfo.email,
        pw: md5(userInfo.pw),
        user_code: await CommonHelpers.randomUserCode(),
        set_date: DateHelpers.getCurrentUTCDateTime(),
        created_at: DateHelpers.getCurrentUCTimestamp()
      })
    } catch (err) {
      throw new DbNotFoundException("존재하는 계정입니다")
    }
  }

  ///////////////////////  RESET PASSWORD  ////////////////////////////
  /**
   * email로 비밀번호 변경
   * @param loginDto
   */
  static async doResetPwByEmail(dto: LoginDto) {
    try {
      await this.checkAccountFlagByEmail(dto.email)

      const prevPW = await app().config.mysql.bluebay.member.findOne({ attributes: ["pw"], where: { email: dto.email } })
      const newPW = await md5(dto.pw)
      if (prevPW.dataValues.pw == newPW) {
        throw new DbNotFoundException("기존에 사용한 비밀번호와 동일합니다. 다른 번호를 입력해 주세요")
      }

      return await app().config.mysql.bluebay.member.update({ pw: newPW, login_fail_cnt: 0 }, { where: { email: dto.email } })
    } catch (err) {
      throw err
    }
  }

  ///////////////////////  LOGIN  ////////////////////////////
  /**
   * email로 사용자 정보 가져오기
   * @param loginDto
   */
  static async doLoginByEmail(loginDto: LoginDto) {
    // return await app().config.mysql.bluebay.member.findOne({where: {email: email}})
    const dbUserInfo = await app().config.mysql.bluebay.member.findOne({
      where: { email: loginDto.email }
    })

    // 정보가 존재하지 않을 때 :
    if (!dbUserInfo) {
      // if에 lodash 로 바꾸기
      throw new DbNotFoundException("아이디가 존재하지 않습니다", 1)
    }
    // TODO 탈퇴회원일 때
    if (dbUserInfo.dataValues.use_flag == "9") {
      throw new DbNotFoundException("계정이 비활성화 상태입니다", 2)
    }
    // 실패 카운트가 5/5 면 Rock
    if (dbUserInfo.dataValues.login_fail_cnt >= 5) {
      throw new DbNotFoundException(`로그인 시도 횟수 초과입니다`, 3)
    }
    // password 가 일치 하지 않음
    if (md5(loginDto.pw) != dbUserInfo.dataValues.pw) {
      await app().config.mysql.bluebay.member.increment({ login_fail_cnt: 1 }, { where: { idx: dbUserInfo.dataValues.idx } })
      throw new InvalidLoginException(`비밀번호를 확인해주세요`, 4, (dbUserInfo.dataValues.login_fail_cnt += 1))
    }

    // 일치할 경우 :
    // login_fail_cnt 초기화 && lst_login_at 업데이트 // Math.floor(new Date().getTime() / 1000)
    await app().config.mysql.bluebay.member.update({ login_fail_cnt: 0, last_login_at: DateHelpers.getCurrentUCTimestamp() }, { where: { idx: dbUserInfo.dataValues.idx } })
    // lst_login_at 업데이트
    // await app().config.mysql.bluebay.member.update({ last_login_at: Math.floor(new Date().getTime() / 1000) }, { where: { idx: dbUserInfo.dataValues.idx } })
    // 리턴
    return dbUserInfo.dataValues
  }

  ///////////////////////  TOKEN  ////////////////////////////
  /**
   * Refresh_token 업데이트하기
   *
   * @param idx
   * @param params
   */

  static async doUpdateTokenByIdx(idx: number, params) {
    return await app()
      .config.mysql.bluebay.member.update({ refresh_token: params }, { where: { idx: idx } })
      .catch((e) => {
        throw new DbNotFoundException("", e, null, 400)
      })
  }

  /**
   * idx 조건절 정보 1개 가져오기
   * @param idx
   */
  static async getOneInfoByIdx(idx: number) {
    try {
      const cache = Redis.getInstance({ host: "127.0.0.1", port: 6379, select: 0, password: "2848nre0gfewryt72zfd4ttc" })
      const cacheData = await cache.get("member_info_" + idx)
      let payload
      if (!_.isNil(cacheData)) {
        console.log("=============cache==============")
        payload = JSON.parse(cacheData)
      } else {
        console.log("==============db=============")
        //payload = await OpNoticeService.getAllList(page, limit)
        payload = await app().config.mysql.bluebay.member.findOne({ where: { idx: idx } })
        await cache.set("member_info_" + idx, JSON.stringify(payload.dataValues))
      }

      //const result = await app().config.mysql.bluebay.member.findOne({ where: { idx: idx } })
      // if (result == null) {
      //   throw Error
      // }
      return payload
    } catch (err) {
      throw new DbNotFoundException("DB not found")
    }
  }

  ///////////////////////  GET & UPDATE FOLLOWING FOLLOWERS  ////////////////////////////
  static async getFollowDetails(list) {
    try {
      const result = await app().config.mysql.bluebay.member.findAll({
        attributes: ["idx", "account", "nick_name", "profile_img"],
        where: { idx: list }
      })
      // if (result.length == 0) {
      //   throw Error
      // }
      return result
    } catch (err) {
      console.log("--------------")
      throw new DbNotFoundException("DB not Found")
    }
  }

  static async doUpdateFollowers(idx, value) {
    try {
      const cache = Redis.getInstance({ host: "127.0.0.1", port: 6379, select: 0, password: "2848nre0gfewryt72zfd4ttc" })
      await cache.del("member_info_" + idx)

      await app().config.mysql.bluebay.member.increment({ followers: value }, { where: { idx: idx } })
    } catch (err) {
      throw new DbNotFoundException("no one to unfollow")
    }
  }

  static async doUpdateFollowings(idx, value) {
    try {
      await app().config.mysql.bluebay.member.increment({ following: value }, { where: { idx: idx } })
    } catch (err) {
      throw new DbNotFoundException("no one to unfollow")
    }
  }

  ///////////////////////  GET & UPDATE MEMBER PROFILE IMAGE  ////////////////////////////
  /**
   * idx로 profile_img얻기
   * @param idx
   * @returns
   */
  static async getUrlByIdx(idx) {
    const result = await app().config.mysql.bluebay.member.findOne({
      attributes: ["profile_img"],
      where: { idx: idx }
    })
    return result.dataValues.profile_img
  }

  static async doUpdateProfileByIdx(idx, url) {
    return await app().config.mysql.bluebay.member.update({ profile_img: url }, { where: { idx: idx } })
  }

  static async doDefaultProfileByIdx(idx) {
    return await app().config.mysql.bluebay.member.update({ profile_img: "/live/img/ico_default.png" }, { where: { idx: idx } })
  }

  /////////////////////////////////////////////////////////////////////////////////
  /**
   * idx들의 배열로 튜플을 얻을 수 있음.
   * @param idx
   */
  static async getByIdxes(idx: number[]) {
    return await app().config.mysql.bluebay.member.findAll({
      where: { idx: { [Op.in]: idx } },
      raw: true
    })
  }
  /**
   * idx 배열로 간단한 유저의 정보를 얻을 수 있음."idx", "email", "nick_name", "profile_img", "followers", "following"
   * @param idx
   * @returns
   */
  static async getProfileThingsByIdx(idx: any) {
    return await app().config.mysql.bluebay.member.findOne({
      attributes: ["idx", "email", "nick_name", "profile_img", "followers", "following"],
      where: { idx: idx }, //{ idx: { [Op.in]: idx } },
      raw: true
    })
  }
  /**
   * idx 또는 idx들의 배열로 튜플을 얻을 수 있음.
   * @param idx
   */
  static async getUserProfileByIdx(idx: number) {
    try {
      const result = await app().config.mysql.bluebay.member.findOne({
        attributes: [
          "idx",
          "account",
          "email",
          "nick_name",
          "profile_img",
          "profile_comment",
          "web_link",
          "insta_link",
          "twitter_link",
          "youtube_link",
          "followers",
          "following",
          "del_date",
          "created_at"
        ],
        where: { idx: idx }
      })
      return result.dataValues
    } catch (err) {
      throw new DbNotFoundException(err)
    }
  }

  /**
   * idx 로 Idx, Nickname, Profile Image만 받기
   * @param idx
   */
  static async getSimpleInfoByIdx(idx: number) {
    const result = await app().config.mysql.bluebay.member.findOne({
      attributes: ["idx", "nick_name", "profile_img"],
      where: { idx: idx },
      raw: true
    })
    return result
  }
  /**
   * idx 로 Idx, Nickname, Profile Image만 받기
   * @param idxes
   */
  static async getSimpleInfoByIdxes(idxes: []) {
    const result = await app().config.mysql.bluebay.member.findAll({
      attributes: ["idx", "nick_name", "profile_img"],
      where: { idx: idxes },
      raw: true
    })
    return result
  }

  /**
   * 탈퇴회원 설정
   * @param idx
   * @param params
   */
  static async withdrawalByIdx(idx: number) {
    const dbData = await app().config.mysql.bluebay.member.update({ use_flag: "9", del_date: DateHelpers.getCurrentUTCDateTime() }, { where: { idx: idx } })
    if (dbData[0] == 0) {
      throw new DbNotFoundException("없거나 이미 처리된 계정입니다", 400)
    }
    return
  }

  /**
   *
   * @param idx
   * @param params
   */
  static async doUpdateByIdx(idx: number, params) {
    try {
      const dbData = await app().config.mysql.bluebay.member.findOne({
        where: { idx: idx }
      })
      return dbData.updateAttributes({
        userName: params.userName ? params.userName : null,
        profile_comment: params.profile_comment ? params.profile_comment : null,
        web_link: params.website ? params.website : null,
        twitter_link: params.twitter ? params.twitter : null,
        insta_link: params.instagram ? params.instagram : null,
        youtube_link: params.youtube ? params.youtube : null
      })
    } catch (err) {
      throw err
    }
  }

  /**
   * idx 조건절에 있는부분 삭제하기
   * @param idx
   */
  static async doDeleteByIdx(idx: number) {
    return await app().config.mysql.bluebay.member.destroy({
      where: { idx: idx }
    })
  }
}
