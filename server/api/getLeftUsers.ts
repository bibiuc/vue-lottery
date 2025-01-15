import { getLeftUsers} from '../lib/db'
export default eventHandler(async (req) => {
    const query = getQuery(req)
    return getLeftUsers(query.id as number);
});