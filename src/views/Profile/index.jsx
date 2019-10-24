import React, { Component } from 'react'
import styles from './index.module.scss'
import { BASE_URL } from '../../utils/url'
import { Button, Grid, Modal, Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import { removeToken } from '../../utils/token'

const alert = Modal.alert

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', icon: 'icon-coll', to: '/' },
  { id: 2, name: '我的出租', icon: 'icon-index', to: '/rent' },
  { id: 3, name: '看房记录', icon: 'icon-record', to: '/' },
  {
    id: 4,
    name: '成为房主',
    icon: 'icon-identity',
    to: '/'
  },
  { id: 5, name: '个人资料', icon: 'icon-myinfo', to: '/' },
  { id: 6, name: '联系我们', icon: 'icon-cust', to: '/' }
]

export default class Profile extends Component {
  constructor() {
    super()
    this.state = {
      nickImg: '/img/profile/avatar.png',
      nickName: '游客',
      isLogin: false
    }
  }

  //点击脱出按钮事件
  logout = () => {
    alert('提示', '确认退出吗', [
      { text: '取消', onPress: () => {} },
      {
        text: '确认',
        onPress: () => {
          removeToken()
          this.setState({
            nickImg: '/img/profile/avatar.png',
            nickName: '游客',
            isLogin: false
          })
        }
      }
    ])
  }

  //点击我的出租
  // rent = () => {
  //   const isAut = isAuthenticated()
  //   console.log(isAut)
  // if (isAut) {
  //   this.props.history.push('/rent')
  // } else {
  //   alert('提示', '您尚未登录,需要登录才能查看', [
  //     { text: '取消', onPress: () => {} },
  //     {
  //       text: '去登录',
  //       onPress: () => {
  //         this.props.history.push('/rent')
  //       }
  //     }
  //   ])
  // }
  // }

  componentDidMount() {
    this.getUserInfo()
  }

  //获取用户信息数据
  getUserInfo = async () => {
    Toast.loading('...', 0)
    const result = await this.$axios.get('/user')
    Toast.hide()
    console.log(result)
    const { avatar, nickname } = result.data.body

    //赋值给模型
    this.setState({
      nickImg: avatar,
      nickName: nickname,
      isLogin: true
    })
  }

  render() {
    const { nickImg, nickName, isLogin } = this.state
    return (
      <>
        <div className={styles.title}>
          <img
            src={`${BASE_URL}/img/profile/bg.png`}
            className={styles.bg}
            alt=""
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img
                src={`${BASE_URL}${nickImg}`}
                className={styles.avatar}
                alt=""
              />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>{nickName}</div>
              {isLogin ? (
                <>
                  <div className={styles.auth}>
                    <span onClick={this.logout}>退出</span>
                  </div>
                  <div className={styles.edit}>
                    <span>编辑个人资料</span>
                    <span className={styles.arrow}>
                      <i className="iconfont icon-arrow"></i>
                    </span>
                  </div>
                </>
              ) : (
                <div className={styles.edit}>
                  <Button
                    size="small"
                    type="primary"
                    inline
                    onClick={() => this.props.history.push('/login')}
                  >
                    去登录
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 菜单项 */}
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          square={false}
          renderItem={dataItem => (
            <Link to={dataItem.to}>
              <div className={styles.menuItem}>
                <i className={`iconfont ${dataItem.icon}`}></i>
                <span>{dataItem.name}</span>
              </div>
            </Link>
          )}
        />
      </>
    )
  }
}
