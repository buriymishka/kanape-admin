const sharp = require('sharp')

module.exports = async function minifyImage(tempUrl = '', url = '') {
  return await sharp(tempUrl, { cache: false })
    .jpeg({ progressive: true, force: false })
    .png({ progressive: true, force: false })
    .toFile(url)
}
