export const useNumberMatrix = () => {
    const matrix: number[][][] = [
        [
            // 0
            [0, 0],
            [1, 0],
            [2, 0],
            [0, 1],
            [2, 1],
            [0, 2],
            [2, 2],
            [0, 3],
            [2, 3],
            [0, 4],
            [1, 4],
            [2, 4]
        ],
        [
            // 1
            [1, 0],
            [0, 1],
            [1, 1],
            [1, 2],
            [1, 3],
            [0, 4],
            [1, 4],
            [2, 4]
        ],
        [
            // 2
            [0, 0],
            [1, 0],
            [2, 0],
            [2, 1],
            [0, 2],
            [1, 2],
            [2, 2],
            [0, 3],
            [0, 4],
            [1, 4],
            [2, 4]
        ],
        [
            // 3
            [0, 0],
            [1, 0],
            [2, 0],
            [2, 1],
            [0, 2],
            [1, 2],
            [2, 2],
            [2, 3],
            [0, 4],
            [1, 4],
            [2, 4]
        ],
        [
            // 4
            [0, 0],
            [2, 0],
            [0, 1],
            [2, 1],
            [0, 2],
            [1, 2],
            [2, 2],
            [2, 3],
            [2, 4]
        ],
        [
            // 5
            [0, 0],
            [1, 0],
            [2, 0],
            [0, 1],
            [0, 2],
            [1, 2],
            [2, 2],
            [2, 3],
            [0, 4],
            [1, 4],
            [2, 4]
        ],
        [
            // 6
            [0, 0],
            [1, 0],
            [2, 0],
            [0, 1],
            [0, 2],
            [1, 2],
            [2, 2],
            [0, 3],
            [2, 3],
            [0, 4],
            [1, 4],
            [2, 4]
        ],
        [
            // 7
            [0, 0],
            [1, 0],
            [2, 0],
            [2, 1],
            [2, 2],
            [2, 3],
            [2, 4]
        ],
        [
            // 8
            [0, 0],
            [1, 0],
            [2, 0],
            [0, 1],
            [2, 1],
            [0, 2],
            [1, 2],
            [2, 2],
            [0, 3],
            [2, 3],
            [0, 4],
            [1, 4],
            [2, 4]
        ],
        [
            // 9
            [0, 0],
            [1, 0],
            [2, 0],
            [0, 1],
            [2, 1],
            [0, 2],
            [1, 2],
            [2, 2],
            [2, 3],
            [0, 4],
            [1, 4],
            [2, 4]
        ]
    ];

    let year:string = new Date().getFullYear() + ''
    let step:number = 4,
        xOffset:number = 1,
        yOffset:number = 1,
        highlight: string[] = [];

    year.split('').forEach((n: string) => {
        let i = parseInt(n);
        highlight = highlight.concat(
            matrix[i].map((item) => {
                return `${item[0] + xOffset}-${item[1] + yOffset}`
            })
        )
        xOffset += step
    })


    return {
        highlight,
        matrix
    };
}