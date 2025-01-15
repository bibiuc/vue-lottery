import 'dotenv/config';
import { drizzle } from "drizzle-orm/libsql";
import {ActivityPrizeTable, ActivityUserTable, UserTable} from './schema'
import {and, eq, gt, inArray} from "drizzle-orm";
import init from './init';
import {SQL} from "drizzle-orm/sql/sql";

export const db = drizzle({ connection: process.env.DATABASE_URL as string, logger: true});

init(db).catch(console.log)
const select = async (wheres: SQL): Promise<{id: number, nickname: string, mobile: string, prize_id: number}[]> => {
    const query = db.select().from(ActivityUserTable).leftJoin(UserTable, eq(ActivityUserTable.user_id, UserTable.id));
    const result = await query.where(wheres)
    if (!result) {
        return []
    }
    const ids: number[] = [];
    return result.map(({activity_user, user}) => {
        return {
            id: activity_user.user_id,
            nickname: user!.nickname,
            mobile: user!.mobile,
            avatar: user!.avatar,
            prize_id: activity_user.prize_id
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

export const getPrizes = async (id: number) => {
    const prizes = await db.select().from(ActivityPrizeTable).where(eq(ActivityPrizeTable.activity_id, id));
    const luckyUsers = await getLuckyUsers(id);
    return prizes.map((prize) => {
        return {
            ...prize,
            left: prize.max - (luckyUsers.filter(({prize_id}) => prize_id == prize.id)).length
        }
    })
}

export const getPrize = async (id: number) => {
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

export const getLeftUsers = (id: number) => {
    return select(
        and(
            eq(ActivityUserTable.activity_id, id),
            eq(ActivityUserTable.prize_id, 0)
        )!
    );
}

export const getAllUsers = (id: number) => {
    return select(eq(ActivityUserTable.activity_id, id));
}

export const getLuckyUsers = (id: number) => {
    return select(
        and(
            eq(ActivityUserTable.activity_id, id),
            gt(ActivityUserTable.prize_id, 0)
        )!
    );
}

export const reset = (id: number) => {
    return db.update(ActivityUserTable).set({prize_id: 0}).where(eq(ActivityUserTable.activity_id, id));
}

export const setUserPrize = (id: number, user_ids: number[], prize_id: number) => {
    return db.update(ActivityUserTable).set({prize_id})
        .where(and(
            eq(ActivityUserTable.activity_id, id),
            inArray(ActivityUserTable.user_id, user_ids)
        ));
}