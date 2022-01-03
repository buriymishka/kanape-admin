export default function parseQuery(queryString) {
  const query = {}
  queryString = queryString.trim()
  const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0].trim())] = decodeURIComponent(pair[1] || '')
  }
  delete query['']
  return query
}
