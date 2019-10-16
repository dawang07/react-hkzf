import { axios } from './axios'

const KEY = 'CITY_DATA'

//设置储存数据在本地方法
export const setCityData = cityData => {
  window.localStorage.setItem(KEY, JSON.stringify(cityData))
}

//取出本地数据
export const getCityData = () => {
  return window.localStorage.getItem(KEY)
}

const BMap = window.BMap


export function getCurrentCity() {
  //需返回一个Promise

  const cityData = getCityData()
  //判断本地是否有储存数据
  if (!cityData) {
    //本地没有城市数据
    return new Promise((resolve, reject) => {
      //根据百度地图定位,获取当前城市的名称
      var myCity = new BMap.LocalCity()

      myCity.get(async result => {
        const res = await axios.get(`/area/info?name=${result.name}`)

        //resolve出去
        resolve(res.data.body)

        //保存在本地
        setCityData(res.data.body)
      })
    })
  } else {
    //从本地获取
    return Promise.resolve(JSON.parse(cityData))
  }
}
