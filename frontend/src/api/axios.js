import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
})

let isRefreshing = false

//Request Interceptor
api.interceptors.request.use(
  config => {
    //Get token from local storage
    const token = localStorage.getItem('accessToken')

    //if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },

  error => {
    return Promise.reject(error)
  }
)

// -------- Response interceptor ------------------------
api.interceptors.response.use(
  res => res,

  async error => {
    const originalRequest = error.config

    if (!error.response) {
      return Promise.reject(error)
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh-token')
    ) {
      if (isRefreshing) {
        return new Promise(resolve => setTimeout(resolve, 500)).then(() => {
          const token = localStorage.getItem('accessToken')

          originalRequest.headers.Authorization = `Bearer ${token}`

          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await api.post(
          '/auth/refresh-token',
          {},
          {
            withCredentials: true,
            _retry: true
          }
        )

        const newAccessToken = res.data.accessToken

        localStorage.setItem('accessToken', newAccessToken)

        isRefreshing = false

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch (err) {
        console.log('Refresh token failed completely')

        isRefreshing = false

        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')

        alert('Session expired. Please login again.')

        setTimeout(() => {
          window.location.href = '/login'
        }, 1500)

        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default api
