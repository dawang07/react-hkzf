import React from 'react'

//引入高阶组件,可以使用history
import { withRouter } from 'react-router'

import { Flex } from 'antd-mobile'

import styles from './index.module.scss'

import PropTypes from 'prop-types'

import classNames from 'classnames'

function SearchHeader({ cityName, history, className }) {
  return (
    <div className={classNames(styles.root, className)}>
      <Flex>
        <Flex className={styles.searchLeft}>
          <div
            onClick={() => history.push('/cityList')}
            className={styles.location}
          >
            <span>{cityName}</span>
            <i className="iconfont icon-arrow"></i>
          </div>

          <div className={styles.searchForm}>
            <i className="iconfont icon-search"></i>
            <span>请输入小区或地址</span>
          </div>
        </Flex>

        <i
          className="iconfont icon-map"
          onClick={() => history.push('/map')}
        ></i>
      </Flex>
    </div>
  )
}

//约束父组件传过来的值的类型
SearchHeader.propTypes = {
  cityName: PropTypes.string.isRequired
}

export default withRouter(SearchHeader)
