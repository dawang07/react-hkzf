import React, { Component } from 'react'
import NavHeader from '../../components/NavHeader'
import { getCurrentCity } from '../../utils/city'
import { Toast } from 'antd-mobile'
import styles from './index.module.scss'
import classNames from 'classnames'
import HouseItem from '../../components/HouseItem'

//从window里获取BMap
const BMap = window.BMap

// label 样式：
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

export default class Map extends Component {
  state = {
    housingData: [], //房源数据
    isShowHouseList: false //控制加载房源列表
  }

  componentDidMount() {
    this.initMap()
  }

  initMap = async () => {
    //获取当前城市名称
    const { label, value } = await getCurrentCity()
    this.value = value

    // 创建地图实例
    var map = new BMap.Map('container')
    this.map = map

    //设置中心点坐标
    // var point = new BMap.Point(116.404, 39.915)

    // 显示地图位置，同时设置地图展示级别
    map.centerAndZoom(label, 11)

    //添加地图控件
    map.addControl(new BMap.NavigationControl()) //平移缩放控件、
    map.addControl(new BMap.ScaleControl()) //一个比例尺控件
    map.addControl(new BMap.MapTypeControl())

    this.renderOverlays(value)
  }

  //分析是添加第几级覆盖物
  decideOverlaysType = () => {
    let type, nextZoom
    //getZoom()  返回地图缩放级别
    const zoom = this.map.getZoom()
    if ((zoom > 10) & (zoom < 12)) {
      type = 'circle'
      nextZoom = 13
    } else if ((zoom > 12) & (zoom < 14)) {
      type = 'circle'
      nextZoom = 15
    } else {
      type = 'rectangle'
    }

    return { type, nextZoom }
  }

  //添加覆盖物
  renderOverlays = async id => {
    Toast.loading('拼命加载中...', 0)
    //获取数据
    const res = await this.$axios.get(`/area/map?id=${id}`)
    Toast.hide()

    const { type, nextZoom } = this.decideOverlaysType()

    res.data.body.forEach(item => {
      //渲染第一二级覆盖物
      if (type === 'circle') {
        this.renderOverlaysCircle(item, nextZoom)
      } else {
        //渲染第三级覆盖物
        this.renderOverlaysRectangle(item)
      }
    })
  }

  //第一二级覆盖物
  renderOverlaysCircle = (item, nextZoom) => {
    const {
      label: name,
      value: id,
      count,
      coord: { latitude, longitude }
    } = item

    // 每一个覆盖物,就要添加一个点
    //根据经纬度创建点
    var point = new BMap.Point(longitude, latitude)

    //创建选项
    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(35, -35) //设置文本偏移量
    }

    // 创建文本标注对象
    var label = new BMap.Label('', opts)

    //设置label的样式
    label.setStyle(labelStyle)

    // 设置内容
    label.setContent(`
        <div class=${styles.bubble}>
          <p class=${styles.name}>${name}</p>
          <p class=${styles.name}>${count}套</p>
        </div>
      `)

