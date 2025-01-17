import { getLeftUsers, getPrize } from '../lib/db'
import random from 'lodash-es/random.js'
import { H3Error } from "h3";

export default eventHandler(async (req) => {
    const query = getQuery(req)
    const prize = await getPrize(query.id as number);
    const leftUsers = await getLeftUsers(query.id as number)
    if (!leftUsers || leftUsers.length === 0){
        throw new H3Error('暂无可抽奖的用户。');
    }
    leftUsers.sort(() => random(0, 1) - 0.5)
    const luckyUsers = [];
    const max = Math.min(prize.left, prize.once, leftUsers.length);
    for (let i = 0; i < max; i++) {
        luckyUsers.push(leftUsers[i])
    }
    return luckyUsers;
});