import { reset } from '../lib/db'
export default eventHandler(async (req) => {
    const query = getQuery(req)
    await reset(query.id as number)
    return 'ok'
});