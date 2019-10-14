import React, { Component } from 'react'
import NavHeader from '../../components/NavHeader'

export default class index extends Component {
  constructor() {
    super()

    this.state = {
      cityListObj: {}, //城市列表数据
      cityIndex: [] //城市索引数据
    }
  }

  componentDidMount() {
    this.getcityListData()
  }

  //获取城市列表数据
  async getcityListData() {
    const result = await this.$axios.get('/area/city?level=1')
    // console.log(result.data.body)
    //创建一个空对象
    const obj = {}

    //遍历城市列表数组
    result.data.body.forEach(item => {
      const letter = item.short.substring(0, 1)

      if (obj[letter]) {
        obj[letter].push(item)
      } else {
        obj[letter] = [item]
      }
    })

    // 获取城市列表索引数据
    const cityIndex = Object.keys(obj).sort()
    cityIndex.unshift('hot')

    //获取热门城市数据
    const hotCity = await this.$axios.get('/area/hot')
    obj['hot'] = hotCity.data.body

    // 赋值给模型
    this.setState({
      cityListObj: obj,
      cityIndex
    })
  }

  render() {
    return (
      <div>
        {/* 顶部栏 */}
        <div>
          <NavHeader>城市列表</NavHeader>
        </div>
      </div>
    )
  }
}
