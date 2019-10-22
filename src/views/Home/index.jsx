import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { TabBar } from 'antd-mobile'

//导入子组件
import Index from '../Index'
import HouseList from '../HouseList'
import News from '../News'
import Profile from '../Profile'

//导入sass样式
import styles from './index.module.scss'

//导入字体图标
import '../../assets/fonts/iconfont.css'

export default class Home extends Component {
  //构造器
  constructor(props) {
    super(props)
    this.state = {
      //选中高亮
      selectedTab: this.props.location.pathname
    }
  }

  //底部导航栏样式数据
  TABS = [
    {
      title: '首页',
      icon: 'icon-index',
      path: '/home'
    },
    {
      title: '找房',
      icon: 'icon-findHouse',
      path: '/home/houseList'
    },
    {
      title: '资讯',
      icon: 'icon-info',
      path: '/home/news'
    },
    {
      title: '我的',
      icon: 'icon-my',
      path: '/home/profile'
    }
  ]

  //底部导航栏方法
  bottomTabBar = () => {
    return (
      <TabBar
        unselectedTintColor="#949494"
        tintColor="blue"
        barTintColor="white"
      >
        {this.TABS.map(item => {
          return (
            <TabBar.Item
              title={item.title}
              key={item.path}
              icon={<i className={`iconfont ${item.icon}`}></i>}
              selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
              selected={this.state.selectedTab === item.path}
              //点击突变触发
              onPress={() => {
                // this.setState({
                //   selectedTab: item.path
                // })
                //编程式导航
                if (this.props.location.pathname !== item.path) {
                  this.props.history.push(item.path)
                }
              }}
            ></TabBar.Item>
          )
        })}
      </TabBar>
    )
  }

  // 组件初始化时不调用，组件更新完成后调用 参数prevProps 就是上一个页面的props
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }

  render() {
    return (
      <div className={styles.home}>
        {/* 嵌套分页路由 */}

        <Route exact path="/home" component={Index} />
        <Route path="/home/houseList" component={HouseList} />
        <Route path="/home/news" component={News} />
        <Route path="/home/profile" component={Profile} />

        {/* TabBar:底部标签栏 */}
        <div className={styles.tabbar}></div>
        {this.bottomTabBar()}
      </div>
    )
  }
}
