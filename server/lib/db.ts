import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import {ActivityPrizeTable, ActivityUserTable, MemberTable} from './schema'
import {and, eq, gt, inArray} from "drizzle-orm";
import type {BinaryOperator} from "drizzle-orm/sql/expressions/conditions";

export const db = drizzle({ connection: { uri: process.env.DATABASE_URL as string }, logger: true});
const select = async (wheres: BinaryOperator[]) => {
    const query = db.select().from(ActivityUserTable).leftJoin(MemberTable, eq(ActivityUserTable.wechat_id, MemberTable.id));
    const result = await query.where(and(...wheres))
    if (!result) {
        return []
    }
    const ids = [];
    return result.map(({fa_wdsxh_activity_apply, fa_wdsxh_user_wechat}) => {
        return {
            id: fa_wdsxh_activity_apply.wechat_id,
            nickname: fa_wdsxh_user_wechat.nickname,
            mobile: fa_wdsxh_user_wechat.mobile,
            avatar: fa_wdsxh_user_wechat.avatar,
            prize_id: fa_wdsxh_activity_apply.prize_id
        }
    }).filter(({id}) => {
        const has = ids.includes(id)
        if (has) {
            return false
        }
        ids.push(id)
        return true
    })
}

export const getPrizes = async (id: string) => {
    const prizes = await db.select().from(ActivityPrizeTable).where(eq(ActivityPrizeTable.activity_id, id));
    const luckyUsers = await getLuckyUsers(id);
    return prizes.map((prize) => {
        return {
            ...prize,
            left: prize.max - (luckyUsers.filter(({prize_id}) => prize_id == prize.id)).length
        }
    })
}

export const getPrize = async (id: string) => {
    const prizes = await getPrizes(id)
    let i = 0, prize = prizes[0];
    for (; i < prizes.length; i++) {
        prize = prizes[i];
        if (prize.left <= 0) {
            return prizes[i - 1]
        }
        if (prize.left < prize.max) {
            return prize
        }
    }
    return prize
}

export const getLeftUsers = (id: string) => {
    return select([eq(ActivityUserTable.activity_id, id), eq(ActivityUserTable.prize_id, 0), eq(ActivityUserTable.is_sign_in, '1')]);
}

export const getAllUsers = (id: string) => {
    return select([eq(ActivityUserTable.activity_id, id), eq(ActivityUserTable.is_sign_in, '1')]);
}

export const getLuckyUsers = (id: string) => {
    return select([eq(ActivityUserTable.activity_id, id), gt(ActivityUserTable.prize_id, 0), eq(ActivityUserTable.is_sign_in, '1')]);
}

export const reset = (id: string) => {
    return db.update(ActivityUserTable).set({prize_id: 0}).where(eq(ActivityUserTable.activity_id, id));
}

export const setUserPrize = (id: number, user_ids: number[], prize_id: number) => {
    return db.update(ActivityUserTable).set({prize_id}).where(eq(ActivityUserTable.activity_id, id)).where(inArray(ActivityUserTable.wechat_id, user_ids));
}