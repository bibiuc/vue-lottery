import {random} from 'lodash'
export const useMainMatrix = (isLuckyIndex: (item: any[], index: number) => boolean) => {
    const {highlight} = useNumberMatrix();
    const   baseMatrix: any[][] = [],
        matrix = ref<any[][]>([]),
        ROW_COUNT = 7,
        COLUMN_COUNT = 17,
        TOTAL_CARDS = ROW_COUNT * COLUMN_COUNT,
        position = {
            x: (140 * COLUMN_COUNT - 20) / 2,
            y: (180 * ROW_COUNT - 20) / 2
        },
        shineIndexes: number[] = [];
    const getLeftIndexes = () => {
        const leftIndexes: number[] = []
        matrix.value.forEach((item, index) => {
            if (!isLuckyIndex(item, index) && !shineIndexes.includes(index)) {
                leftIndexes.push(index)
            }
        })
        leftIndexes.sort(() => 0.5 - random(0, 1))
        return leftIndexes
    }
    const shine = useIntervalFn( () => {
        let leftIndexes = getLeftIndexes()
        if (leftIndexes.length <= 10) {
            shineIndexes.splice(0, shineIndexes.length)
            leftIndexes = getLeftIndexes();
        }
        const shineNum = leftIndexes.length < 20 ? leftIndexes.length : (10 + random(0, 10))
        leftIndexes = leftIndexes.slice(0, shineNum)
        matrix.value = matrix.value.map((item, index) => {
            let [y, x, v, l, c] = item
            if (leftIndexes.includes(index)) {
                v = random(0, baseMatrix.length)
                c = (Math.random() * 0.7 + 0.25)
                shineIndexes.push(index)
            }
            return [y, x, v, l, c]
        })
    }, 500);

    for (let i = 0; i < ROW_COUNT; i++) {
        for (let j = 0; j < COLUMN_COUNT; j++) {
            baseMatrix.push([i, j, i * COLUMN_COUNT + j, highlight.includes(j + "-" + i), (Math.random() * 0.7 + 0.25)])
        }
    }
    matrix.value = baseMatrix
    return {
        position,
        matrix,
        shine
    };
}