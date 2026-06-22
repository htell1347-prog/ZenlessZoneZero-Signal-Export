// NOTE: This module is disabled (commented out in main.js).
// It depends on generateUigf30Json which was removed when UIGFJson.js was
// migrated from Genshin (UIGF v3.0/v4.1) to ZZZ (UIGF v4.0 only).
// To re-enable, the export/import flow must be adapted to the new ZZZ UIGF format.
const {ipcMain} = require('electron')
const config = require('./config')
const {Octokit} = require('@octokit/core')
const fetch = require('electron-fetch').default
const { generateUigf30Json } = require('./UIGFJson')

const start = async () => {
  const result = generateUigf30Json()

  if (!config.gistsToken) {
    throw new Error('未设置gistsToken')
  }

  const octokit = new Octokit({
    request: {fetch: fetch},
    auth: config.gistsToken
  })

  // 更新Gist
  if (config.gistsId) {
    // 检查Gists上的文件是否被删除，如果被删除则进入新增流程
    const response = await octokit.request('GET /gists/{gist_id}', {
      gist_id: config.gistsId,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    if (config.gistsId === response.data.id) {
      await octokit.request('PATCH /gists/{gist_id}', {
        gist_id: response.data.id,
        files: {
          // 这里文件名不需要加时间戳，加入时间戳会产生多个文件
          [`UIGF_${result.info.uid}.json`]: {
            content: JSON.stringify(result, null, 2)
          }
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      return 'successed'
    }
  }

  // 新增Gist
  const response = await octokit.request('POST /gists', {
    description: 'ZenlessZoneZero-signal-export',
    'public': false,
    files: {
      [`UIGF_${result.info.uid}.json`]: {
        content: JSON.stringify(result, null, 2)
      }
    },
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  if (response.status === 201) {
    config["gistsId"] = response.data.id
    await config.save()
    return 'successed'
  }
}

ipcMain.handle('EXPORT_UIGF_JSON_GISTS', async () => {
  try {
    return await start()
  } catch (e) {
    return e.message
  }
})
