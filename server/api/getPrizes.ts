import { getPrizes } from '../lib/db'
export default eventHandler(async (req) => {
    const query = getQuery(req)
    return await getPrizes(query.id as number)
});