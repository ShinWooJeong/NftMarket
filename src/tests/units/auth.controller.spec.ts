jest.mock("jsonwebtoken")
import { Jwt } from "./../../lib/JsonWebToken"

////////////////////////////////////////////
let jwt = require("jsonwebtoken") //
import { InvalidTokenException } from "../../exceptions/InvalidTokenException"
import { payload } from "../../interfaces/AccountInterface"

async function issueToken(idx: number, email: string, type: string) {
  try {
    let token_type = "access"
    let expData = Math.floor(Date.now() / 1000) + 60 * 60 * 2
    let secretKey = "delio_bluebay"
    if (type === "refresh") {
      token_type = "refresh"

      expData = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 356
      secretKey = "bluebay_FIGHTING"
    }
    const payload: payload = {
      idx: idx,
      email: email,
      token_type: token_type,
      iat: Math.floor(Date.now()),
      exp: expData
    }

    const newToken = await jwt.sign(payload, secretKey)
    console.log("새로 발행된 토큰 : ", newToken)
    return newToken
  } catch (err) {
    throw new InvalidTokenException("err in issueToken")
  }
}

test("issue jwt success", async () => {
  const idx = 45
  const email = "essie@delio.io"
  const type = "access"
  const new_token = await issueToken(idx, email, type)
  console.log("issue jwt : ", new_token)
  await jwt.verify(new_token, "delio_bluebayyyyy")
})
///////////////////////////////////////////

// export class JwtService {
//   constructor(@Inject(CONFIG_OPTIONS) private readonly options: JWTModuleOptions) {}

//   sign(payload: object): string {
//     // jwt 생성을 위한 private key는 이미 jwt module 단위에서 provide 해줬음
//     return jwt.sign(payload, this.options.privateKey)
//   }

//   verify(token: string) {
//     return jwt.verify(token, this.options.privateKey)
//   }
// }

// describe("JwtService", () => {
//   let service: JwtService

//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       providers: [
//         JwtService,
//         {
//           provide: CONFIG_OPTIONS,
//           useValue: { privateKey: TEST_KEY }
//         }
//       ]
//     }).compile()

//     service = module.get<JwtService>(JwtService)
//   })

//   describe("sign", () => {
//     it("should return a signed token", () => {
//       const token = service.sign({ id: 1 }) // jsonwebtoken 패키지 로직을 테스트하는 꼴이 됨
//       console.log(token)
//     })
//   })
// })

// jest.mock("jsonwebtoken", () => {
//   return {
//     sign: jest.fn(() => "TOKEN"),
//     verify: jest.fn(() => "verify")
//   }
// })

// describe("sign", () => {
//   it("should return a signed token", () => {
//     const ID = 1
//     const token = service.sign({ id: ID })
//   })
// })
