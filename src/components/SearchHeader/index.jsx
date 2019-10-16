import React from 'react'

//引入高阶组件,可以使用history
import { withRouter } from 'react-router'

import { Flex } from 'antd-mobile'

import styles from './index.module.scss'

import PropTypes from 'prop-types'

function SearchHeader({ cityName, history }) {
  return (
    <div className={styles.root}>
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

        <i className="iconfont icon-map "></i>
      </Flex>
    </div>
  )
}

//约束父组件传过来的值的类型
SearchHeader.propTypes = {
  cityName: PropTypes.string.isRequired
}

export default withRouter(SearchHeader)
