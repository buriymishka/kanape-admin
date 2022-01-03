import { ROOT_DOMAIN } from '@/globalVars'

const defaultConfig = {
  expires: '; expires=86400',
  path: '; path=/',
  domain: `; domain=${ROOT_DOMAIN}`,
  secure: '',
  sameSite: '; SameSite=Lax'
}

const Cookie = {
  get(keyName) {
    let value = decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(keyName).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null // eslint-disable-line
    try {
      value = JSON.parse(value)
    } catch (e) {
      return value
    }
    return value
  },

  set(keyName, value, options = {}) {
    if (value instanceof Object) value = JSON.stringify(value)

    document.cookie = `${encodeURIComponent(keyName)}=${encodeURIComponent(value)}` + // eslint-disable-line
      (options.expires ? `; expires=${options.expires}` : defaultConfig.domain) +
      (options.domain ? `; domain=${options.domain}` : defaultConfig.domain) +
      (options.path ? `; path=${options.path}` : defaultConfig.path) +
      (options.secure ? '; Secure' : defaultConfig.secure) +
      (options.sameSite ? `; SameSite=${options.sameSite}` : defaultConfig.sameSite)
  },

  remove(keyName, options = {}) {
    if (!(new RegExp('(?:^|;\\s*)' + encodeURIComponent(keyName).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie)) return false // eslint-disable-line
    this.set(keyName, '', {
      ...options,
      expires: 'expires=Thu, 01 Jan 1970 00:00:00 GMT',
      sameSite: 'Lax'
    })
    return true
  }
}

export default Cookie
