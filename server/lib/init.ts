import type {LibSQLDatabase} from "drizzle-orm/libsql";
import fs from 'fs-extra'
import path from 'path'
import {ActivityPrizeTable, UserTable, ActivityUserTable, ActivityTable} from './schema';
import Mock from 'mockjs'
import Identicon from 'identicon.js';
import Nzh from 'nzh';

// 自定义生成base64格式头像的函数
function avatarBase64() {
    const data = Mock.Random.guid();
    const identicon = new Identicon(data, {size:128, format: 'svg'});
    return identicon.image().getBase64();
}

// 扩展Mock.js的随机数据生成规则
Mock.Random.extend({
    avatarBase64
});

const lockfile = path.join(path.resolve('./server/db/installed'));
const init = async (db: LibSQLDatabase) => {
    const installed = await fs.exists(lockfile);
    if (installed) {
        return;
    }
    await fs.createFile(lockfile)
    const activity = await db.insert(ActivityTable).values(Mock.mock({
        name: '@cname',
        main_bg: '@avatarBase64',
        lottery_bg: 'stars',
    }))
    const users = Mock.mock({
        'list|20': [
            {
                nickname: '@cname',
                mobile: '@phone',
                avatar: '@avatarBase64'
            }
        ]
    });
    await Promise.all(users.list.map(async (user:{nickname: string, mobile: string, avatar: string}, i:number) => {
        const saved = await db.insert(UserTable).values({...user, id: i + 1})
        await db.insert(ActivityUserTable).values({activity_id: 1, user_id: i + 1, prize_id: 0});
    }))
    const prizes = Mock.mock({
        'list|5': [{
            'description': '@ctitle',
            'image': '@avatarBase64'
        }]
    })
    await Promise.all(prizes.list.map(async (prize: {description: string, image: string}, i:number) => {
        await db.insert(ActivityPrizeTable).values({
            ...prize,
            activity_id: 1,
            sort: i,
            name: (i ? Nzh.cn.encodeS(i): '特') + '等奖'
        }).returning();
    }))
};

export default init