import React, { Component } from 'react'
import styles from './index.module.scss'
import NavHeader from '../../components/NavHeader'
import { WingBlank, Flex, Toast } from 'antd-mobile'
import { setToken } from '../../utils/token'
import { Form, Field, withFormik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { axios } from '../../utils/axios'

class Login extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className={styles.root}>
        <NavHeader className={styles.navHeader}>登录页面</NavHeader>
        <WingBlank>
          <Form>
            <div className={styles.formSubmit}>
              <Field
                placeholder="请输入账号"
                type="text"
                name="username"
                className={styles.input}
              />
              <ErrorMessage
                name="username"
                component="div"
                className={styles.error}
              />
            </div>
            <div className={styles.formSubmit}>
              <Field
                placeholder="请输入密码"
                type="password"
                name="password"
                className={styles.input}
              />
              <ErrorMessage
                name="password"
                component="div"
                className={styles.error}
              />
            </div>
            <div className={styles.formSubmit}>
              <input type="submit" className={styles.submit} name="" id="" />
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>还没有账号,去注册~~~</Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

//正则表达式
const USERNAME_REGEX = /^[a-zA-Z0-9]{5,8}$/
const PASSWORD_REGEX = /^[a-zA-Z0-9]{5,12}$/

const EnhancedForm = withFormik({
  mapPropsToValues: () => ({ username: 'test2', password: 'test2' }),

  //校检
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .required('账号不能为空')
      .matches(USERNAME_REGEX, '必须是5-8位'),

    password: Yup.string()
      .required('密码不能为空')
      .matches(PASSWORD_REGEX, '必须是5-12位')
  }),

  //处理提交请求
  handleSubmit: async (values, { props }) => {
    const result = await axios.post('/user/login', values) //发送请求,获取token

    const { body, description, status } = result.data

    if (status === 200) {
      setToken(body.token) //存入本地
      // props.history.goBack()
      if (props.location.state) {
        props.history.replace(props.location.state.from.pathname)
      } else {
        props.history.goBack()
      }
    } else {
      Toast.info(description, 2)
    }
  }
})(Login)

export default EnhancedForm
