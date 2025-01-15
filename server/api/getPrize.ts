import { getPrize } from '../lib/db'
export default eventHandler(async (req) => {
    const query = getQuery(req)
    return await getPrize(query.id as number)
});