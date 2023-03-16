import { ConnectionMysql, RdbModel } from "../../../modules/ConnectionMysql"

import { schema_cron_data } from "./cron_data"
import { schema_dsp } from "./dsp"
import { schema_dsp_transfer } from "./dsp_transfer"
import { schema_event_participated } from "./event_participated"
import { schema_event_nft } from "./event_nft"
import { schema_exhibition } from "./exhibition"
import { schema_exhibition_nft } from "./exhibition_nft"
import { schema_file_upload } from "./file_upload"

import { schema_member } from "./member"
import { schema_member_login_history } from "./member_login_history"
import { schema_member_favorite } from "./member_favorite"
import { schema_member_follow } from "./member_follow"
import { schema_member_signup_approve_code } from "./member_signup_approve_code"

import { schema_nft_auction_data } from "./nft_auction_data"
import { schema_nft_category } from "./nft_category"
import { schema_nft_history } from "./nft_history"
import { schema_nft_listing_data } from "./nft_listing_data"
import { schema_nft_mint_data } from "./nft_mint_data"
import { schema_nft_owned_data } from "./nft_owned_data"
import { schema_nft_offer_data } from "./nft_offer_data"

import { schema_op_banner } from "./op_banner"
import { schema_op_email_template } from "./op_email_template"
import { schema_op_faq } from "./op_faq"
import { schema_op_faq_category } from "./op_faq_category"
import { schema_op_main } from "./op_main"
import { schema_op_main_artist } from "./op_main_artist"
import { schema_op_notice } from "./op_notice"
import { schema_op_popup } from "./op_popup"
import { schema_op_privacy_policy } from "./op_privacy_policy"
import { schema_op_terms_and_condition } from "./op_terms_and_condition"
import { schema_op_sms_template } from "./op_sms_template"
import { schema_op_server_setting } from "./op_server_setting"

export class MysqlPrimaryDB extends ConnectionMysql {
  cron_data = new RdbModel(schema_cron_data)
  dsp = new RdbModel(schema_dsp)
  dsp_transfer = new RdbModel(schema_dsp_transfer)
  event_nft = new RdbModel(schema_event_nft)
  event_participated = new RdbModel(schema_event_participated)
  exhibition = new RdbModel(schema_exhibition)
  exhibition_nft = new RdbModel(schema_exhibition_nft)
  file_upload = new RdbModel(schema_file_upload)

  member = new RdbModel(schema_member)
  member_login_history = new RdbModel(schema_member_login_history)
  member_favorite = new RdbModel(schema_member_favorite)
  member_follow = new RdbModel(schema_member_follow)
  member_signup_approve_code = new RdbModel(schema_member_signup_approve_code)

  nft_auction_data = new RdbModel(schema_nft_auction_data)
  nft_category = new RdbModel(schema_nft_category)
  nft_history = new RdbModel(schema_nft_history)
  nft_listing_data = new RdbModel(schema_nft_listing_data)
  nft_mint_data = new RdbModel(schema_nft_mint_data)
  nft_owned_data = new RdbModel(schema_nft_owned_data)
  nft_offer_data = new RdbModel(schema_nft_offer_data)

  op_banner = new RdbModel(schema_op_banner)
  op_email_template = new RdbModel(schema_op_email_template)
  op_faq = new RdbModel(schema_op_faq)
  op_faq_category = new RdbModel(schema_op_faq_category)
  op_main = new RdbModel(schema_op_main)
  op_main_artist = new RdbModel(schema_op_main_artist)
  op_notice = new RdbModel(schema_op_notice)
  op_popup = new RdbModel(schema_op_popup)
  op_privacy_policy = new RdbModel(schema_op_privacy_policy)
  op_terms_and_condition = new RdbModel(schema_op_terms_and_condition)
  op_sms_template = new RdbModel(schema_op_sms_template)
  op_server_setting = new RdbModel(schema_op_server_setting)

  async preSync() {
    await this.initModels(
      this.cron_data,
      this.dsp,
      this.dsp_transfer,
      this.event_nft,
      this.event_participated,
      this.exhibition,
      this.exhibition_nft,
      this.file_upload,
      this.member,
      this.member_login_history,
      this.member_favorite,
      this.member_follow,
      this.member_signup_approve_code,
      this.nft_auction_data,
      this.nft_category,
      this.nft_history,
      this.nft_listing_data,
      this.nft_mint_data,
      this.nft_owned_data,
      this.nft_offer_data,
      this.op_banner,
      this.op_email_template,
      this.op_faq,
      this.op_faq_category,
      this.op_main,
      this.op_main_artist,
      this.op_notice,
      this.op_popup,
      this.op_privacy_policy,
      this.op_terms_and_condition,
      this.op_sms_template,
      this.op_server_setting
    )
  }

  async postSync() {}
}
