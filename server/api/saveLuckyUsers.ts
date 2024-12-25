import { setUserPrize } from '../lib/db'
export default eventHandler(async (e) => {
    const body = await readBody(e)
    await setUserPrize(body.id as number, body.user_ids as number[], body.prize_id as number)
    return 'ok';
});