import server from '@/helpers/http'

export async function load() {
  return await server.get('product')
}

export async function loadById(id) {
  return await server.get(`product/${id}`)
}

export async function create(data) {
  return await server.post('product', data)
}

export async function update(id, data) {
  return await server.put(`product/${id}`, data)
}

export async function remove(id) {
  return await server.delete(`product/${id}`)
}

