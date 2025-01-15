import {sqliteTable, integer, text} from 'drizzle-orm/sqlite-core';



export const ActivityTable = sqliteTable('activity', {
    id: integer('id').primaryKey(),
    name: text('name', {length: 50}).notNull(),
    main_bg: text('main_bg', {length: 255}).notNull(),
    lottery_bg: text('lottery_bg', {length: 255}).notNull(),
});

export const UserTable = sqliteTable('user', {
    id: integer('id').primaryKey(),
    nickname: text('nickname', {length: 50}).notNull(),
    mobile: text('mobile', {length: 11}).notNull(),
    avatar: text('avatar', {length: 255}).notNull(),
});

export const ActivityUserTable = sqliteTable('activity_user', {
    id: integer('id').primaryKey(),
    user_id: integer('user_id').notNull(),
    activity_id: integer('activity_id').notNull(),
    prize_id: integer().notNull().default(0)
});

export const ActivityPrizeTable = sqliteTable('prize', {
    id: integer('id').primaryKey(),
    activity_id: integer('activity_id').notNull(),
    sort: integer('sort').notNull().default(0),
    name: text('name', {length: 255}).notNull(),
    image: text('image', {length: 255}).notNull(),
    description: text('description', {length: 255}).notNull(),
    once: integer('once').notNull().default(0),
    max: integer('max').notNull().default(0),
});

