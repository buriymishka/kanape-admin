const moment = require('moment')
const path = require('path')
const minifyImage = require('./minifyImage')
const fs = require('fs')

module.exports = async function uploadImage(img) {
  const filename = `${moment().format('DDMMYYYY-HHmmss_SSS')}_${img.md5}${path.extname(img.name)}`
  const tempPath = path.resolve(__dirname, '../temp/', filename)
  const fullPath = path.resolve(__dirname, '../uploads/', filename)
  await img.mv(tempPath)

  try {
    await minifyImage(tempPath, fullPath)
    fs.unlinkSync(tempPath)
  } catch (e) {
    fs.renameSync(tempPath, fullPath)
  }

  return filename
}
