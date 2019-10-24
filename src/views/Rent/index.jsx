import React, { Component } from 'react'
import styles from './index.module.scss'
import NavHeader from '../../components/NavHeader'

export default class Rent extends Component {
  render() {
    return (
      <div className={styles.root}>
        <NavHeader>我的出租列表</NavHeader>
      </div>
    )
  }
}
