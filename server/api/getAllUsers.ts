import { getAllUsers} from '../lib/db'
export default eventHandler(async (req) => {
    const query = getQuery(req)
    return getAllUsers(query.id as number);
});