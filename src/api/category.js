import server from '@/helpers/http'

export async function load() {
  return await server.get('category')
}

export async function loadById(id) {
  return await server.get(`category/${id}`)
}

export async function create(data) {
  return await server.post('category', data)
}

export async function update(id, data) {
  return await server.put(`category/${id}`, data)
}

export async function remove(id) {
  return await server.delete(`category/${id}`)
}

