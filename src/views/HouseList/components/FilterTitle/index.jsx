import React from 'react'
import styles from './index.module.scss'
import { Flex } from 'antd-mobile'
import classNames from 'classnames'

const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

function FilterTitle({ titleSelectedSadus, onTitleChange }) {
  return (
    <Flex className={styles.root} align="center">
      {titleList.map(item => {
        //判断是否选中
        const isSelected = titleSelectedSadus[item.type]
        return (
          <Flex.Item key={item.type} onClick={() => onTitleChange(item.type)}>
            <span
              className={classNames(styles.dropdown, {
                [styles.selected]: isSelected
              })}
            >
              <span>{item.title}</span>
              <i className="iconfont icon-arrow"></i>
            </span>
          </Flex.Item>
        )
      })}
    </Flex>
  )
}

//暴露
export default FilterTitle
