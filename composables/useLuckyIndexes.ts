import {isEqual, isNumber} from "lodash";

export const useLuckyIndexes = (luckyIds: Ref<(number|string)[]>, getCurrentLuckyUsers: () =>any[]) => {
    const indexes = ref<Record<string, number>>({});
    const addLuckyIndex = (id: string|number, index:number) => indexes.value = {...indexes.value, [id]: index}
    watch(luckyIds, (a, b) => {
        if (isEqual(a, b)) {
            return;
        }
        indexes.value = {}
    })
    const isInIndexes = (id: number|string, index: number) => {
        const savedIndex = indexes.value[id]
        if (luckyIds.value.includes(id)) {
            if (isNumber(savedIndex)) {
                return savedIndex == index
            }
            addLuckyIndex(id, index)
            return true
        }
        return false
    }
    const current = computed<number[]>(() => {
        const ids:number[] = [],
            users = getCurrentLuckyUsers();
        users.forEach(({id}) => {
            const index = indexes.value[id]
            if (typeof index === "number") {
                ids.push(index)
            }
        })
        if (ids.length !== users.length) {
            return [];
        }
        return ids
    })
    return {
        indexes,
        isInIndexes,
        current
    }
}