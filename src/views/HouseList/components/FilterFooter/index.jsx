import React from 'react'
import styles from './index.module.scss'
import { Flex } from 'antd-mobile'
import classNames from 'classnames'

function FilterFooter({ countermand, onCancel, onConfirm }) {
  return (
    <Flex className={styles.root}>
      <span
        className={classNames(styles.cancel, styles.btn)}
        onClick={onCancel}
      >
        {countermand}
      </span>
      <span className={classNames(styles.ok, styles.btn)} onClick={onConfirm}>
        确定
      </span>
    </Flex>
  )
}

FilterFooter.defaultProps = {
  countermand: '取消'
}

//暴露
export default FilterFooter
