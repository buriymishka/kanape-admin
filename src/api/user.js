import server from '@/helpers/http'

export async function login(data) {
  return await server.post('user/login', data)
}

export async function recover(data) {
  return await server.post('user/recover', data)
}

export async function load() {
  return await server.get('user')
}

export async function update(data) {
  return await server.put('user', data)
}

export async function logout() {
  return await server.post('user/logout')
}
