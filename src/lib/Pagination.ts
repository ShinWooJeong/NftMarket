import { MemberService } from "../services/MemberService"
import { NftListingDataService } from "../services/NftListingDataService"
import { DateHelpers } from "../helpers/DateHelpers"
import { NftMintDataService } from "../services/NftMintDataService"
// import moment from "moment"
import * as moment from "moment-timezone"
import * as _ from "lodash"

/**
 * 경매인데 아직 오픈하면 안되는거 거르기를 포함한 페이징....
 * @param addOffset
 * @param reqPage 요청 페이지
 * @param perPage 페이지당 데이터 갯수
 * @param categ 필터 카테고리
 * @param sale_type 필터 판매타입
 * @param event_type 필터 이벤트 타입
 * @returns
 */
export async function getListingData(addOffset, reqPage, perPage, categ, sale_type, event_type = "") {
  let returning = {} as { listInfo?: any[]; mintInfo?: any[]; memberInfo?: any } //[]
  let offset = addOffset

  let saleType: any = []
  let category = []
  categ = typeof categ === "string" ? categ.split(",") : [""]
  // category check
  for (let i = 0; i < categ.length; i++) {
    switch (categ[i]) {
      case "1":
        category.push("Contests")
        break
      case "2":
        category.push("Art")
        break
      case "3":
        category.push("3D")
        break
      case "4":
        category.push("Entertainment")
        break
      case "5":
        category.push("Animation")
        break
      case "6":
        category.push("01etc Limited")
        break
      default:
        category = ["Contests", "Art", "3D", "Entertainment", "Animation", "01etc Limited"]
        break
    }
  }
  switch (sale_type) {
    case "1":
      saleType = "auction"
      break
    case "2":
      saleType = "basic"
      break
    default:
      saleType = ["auction", "basis"]
      break
  }
  category = [...new Set(category)]

  // 데이터 정제 후 버전
  // let assets = {} as { listInfo?: any[]; mintInfo?: any[]; memberInfo?: any }
  // // - 이렇게 listing 을 기준으로 pagenation 값을 호출하면, 카테고리별로 호출하기 어렵다..
  // // const listingInfo = (await NftListingDataService.getListForPagination(reqPage * perPage - perPage + offset, perPage)) as { mint_idx: number; member_idx }[]
  // // assets.listInfo = listingInfo
  // // assets.mintInfo = await NftMintDataService.getByIdxes(listingInfo.map((o) => o.mint_idx))
  // // assets.memberInfo = await MemberService.getByIdxes(listingInfo.map((o) => o.member_idx))

  // // - 그래서 이렇게 카테고리 필터를 넣기 위해 nft_mint_data를 기준으로 데이터를 불러오면,
  // // -- 상태값이 listing으로까지밖에 없어서 listing에서 8번 정상비공개인지 아닌지 모르기때문에 호출당 갯수를 채우기 위햇 재귀함수를 써야..
  // const mintInfo = await NftMintDataService.getList(reqPage * perPage - perPage + offset, perPage, category, saleType, event_type)
  // const listingInfo = await NftListingDataService.getOneInfoByMintIdxesFlag(mintInfo.map((o)=>{o.idx}))

  // return assets
 
  // 데이터 정제 전 버전
  const mintInfo = await NftMintDataService.getList(reqPage * perPage - perPage + offset, perPage, category, saleType, event_type)
  const listInfo = await NftListingDataService.getInfoByMintIdxesFlag(mintInfo.map((o) => o.idx))
  const memInfo = await MemberService.getSimpleInfoByIdxes(
    listInfo.map(l => l.member_idx).concat(mintInfo.map(m => m.member_idx)).sort()
  )

  returning.mintInfo = mintInfo
  returning.listInfo = listInfo
  returning.memberInfo = memInfo
  return returning
}
