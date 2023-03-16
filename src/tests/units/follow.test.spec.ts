import { ParamCheckHelper } from "../../helpers/ParamCheckHelper"

// do check parameter

test("define the type of input value", () => {
  let input = 100
  expect(input).toBe(typeof Number)
})

//req.body test
test("request body", () => {})

/**
 * Story. 사용자는 타사용자의 Follow를 눌렀다
 *  Senario
 *    given: 설정없이
 *    when: 타사용자의 follow 를 누르면
 *    then: 사용자의 member table 의 following column이 count up 되고 상대방의 멤버테이블 follower 가 추가되고
 *            둘의 following/follower
 */
