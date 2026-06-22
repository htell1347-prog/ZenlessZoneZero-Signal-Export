const ExcelJS = require('./module/exceljs.min.js')
const getData = require('./getData').getData
const { app, ipcMain, dialog } = require('electron')
const fs = require('fs-extra')
const path = require('path')
const i18n = require('./i18n')
const cloneDeep  = require('lodash-es/cloneDeep').default

function pad(num) {
  return `${num}`.padStart(2, "0");
}

function getTimeString() {
  const d = new Date();
  const YYYY = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const DD = pad(d.getDate());
  const HH = pad(d.getHours());
  const mm = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${YYYY}${MM}${DD}_${HH}${mm}${ss}`;
}

const start = async () => {
  const { header, customFont, filePrefix, fileType } = i18n.excel
  const { dataMap, current } = await getData()
  const data = dataMap.get(current)
  // ref: https://github.com/sunfkny/genshin-gacha-export-js (adapted for ZZZ)
  const workbook = new ExcelJS.Workbook()
  for (let [key, value] of data.result) {
    const name = data.typeMap.get(key)
    const sheet = workbook.addWorksheet(name, {views: [{state: 'frozen', ySplit: 1}]})
    let width = [24, 14, 8, 8, 8, 8, 8]
    if (!data.lang.includes('zh-')) {
      width = [24, 32, 16, 12, 12, 12, 8]
    }
    const excelKeys = ['time', 'name', 'type', 'rank', 'total', 'pity', 'remark']
    sheet.columns = excelKeys.map((key, index) => {
      return {
        header: header[key],
        key,
        width: width[index]
      }
    })
    // get gacha logs
    const logs = cloneDeep(value)
    let total = 0
    let pity = 0
    for (let log of logs){
      total += 1
      pity += 1
      log.type = log.item_type
      const rankLabel = { 2: 'B级', 3: 'A级', 4: 'S级' }
      log.rank = rankLabel[log.rank_type] || log.rank_type
      log.total = total
      log.pity = pity
      if (parseInt(log.rank_type) === 4) {
        pity = 0
      }
    }

    sheet.addRows(logs)
    // set xlsx hearer style
    ;(["A", "B", "C", "D","E","F", "G"]).forEach((v) => {
      sheet.getCell(`${v}1`).border = {
        top: {style:'thin', color: {argb:'ffc4c2bf'}},
        left: {style:'thin', color: {argb:'ffc4c2bf'}},
        bottom: {style:'thin', color: {argb:'ffc4c2bf'}},
        right: {style:'thin', color: {argb:'ffc4c2bf'}}
      }
      sheet.getCell(`${v}1`).fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{argb:'ffdbd7d3'},
      }
      sheet.getCell(`${v}1`).font ={
        name: customFont,
        color: { argb: "ff757575" },
        bold : true
      }

    })
    // set xlsx cell style
    logs.forEach((v, i) => {
      ;(["A", "B", "C", "D","E","F", "G"]).forEach((c) => {
        sheet.getCell(`${c}${i + 2}`).border = {
          top: {style:'thin', color: {argb:'ffc4c2bf'}},
          left: {style:'thin', color: {argb:'ffc4c2bf'}},
          bottom: {style:'thin', color: {argb:'ffc4c2bf'}},
          right: {style:'thin', color: {argb:'ffc4c2bf'}}
        }
        sheet.getCell(`${c}${i + 2}`).fill = {
          type: 'pattern',
          pattern:'solid',
          fgColor:{argb:'ffebebeb'},
        }
        // rare rank background color
        const rankColor = {
          2: "ff8e8e8e",
          3: "ffa256e1",
          4: "ffbd6932",
        }
        const rankNum = parseInt(v.rank_type)
        sheet.getCell(`${c}${i + 2}`).font = {
          name: customFont,
          color: { argb: rankColor[rankNum] },
          bold : rankNum !== 2
        }
      })
    })
  }

  const buffer = await workbook.xlsx.writeBuffer()
  const filePath = dialog.showSaveDialogSync({
    defaultPath: path.join(app.getPath('downloads'), `${filePrefix}_${getTimeString()}`),
    filters: [
      { name: fileType, extensions: ['xlsx'] }
    ]
  })
  if (filePath) {
    await fs.ensureFile(filePath)
    await fs.writeFile(filePath, buffer)
  }
}

ipcMain.handle('SAVE_EXCEL', async () => {
  await start()
})