    //给label添加点击事件
    label.addEventListener('click', () => {
      //移除所有覆盖物
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)

      //重置地图中和缩放级别
      this.map.centerAndZoom(point, nextZoom)

      this.renderOverlays(id)
    })

    //添加到地图上
    this.map.addOverlay(label)
  }

  //第三级覆盖物
  renderOverlaysRectangle = item => {
    const {
      label: name,
      value: id,
      count,
      coord: { latitude, longitude }
    } = item

    // 每一个覆盖物,就要添加一个点
    //根据经纬度创建点
    var point = new BMap.Point(longitude, latitude)

    //创建选项
    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-50, -20) //设置文本偏移量
    }

    // 创建文本标注对象
    var label = new BMap.Label('', opts)

    //设置label的样式
    label.setStyle(labelStyle)

    // 设置内容
    label.setContent(`
    <div class=${styles.rect}>
        <span class=${styles.housename}>${name}</span>
        <span class=${styles.housenum}>${count}套</span>
        <i class='iconfont icon-arrow ${styles.arrow}'/>
    <div>
      `)
    //给label添加点击事件
    label.addEventListener('click', e => {
      if (!e || !e.changedTouches) return

      const { clientX, clientY } = e.changedTouches[0]
      const moveX = window.innerWidth / 2 - clientX
      const moveY = (window.innerHeight - 330 + 45) / 2 - clientY

      // 在地图上平移 x 和 y 像素
      this.map.panBy(moveX, moveY)

      // 显示房源列表面板
      this.setState({
        isShowHouseList: true
      })

      // 发送请求，获取房源列表
      this.getHouseListById(id)
    })
    this.map.addOverlay(label)
  }

  //获取房源列表数据
  getHouseListById = async id => {
    Toast.loading('拼命加载中...', 0)
    const res = await this.$axios.get(`/houses?cityId=${id}`)
    Toast.hide()
    this.setState({
      housingData: res.data.body.list
    })
  }

  //渲染房源列表
  renderHousingData = () => {
    const { isShowHouseList, housingData } = this.state

    return (
      <div
        className={classNames(styles.houseList, {
          [styles.show]: isShowHouseList
        })}
      >
        <div className={styles.titleWrap}>
          <div className={styles.listTitle}>房屋列表</div>
          <div className={styles.titleMore}>更多房源</div>
        </div>
        <div className={styles.houseItems}>
          {housingData.map(item => {
            return <HouseItem key={item.houseCode} {...item} /> //key={item.houseCode}
          })}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.map}>
        {/* 顶部栏 */}
        <NavHeader>地图找图</NavHeader>
        {/* 地图 */}
        <div id="container"></div>
        {/* 渲染房源列表 */}
        {this.renderHousingData()}
      </div>
    )
  }
}

/* //添加覆盖物
renderOverlays = async id => {
  //获取房源数据
  Toast.loading('拼命加载中...', 0)
  const result = await this.$axios.get(`/area/map?id=${id}`)
  Toast.hide()
  console.log(result.data.body)

  //添加第一级覆盖物
  result.data.body.forEach(item => {
    const {
      label: name,
      value,
      count,
      coord: { latitude, longitude }
    } = item

    // 每一个覆盖物,就要添加一个点
    //根据经纬度创建点
    var point = new BMap.Point(longitude, latitude)

    //创建选项
    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(35, -35) //设置文本偏移量
    }

    // 创建文本标注对象
    var label = new BMap.Label('', opts)

    //设置label的样式
    label.setStyle(labelStyle)

    // 设置内容
    label.setContent(`
     <div class=${styles.bubble}>
       <p class=${styles.name}>${name}</p>
       <p class=${styles.name}>${count}套</p>
     </div>
   `)

    //给label添加点击事件
    label.addEventListener('click', () => {
      //移除所有覆盖物
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)

      //重置地图中和缩放级别
      this.map.centerAndZoom(point, 13)

      //发送请求
      Toast.loading('拼命加载中...', 0)
      this.$axios.get(`/area/map?id=${value}`).then(res => {
        Toast.hide()

        //渲染第二级覆盖物
        res.data.body.forEach(item => {
          const {
            label: name,
            value,
            count,
            coord: { latitude, longitude }
          } = item

          // 每一个覆盖物,就要添加一个点
          //根据经纬度创建点
          var point = new BMap.Point(longitude, latitude)

          //创建选项
          var opts = {
            position: point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(35, -35) //设置文本偏移量
          }

          // 创建文本标注对象
          var label = new BMap.Label('', opts)

          //设置label的样式
          label.setStyle(labelStyle)

          // 设置内容
          label.setContent(`
     <div class=${styles.bubble}>
       <p class=${styles.name}>${name}</p>
       <p class=${styles.name}>${count}套</p>
     </div>
   `)
          //添加到地图上
          this.map.addOverlay(label)
        })
      })
    })
    //添加到地图上
    this.map.addOverlay(label)
  })
} */

// 将地址解析结果显示在地图上，并调整地图视野
// var myGeo = new BMap.Geocoder()
// myGeo.getPoint(
//   label,
//   function(point) {
//     if (point) {
//       map.centerAndZoom(point, 11)
//       map.addOverlay(new BMap.Marker(point)) //地图覆盖物
//       //添加地图控件
//       map.addControl(new BMap.NavigationControl()) //平移缩放控件、
//       map.addControl(new BMap.ScaleControl()) //一个比例尺控件
//       map.addControl(new BMap.MapTypeControl())
//     }
//   },
//   label
// )
