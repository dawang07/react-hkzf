import React from 'react'
import { withRouter } from 'react-router'
import { NavBar } from 'antd-mobile'
import styles from './index.module.scss'

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

export default withRouter(NavHeader)
