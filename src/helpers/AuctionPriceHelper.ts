import { AuctionDataService } from "../services/AuctionDataService"
import { DateHelpers } from "./DateHelpers";

export async function auctionPrice(returning) {
  for (let i = 0; i < returning.length; i++) {
    if (returning[i].sales_type == "auction") {
      if (DateHelpers.getCurrentUCTimestamp() < Date.parse(returning[i].start_date)) {
        // auction이 시작하기전(before start_date) 일 경우, 기본제시가(nft_price)
        returning[i].auction_price = returning[i].nft_price
        continue
      } else if (DateHelpers.getCurrentUCTimestamp() > Date.parse(returning[i].finish_date)) {
        // auction이 끝났을 경우(after finish_date),경매가 있었으면 winner 'Y'가격, 없으면 제시가(nft_price)
        const bids = await AuctionDataService.getWinnterByIdxes(2, 27)
        if (bids == null) {
          returning[i].auction_price = returning[i].nft_price //null
        } else {
          returning[i].auction_price = Number(bids.dataValues.auction_eth)
        }
        continue
      } else {
        // auction이 시작했는데 아직 끝나지 않았을 경우, 경매가 있으면 최고 제시가, 없으면 기본제시가(nft_price)
        const bids = await AuctionDataService.getAllInfoByIdxes(2, 27)
        let max_price = 0
        if (bids == null) {
          returning[i].auction_price = returning[i].nft_price //null
        } else {
          bids.forEach((item, index, array) => {
            if (Number(item.dataValues.auction_eth) > max_price) {
              returning[i].auction_price = Number(item.dataValues.auction_eth)
            }
          })
        }
        continue
      }
    } else {
      continue
    }
  }
  return returning
}
