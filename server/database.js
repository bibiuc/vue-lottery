const cfg = require('./config')
const Knex = require('knex')
const knex = Knex({
  client: 'mysql2',
  connection: cfg.database
});

const select = (filter) => {
  return filter()
    .whereNotNull('fa_wdsxh_user_wechat.mobile')
    .columns('fa_wdsxh_user_wechat.id', 'fa_wdsxh_user_wechat.nickname', 'fa_wdsxh_user_wechat.mobile', 'fa_wdsxh_user_wechat.avatar', 'fa_wdsxh_activity_apply.prize_id')
    .select()
    .from('fa_wdsxh_activity_apply')
    .leftJoin('fa_wdsxh_user_wechat', function () {
      this.on('fa_wdsxh_user_wechat.id', '=', 'fa_wdsxh_activity_apply.wechat_id')
    })
}

const getAllUsers = () => {
  return select(() => knex.where({
    activity_id: cfg.activity_id
  }))
}

const getSigninUsers = async () => {
  return select(() => knex.where({
    activity_id: cfg.activity_id,
    is_sign_in: 1
  }))
}

const getLeftUsers = () => {
  return select(() => knex.where({
    activity_id: cfg.activity_id,
    is_sign_in: 1,
    prize_id: 0
  }))
}

const getLuckyUsers = () => {
  return select(() => knex
    .where({
      activity_id: cfg.activity_id,
      is_sign_in: 1
    })
    .whereNot({
      prize_id: 0
    })
  )
}

const saveLuckyUsers = (user_ids, prize_id) => {
  return knex('fa_wdsxh_activity_apply')
    .where({
      activity_id: cfg.activity_id,
      is_sign_in: 1,
      prize_id: 0
    })
    .whereIn('wechat_id', user_ids)
    .update({
      prize_id
    })
}

module.exports = {
  knex,
  getAllUsers,
  getSigninUsers,
  getLuckyUsers,
  getLeftUsers,
  saveLuckyUsers
}