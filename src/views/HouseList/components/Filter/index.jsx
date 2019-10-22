import React, { Component } from 'react'
import styles from './index.module.scss'
import { getCurrentCity } from '../../../../utils/city'

//导入子组件
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

export default class Filter extends Component {
  constructor() {
    super()

    this.state = {
      titleSelectedSadus: {
        //字体是否高亮
        area: false,
        mode: false,
        price: false,
        more: false
      },
      openType: '', //记录打开的是哪个类型
      filterData: {}, //区域,方式,租金渲染的数据
      selectValues: {
        //区域,方式,租金的数据的初始值
        area: ['area', 'null'],
        mode: ['null'],
        price: ['null'],
        more: []
      }
    }
  }

  async componentDidMount() {
    const { value } = await getCurrentCity()
    this.getRenderDta(value)
  }

  //获取区域,方式,租金渲染所需的数据
  async getRenderDta(value) {
    const res = await this.$axios.get(`houses/condition?id=${value}`)
    // console.log(res.data.body)
    this.setState({
      filterData: res.data.body
    })
  }

  //点击取消的处理方法
  onCancel = () => {
    this.setState(
      {
        openType: ''
      },
      () => {
        this.changeTitleSelectedStatus()
      }
    )
  }

  //点击确定的处理方法
  onConfirm = (type, value) => {
    const { selectValues } = this.state
    this.setState(
      {
        openType: '',
        selectValues: { ...selectValues, [type]: value } //重新给selectValues赋值
      },
      () => {
        this.changeTitleSelectedStatus()

        const { selectValues } = this.state
        const filter = {}

        //处理区域和地铁
        const key = selectValues['area'][0]
        if (selectValues[key].length === 2) {
          filter[key] = null
        } else if (selectValues[key].length === 3) {
          filter[key] =
            selectValues['area'][2] === 'null'
              ? selectValues['area'][1]
              : selectValues['area'][2]
        }

        //处理方式(整租&合租)
        filter.rentType = selectValues['mode'][0]

        //处理租金
        filter.price = selectValues['price'][0]

        //处理筛选
        filter.more = selectValues['more'].join(',')

        //给父组件传值
        this.props.onFilter && this.props.onFilter(filter)
      }
    )
  }

  //渲染FilterPicker子组件
  renderFilterPicker = () => {
    const {
      openType,
      filterData: { area, subway, rentType, price },
      selectValues
    } = this.state

    if (openType === '' || openType === 'more') return null

    //需要传递给FilterPicker子组件的值
    let data = null
    let cols = 1
    let defaultValue = selectValues[openType]
    switch (openType) {
      case 'area':
        cols = 3
        data = [area, subway]
        break

      case 'mode':
        data = rentType
        break

      case 'price':
        data = price
        break

      default:
        break
    }
    return (
      <FilterPicker
        data={data}
        cols={cols}
        defaultValue={defaultValue}
        type={openType}
        onCancel={this.onCancel}
        onConfirm={this.onConfirm}
      />
    )
  }

  //渲染FilterMore子组件
  renderFilterMore = () => {
    const {
      selectValues,
      openType,
      filterData: { characteristic, floor, oriented, roomType }
    } = this.state

    const defaultValue = selectValues['more']
    const data = { characteristic, floor, oriented, roomType }
    if (openType === 'more') {
      return (
        <FilterMore
          defaultValue={defaultValue}
          data={data}
          onCancel={this.onCancel}
          onConfirm={this.onConfirm}
        />
      )
    } else {
      return null
    }
  }

  //处理FilterTitle子组件传过来的值
  onTitleChange = type => {
    const { titleSelectedSadus } = this.state
    //赋值给模型
    this.setState(
      {
        openType: type,
        titleSelectedSadus: { ...titleSelectedSadus, [type]: true }
      },
      () => {
        this.changeTitleSelectedStatus(type)
      }
    )
  }

  //控制是否高亮  (判断是否有数据,有数据就高亮)
  changeTitleSelectedStatus = type => {
    const { titleSelectedSadus, selectValues } = this.state

    Object.keys(titleSelectedSadus).forEach(item => {
      switch (item) {
        case 'area':
          titleSelectedSadus[item] = selectValues[item][1] !== 'null'
          break
        case 'mode':
          titleSelectedSadus[item] = selectValues[item][0] !== 'null'
          break
        case 'price':
          titleSelectedSadus[item] = selectValues[item][0] !== 'null'
          break
        case 'more':
          titleSelectedSadus[item] = selectValues[item].length > 0
          break
        default:
          break
      }
    })

    //判断是否在点击
    if (type) {
      titleSelectedSadus[type] = true
    }

    this.setState({
      titleSelectedSadus
    })
  }

  //加载遮罩
  renderShade = () => {
    const { openType } = this.state

    //如果没有点击或者点击筛选返回null
    if (openType === '' || openType === 'more') return null

    return <div className={styles.mask} onClick={this.onCancel}></div>
  }

  render() {
    const { titleSelectedSadus } = this.state
    return (
      <div className={styles.root}>
        {/* 遮罩 */}
        {this.renderShade()}
        <div className={styles.content}>
          <FilterTitle
            titleSelectedSadus={titleSelectedSadus}
            onTitleChange={this.onTitleChange}
          />
          {/* FilterPicker */}
          {this.renderFilterPicker()}
          {/* FilterMore */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
