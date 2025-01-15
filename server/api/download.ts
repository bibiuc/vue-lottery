import {getPrizes, getLuckyUsers} from '../lib/db'
import XLSX, {WorkSheet} from 'node-xlsx'
export default eventHandler(async (e) => {
    const query = getQuery(e)
    const luckyUsers = await getLuckyUsers(query.id as number)
    const prizes = await getPrizes(query.id as number);
    const sheetData: any[][] = prizes.reduce((res, prize) => {
        res.push([prize.name]);
        for (let i = 0; i < luckyUsers.length; i++) {
            const {nickname, mobile, prize_id} = luckyUsers[i]
            if (prize_id == prize.id) {
                res.push([prize.name, nickname, mobile])
            }
        }
        return res
    }, [['奖项', '昵称', '电话']]);
    const buffer = XLSX.build([
        {name: '中奖人员', data: sheetData} as WorkSheet
    ])
    setResponseHeader(e, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    setResponseHeader(e, 'Content-Disposition', 'attachment; filename=%E4%B8%AD%E5%A5%96%E4%BA%BA%E5%91%98.xlsx');

    return buffer
});