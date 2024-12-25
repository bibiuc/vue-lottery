import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import { ActivityUserTable, MemberTable } from './schema'
import {and, eq, gt, inArray} from "drizzle-orm";
import type {BinaryOperator} from "drizzle-orm/sql/expressions/conditions";

export const db = drizzle({ connection: { uri: process.env.DATABASE_URL as string }, logger: true});
const select = async (wheres: BinaryOperator[]) => {
    const query = db.select().from(ActivityUserTable).leftJoin(MemberTable, eq(ActivityUserTable.wechat_id, MemberTable.id));
    const result = await query.where(and(...wheres))
    if (!result) {
        return []
    }
    return result.map(({fa_wdsxh_activity_apply, fa_wdsxh_user_wechat}) => {
        return {
            id: fa_wdsxh_activity_apply.wechat_id,
            nickname: fa_wdsxh_user_wechat.nickname,
            mobile: fa_wdsxh_user_wechat.mobile,
            avatar: fa_wdsxh_user_wechat.avatar,
            prize_id: fa_wdsxh_activity_apply.prize_id
        }
    })
}

export const getPrizes = async (id: string) => {
    const prizes = [
        {
            id: 1,
            level: 0,
            name: '特等奖',
            image: '',
            description: '',
            price: '222.00',
            once: 1,
            left: 100,
            max: 100,
            status: 0,
            created_at: '2024-03-01'
        },
        {
            id: 2,
            level: 1,
            name: '特等奖',
            image: '/_nuxt/assets/images/secrit.jpg',
            description: '神秘大礼',
            price: '222.00',
            once: 1,
            left: 1,
            max: 1,
            status: 1,
            created_at: '2024-03-01'
        },
        {
            id: 3,
            level: 2,
            name: '一等奖',
            image: '/_nuxt/assets/images/mbp.jpg',
            description: 'Mac Pro',
            price: '222.00',
            once: 1,
            left: 1,
            max: 1,
            status: 1,
            created_at: '2024-03-01'
        },
        {
            id: 4,
            level: 3,
            name: '二等奖',
            image: '/_nuxt/assets/images/huawei.png',
            description: '华为 Mate30',
            price: '222.00',
            once: 1,
            left: 2,
            max: 2,
            status: 1,
            created_at: '2024-03-01'
        },
        {
            id: 5,
            level: 4,
            name: '三等奖',
            image: '/_nuxt/assets/images/ipad.jpg',
            description: 'Ipad Mini5',
            price: '222.00',
            once: 3,
            left: 3,
            max: 3,
            status: 1,
            created_at: '2024-03-01'
        },
        {
            id: 6,
            level: 5,
            name: '四等奖',
            image: '/_nuxt/assets/images/spark.jpg',
            description: '大疆无人机',
            price: '222.00',
            once: 4,
            left: 4,
            max: 4,
            status: 1,
            created_at: '2024-03-01'
        },
        {
            id: 7,
            level: 6,
            name: '五等奖',
            image: '/_nuxt/assets/images/kindle.jpg',
            description: 'Kindle',
            price: '222.00',
            once: 5,
            left: 5,
            max: 5,
            status: 1,
            created_at: '2024-03-01'
        },
        {
            id: 8,
            level: 7,
            name: '六等奖',
            image: '/_nuxt/assets/images/edifier.jpg',
            description: '漫步者蓝牙耳机',
            price: '222.00',
            once: 2,
            left: 6,
            max: 6,
            status: 1,
            created_at: '2024-03-01'
        }
    ];

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