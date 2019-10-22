import React, { Component } from 'react'
import { Flex, Toast } from 'antd-mobile'
import SearchHeader from '../../components/SearchHeader'
import { getCurrentCity } from '../../utils/city'
import styles from './index.module.scss'
import {
  AutoSizer,
  List,
  WindowScroller,
  InfiniteLoader
} from 'react-virtualized'

//导入子组件
import Filter from './components/Filter'
import HouseItem from '../../components/HouseItem'

export default class HouseList extends Component {
  constructor() {
    super()
    this.state = {
      cityName: '', //城市名称
      houseDataList: [], //房源数据列表
      count: 0 //房源数据条数
    }
  }
  //组件初始化时只调用，以后组件更新不调用，整个生命周期只调用一次，此时可以修改state
  async componentWillMount() {
    const { label, value } = await getCurrentCity() //获取当前城市信息
    this.value = value
    this.setState({
      cityName: label
    })
    //获取房源数据
    this.getHouseData()
  }

  // 筛选条件
  filter = {}

  // 处理filter子组件传过来的数据
  onFilter = filter => {
    this.filter = filter
    //当筛选条件选中点击确定时,再次获取数据
    this.getHouseData()
  }

  //获取房源数据
  getHouseData = async () => {
    Toast.loading('正在加载中...', 0)
    const res = await this.$axios.get('/houses', {
      params: {
        cityId: this.value,
        start: 1,
        end: 20,
        ...this.filter
      }
    })
    Toast.hide()
    const { list, count } = res.data.body
    if (count > 0) {
      Toast.info(`共有${count}套房源`, 1)
    }
    //赋值给模型
    this.setState({
      houseDataList: list,
      count
    })
  }

  //渲染房源数据列表
  renderHouseDataList = () => {
    const { count } = this.state
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count} //列表条数
        minimumBatchSize={20} //一次加载的最少行数
      >
        {({ onRowsRendered }) => (
          <WindowScroller>
            {({ height, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    onRowsRendered={onRowsRendered}
                    autoHeight
                    scrollTop={scrollTop}
                    height={height}
                    rowCount={count}
                    rowHeight={120}
                    rowRenderer={this.rowRenderer}
                    width={width}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }

  //渲染列表每一行
  rowRenderer = ({ key, index, style }) => {
    const { houseDataList, count } = this.state
    const item = houseDataList[index]
    if (!item) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading}></p>
        </div>
      )
    }
    return (
      <div key={key} style={style}>
        <HouseItem {...item} />
      </div>
    )
  }

  //跟踪每一行的加载状态
  isRowLoaded = ({ index }) => {
    return !!this.state.houseDataList[index] //判断某一行是否加载完毕(参照InfiniteLoader的demo写的)
  }

  //加载更多数据
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(async (resolve, reject) => {
      const res = await this.$axios.get('/houses', {
        params: {
          cityId: this.value,
          start: startIndex,
          end: stopIndex,
          ...this.filter
        }
      })
      const { list, count } = res.data.body
      // if (count > 0) {
      //   Toast.info(`共有${count}套房源`)
      // }
      //赋值给模型
      this.setState({
        houseDataList: [...this.state.houseDataList, ...list],
        count
      })
      resolve()
    })
  }

  render() {
    const { cityName } = this.state
    return (
      <div className={styles.root}>
        {/* 顶部搜索栏 */}
        <Flex className={styles.listHeader}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.goBack()}
          ></i>
          <SearchHeader cityName={cityName} className={styles.listSearch} />
        </Flex>
        {/* 渲染子组件 */}
        <Filter onFilter={this.onFilter} />
        {/* 渲染房源数据列表 */}
        <div className={styles.houseList}>
          {this.state.houseDataList && this.renderHouseDataList()}
        </div>
      </div>
    )
  }
}
