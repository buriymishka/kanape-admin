import axios from 'axios'
import router from '@/router'
import { getAC, setAC } from '@/tokens'

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api/' : 'http://localhost:8089/api/',
  withCredentials: true
})

instance.interceptors.request.use(addAccessToken);

instance.interceptors.response.use(response => {
  return response.data
}, async (error) => {
  if (error.response?.status === 401) {
    let refresh = await instance.get('token/refresh')
    if (refresh.success && refresh.newAccessToken) {
      setAC(refresh.newAccessToken)
      return instance(addAccessToken(error.config));
    } else {
      if (!['/login', '/recover'].includes(window.location.pathname)) {
        window.location.pathname = '/login'
      }
    }
  }

  if (error.response?.data?.frontMessage) {
    error.frontMessage = error.response.data.frontMessage
  }
  throw error
})

export default instance

function addAccessToken(request) {
  request.headers['accesstoken'] = getAC()

  return request;
}

