interface PrizeUser {
    leftUsers: any[]
    luckyUsers: any[]
    allUsers: any[]
}

interface PrizeData extends PrizeUser{
    prizes: any[]
    prize: any
}
export const usePrizeData = () => {
    const data = reactive<PrizeData>({
        prizes: [],
        prize: {},
        leftUsers: [],
        luckyUsers: [],
        allUsers: []
    });
    const { $fetch } = useFetchModel({
        onResponseError(e) {
            const _message = typeof e.response._data === 'object' ? e.response._data.message : e.response._data;
            const message = typeof _message === 'string' ? _message : '系统异常'
            ElMessage.error(message)
        }
    })
    const actions = {
        async syncPrizes(id: number) {
            const res = await $fetch.get('/api/getPrizes', { params: { id } }).catch(() => []);
            data.prizes = res as any[];
        },
        async syncPrize(id: number) {
            const res = await $fetch.get('/api/getPrize', { params: { id } }).catch(() => []);
            data.prize = res as any[];
        },
        async saveLuckyUsers(id: number) {
            await $fetch.post('/api/saveLuckyUsers', { body: { id, prize_id: data.prize.id, user_ids: data.luckyUsers.map(({id}) => id) } }).catch(() => []);
            data.luckyUsers = [];
        },
        async syncLeftUsers(id: number) {
            const res = await $fetch.get('/api/getLeftUsers', { params: { id } }).catch(() => []);
            data.leftUsers = res as any[];
        },
        async syncAllUsers(id: number) {
            const res = await $fetch.get('/api/getAllUsers', { params: { id } }).catch(() => []);
            data.allUsers = res as any[];
        },
        async lottery(id: number) {
            try{
                const res = await $fetch.get('/api/lottery', { params: { id } })
                data.luckyUsers = res as any[];
            } catch (e) {
                data.luckyUsers = [];
                throw e
            }
        },
        async reset(id: number) {
            await $fetch.get('/api/reset', { params: { id } }).catch(() => []);
        },
        download(id: number) {
            const a = document.createElement('a')
            a.href = '/api/download?id=' + id
            a.download = '中奖人员.xlsx'
            a.click()
        }
    }
    const getters = {
        user(i: number, users: any[]) {
            if (!users || users.length < 0) {
                return null
            }
            return users[i % users.length]
        },
        avatar(i: number, users: any[]): string {
            let user = null
            if (users && users.length > 0) {
                user = users[i % users.length]
            }
            if (!user) {
                return ''
            }
            return user.avatar
        }
    }

    return {
        data,
        actions,
        getters
    }
}