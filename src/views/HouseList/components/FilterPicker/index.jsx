import React, { Component } from 'react'
import { PickerView } from 'antd-mobile'

//导入子组件
import FilterFooter from '../FilterFooter'

export default class FilterPicker extends Component {
  constructor({ defaultValue }) {
    super()
    this.state = {
      value: defaultValue
    }
  }

  //父组件传递过来的值发生变化时触发
  componentWillReceiveProps(props) {
    this.setState({
      value: props.defaultValue
    })
  }

  onChange = value => {
    console.log(value)
    this.setState({
      value
    })
  }
  render() {
    const { data, cols, type, onCancel, onConfirm } = this.props
    const { value } = this.state
    return (
      <div>
        <PickerView
          data={data} //数据源
          cols={cols} //显示的列数
          value={value} //初始显示的值
          onChange={this.onChange} //选中后的回调
        />

        <FilterFooter
          onCancel={onCancel}
          onConfirm={() => onConfirm(type, value)}
        />
      </div>
    )
  }
}
