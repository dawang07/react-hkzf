import React, { Component } from 'react'
import NavHeader from '../../components/NavHeader'
import { getCurrentCity, setCityData } from '../../utils/city'
import { List, AutoSizer } from 'react-virtualized'
import { Toast } from 'antd-mobile'
import styles from './index.module.scss'

//设置城市列表每行的基准gaoud
const CITY_TITLE_HEIGHT = 36
const CITY_ROW_HEIGHT = 50
const hotCityArr = ['北京', '上海', '广州', '深圳']

export default class index extends Component {
  constructor() {
    super()

    this.state = {
      cityListObj: {}, //城市列表数据
      cityIndex: [], //城市索引数据
      activeIndex: 0 //激活的索引,默认是第一个
    }
  }

  componentDidMount() {
    // 调用获取城市列表数据方法

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

    //处理热门城市数据
    cityIndex.unshift('hot')
    const hotCity = await this.$axios.get('/area/hot')
    obj['hot'] = hotCity.data.body

    //处理当前城市数据
    cityIndex.unshift('#')
    const currentCity = await getCurrentCity()
    obj['#'] = [currentCity]

    // 赋值给模型
    this.setState({
      cityListObj: obj,
      cityIndex
    })

    // console.log(this.state.cityListObj, this.state.cityIndex)
  }

  //过滤cityIndex的属性
  formatCityTitle(letter) {
    switch (letter) {
      case '#':
        return '定位城市'

      case 'hot':
        return '热门城市'

      //toUpperCase() 小写字母转大写字母
      default:
        return letter.toUpperCase()
    }
  }

  //渲染每一行数据
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection 集合中的行的索引
    style // Style object to be applied to row (to position it)
  }) => {
    //通过索引获取首字母
    const letter = this.state.cityIndex[index]
    //通过字母获取对应相应的城市数据
    const citys = this.state.cityListObj[letter]
    // console.log('citys', citys)
    return (
      <div key={key} style={style} className={styles.city}>
        <div className={styles.title}>{this.formatCityTitle(letter)}</div>
        {citys.map(item => {
          return (
            <div
              key={item.value}
              className={styles.name}
              onClick={() => this.setCityLocation(item)}
            >
              {item.label}
            </div>
          )
        })}
      </div>
    )
  }

  setCityLocation = ({ label, value }) => {
    //判断,如果不是北上广深就提示无房源信息
    if (!hotCityArr.includes(label)) {
      Toast.fail('该城市暂无房源信息', 1)
      return
    }

    //如果是北上广深就把城市信息储存在本地
    setCityData({ label, value })

    //跳转回上一个页面
    this.props.history.goBack()
  }

  //计算每行的高度  参数是从rowHeight中获取的
  calcRowHeight = ({ index }) => {
    //通过索引获取首字母
    const letter = this.state.cityIndex[index]
    //通过字母获取对应相应的城市数据
    const citys = this.state.cityListObj[letter]

    return CITY_TITLE_HEIGHT + citys.length * CITY_ROW_HEIGHT
  }

  //创建refs
  listRef = React.createRef()

  //点击右侧索引事件
  cityIndexClick = index => {
    this.listRef.current.scrollToRow(index)
  }

  //渲染右侧的索引条
  renderCityIndex = () => {
    return (
      <div className={styles.cityIndex}>
        {this.state.cityIndex.map((item, index) => {
          return (
            <div key={item} className={styles.cityIndexItem}>
              <span
                onClick={() => this.cityIndexClick(index)}
                className={
                  index === this.state.activeIndex ? styles.indexActive : ''
                }
              >
                {item === 'hot' ? '热' : item.toUpperCase()}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  //设置滚动城市列表右侧对应索引高亮
  //startIndex 页面顶部行的下标
  onRowsRendered = ({ startIndex }) => {
    if (startIndex !== this.state.activeIndex) {
      this.setState({
        activeIndex: startIndex
      })
    }
  }

  render() {
    const { cityIndex } = this.state
    return (
      <div className={styles.citylist}>
        {/* 顶部栏 */}
        <div>
          <NavHeader>城市列表</NavHeader>
        </div>
        {/* 城市列表 */}

        {cityIndex.length > 0 && (
          <AutoSizer>
            {/* List外面包裹AutoSizer是为了我们拿到屏幕的宽高 */}
            {({ width, height }) => (
              <List
                ref={this.listRef}
                width={width} //整个List组件的宽度
                height={height} //整个List的高度
                rowCount={cityIndex.length} //显示多少条数据
                rowHeight={this.calcRowHeight} //每行数据的高度
                rowRenderer={this.rowRenderer} //渲染每一行数据
                onRowsRendered={this.onRowsRendered}
                scrollToAlignment="start"
              />
            )}
          </AutoSizer>
        )}

        {/* 渲染右侧的索引条 */}
        {cityIndex.length > 0 && this.renderCityIndex()}
      </div>
    )
  }
}
