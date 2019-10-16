import React from 'react'
import { withRouter } from 'react-router'
import { NavBar } from 'antd-mobile'
import styles from './index.module.scss'
import PropTypes from 'prop-types'

function NavHeader({ history, children }) {
  return (
    <NavBar
      className={styles.navBar}
      mode="dark"
      icon={<i className="iconfont icon-back"></i>}
      onLeftClick={() => history.goBack()}
    >
      {children}
    </NavBar>
  )
}

//约束父组件传过来的值的类型
NavHeader.propTypes = {
  children: PropTypes.string.isRequired
}

export default withRouter(NavHeader)
