import React, { Component } from 'react'
import styles from './index.module.scss'
import FilterFooter from '../FilterFooter'
import classNames from 'classnames'

export default class FilterMore extends Component {
  constructor({ defaultValue }) {
    super()
    this.state = {
      houseTraitList: defaultValue //筛选选中的
    }
  }
  renderItem = data => {
    return (
      <>
        {data.map(item => {
          //判断是否选中
          const isSelected = this.state.houseTraitList.includes(item.value)
          return (
            <span
              className={classNames(styles.tag, {
                [styles.tagActive]: isSelected
              })}
              key={item.value}
              onClick={() => this.designate(item.value)}
            >
              {item.label}
            </span>
          )
        })}
      </>
    )
  }

  //设置选中高亮
  designate = value => {
    let { houseTraitList } = this.state

    if (houseTraitList.includes(value)) {
      houseTraitList = houseTraitList.filter(item => item !== value)
    } else {
      houseTraitList.push(value)
    }

    this.setState({
      houseTraitList
    })
  }

  render() {
    const {
      data: { characteristic, floor, oriented, roomType },
      onCancel,
      onConfirm
    } = this.props
    const { houseTraitList } = this.state
    return (
      <div className={styles.root}>
        {/* 遮罩 */}
        <div className={styles.mask} onClick={onCancel}></div>
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderItem(roomType)}</dd>
            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderItem(oriented)}</dd>
            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderItem(floor)}</dd>
            <dt className={styles.dt}>特点</dt>
            <dd className={styles.dd}>{this.renderItem(characteristic)}</dd>
          </dl>
        </div>

        <div className={styles.footer}>
          <FilterFooter
            countermand="清除"
            onCancel={() => this.setState({ houseTraitList: [] })}
            onConfirm={() => onConfirm('more', houseTraitList)}
          />
        </div>
      </div>
    )
  }
}
