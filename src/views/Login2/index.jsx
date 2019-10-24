import React, { Component } from 'react'
import styles from './index.module.scss'
import NavHeader from '../../components/NavHeader'
import { WingBlank, Flex, Toast } from 'antd-mobile'
import { setToken } from '../../utils/token'

export default class Index extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: ''
    }
  }

  //input值改变事件
  handleChange = e => {
    //赋值给模型
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  //点击提交按钮
  login = async e => {
    e.preventDefault()
    const result = await this.$axios.post('/user/login', this.state)

    console.log(result)

    const { description, body, status } = result.data

    if (status === 200) {
      setToken(body.token)
      this.props.history.goBack()
    } else {
      Toast.info(description, 2)
      this.setState({
        username: '',
        password: ''
      })
    }
  }

  render() {
    const { username, password } = this.state
    return (
      <div className={styles.root}>
        <NavHeader className={styles.navHeader}>登录页面</NavHeader>
        <WingBlank>
          <form onSubmit={this.login}>
            <div className={styles.formSubmit}>
              <input
                placeholder="请输入账号"
                type="text"
                value={username}
                name="username"
                className={styles.input}
                onChange={this.handleChange}
              />
            </div>
            <div className={styles.formSubmit}>
              <input
                placeholder="请输入密码"
                type="password"
                value={password}
                name="password"
                className={styles.input}
                onChange={this.handleChange}
              />
            </div>
            <div className={styles.formSubmit}>
              <input type="submit" className={styles.submit} name="" id="" />
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>还没有账号,去注册~~~</Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}
