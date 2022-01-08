import server from '@/helpers/http'

export async function load() {
  return await server.get('info')
}

export async function update(data) {
  return await server.put('info', data)
}

