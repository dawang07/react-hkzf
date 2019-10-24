const KEY = 'hkzf_token'

//把token储存在本地
export const setToken = token => {
  window.localStorage.setItem(KEY, token)
}

//取出token
export const getToken = () => {
  return window.localStorage.getItem(KEY)
}

//删除本地token
export const removeToken = () => {
  window.localStorage.removeItem(KEY)
}

export const isAuthenticated = () => {
  return getToken()
}
