const hostArr = window.location.hostname.split('.')
export const ROOT_DOMAIN = `${hostArr[hostArr.length - 2] ? hostArr[hostArr.length - 2] + '.' : ''}${hostArr[hostArr.length - 1]}`

export const REGEX_EMAIL = () => /.+@.+\..+/
