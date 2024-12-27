import {mysqlTable, int, tinyint, varchar, mysqlEnum, decimal, datetime} from 'drizzle-orm/mysql-core';
export const MemberTable = mysqlTable('fa_wdsxh_user_wechat', {
    id: int('id').primaryKey(),
    nickname: varchar('nickname', {length: 50}).notNull(),
    mobile: varchar('mobile', {length: 11}).notNull(),
    avatar: varchar('avatar', {length: 255}).notNull().unique(),
});

export const ActivityUserTable = mysqlTable('fa_wdsxh_activity_apply', {
    id: int('id').primaryKey(),
    wechat_id: int('wechat_id').notNull(),
    activity_id: int('activity_id').notNull(),
    state: mysqlEnum(['1','2','3','4','5']),
    is_sign_in: mysqlEnum(['1','2','3']),
    type: tinyint().notNull(),
    prize_id: int().notNull().default(0)
});

export const ActivityPrizeTable = mysqlTable('fa_wdsxh_activity_prize', {
    id: int('id').primaryKey(),
    activity_id: int('activity_id').notNull(),
    sort: int('sort').notNull().default(0),
    name: varchar('name', {length: 255}).notNull(),
    image: varchar('image', {length: 255}).notNull().unique(),
    description: varchar('description', {length: 255}).notNull().unique(),
    price: decimal('price').notNull(),
    once: int('once').notNull().default(0),
    status: int('status').notNull().default(1),
    max: int('max').notNull().default(0),
    created_at: datetime('created_at')
});

