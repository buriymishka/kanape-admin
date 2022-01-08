import server from '@/helpers/http'

export async function load() {
  return await server.get('order')
}

export async function loadById(id) {
  return await server.get(`order/${id}`)
}

export async function create(data) {
  return await server.post('order', data)
}

export async function update(id, data) {
  return await server.put(`order/${id}`, data)
}

export async function remove(id) {
  return await server.delete(`order/${id}`)
}

export async function changeStatus(id, status) {
  return await server.put(`order/changeStatus/${id}`, { status })
}

