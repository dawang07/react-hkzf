import React, { Component } from 'react'
import { Carousel } from 'antd-mobile'
import styles from './index.module.scss'
import { BASE_URL } from '../../utils/url'
import SearchHeader from '../../components/SearchHeader'
import { Flex, Grid, WingBlank } from 'antd-mobile'
import images1 from '../../assets/images/nav-1.png'
import images2 from '../../assets/images/nav-2.png'
import images3 from '../../assets/images/nav-3.png'
import images4 from '../../assets/images/nav-4.png'

export default class index extends Component {
  state = {
    data: [],
    imgHeight: 212,
    isLoadingSwiper: false /* 加载轮播开关 */,
    tenementData: [], //租房小组数据
    latestNews: [] //最新资讯数据
  }
  componentDidMount() {
    this.getslideshowData()
    this.getTenementData()
    this.getLatestNews()
  }

  //获取轮播图数据
  async getslideshowData() {
    const result = await this.$axios.get('/home/swiper')
    this.setState({
      data: result.data.body,
      isLoadingSwiper: true
    })
  }

  //渲染轮播图
  carousel() {
    return (
      <Carousel autoplay infinite>
        {this.state.data.map(item => (
          <a
            key={item.id}
            href="http://www.alipay.com"
            style={{
              display: 'inline-block',
              width: '100%',
              height: this.state.imgHeight
            }}
          >
            <img
              src={`${BASE_URL}${item.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'))
                this.setState({ imgHeight: 'auto' })
              }}
            />
          </a>
        ))}
      </Carousel>
    )
  }

  //租房导航数据
  nav = [
    { icon: images1, text: '整租', path: '/home/list' },
    { icon: images2, text: '合租', path: '/home/list' },
    { icon: images3, text: '地图找房', path: '/map' },
    { icon: images4, text: '去出租', path: '/rent/add' }
  ]

  //渲染租房导航
  tenementNav() {
    return (
      <Flex className={styles.nav}>
        {this.nav.map(item => {
          return (
            <Flex.Item key={item.text}>
              <img src={item.icon} alt="" />
              <p>{item.text}</p>
            </Flex.Item>
          )
        })}
      </Flex>
    )
  }

  //获得租房小组数据
  async getTenementData() {
    const tenementData = await this.$axios.get(
      '/home/groups?area=AREA%7C88cff55c-aaa4-e2e0'
    )
    // console.log(tenementData)
    // 赋值给模型
    this.setState({
      tenementData: tenementData.data.body
    })
  }

  //渲染租房小组
  renderTenement() {
    return (
      <div className={styles.groups}>
        <Flex justify="between">
          <Flex.Item>
            <h3 className={styles.title}>租房小组</h3>
          </Flex.Item>
          <Flex.Item align="end">
            <span>更多</span>
          </Flex.Item>
        </Flex>
        {/* 宫格样式 */}
        <Grid
          data={this.state.tenementData}
          columnNum={2}
          hasLine={false}
          square={false}
          renderItem={dataItem => {
            return (
              <div className={styles.navItem}>
                <div className={styles.left}>
                  <p>{dataItem.title}</p>
                  <p>{dataItem.desc}</p>
                </div>
                <img
                  className={styles.right}
                  src={`${BASE_URL}${dataItem.imgSrc}`}
                  alt=""
                />
              </div>
            )
          }}
        />
      </div>
    )
  }

  //获取租房最新资讯数据
  async getLatestNews() {
    const latestNews = await this.$axios.get(
      '/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
    )
    // console.log(latestNews)
    //赋值给模型
    this.setState({
      latestNews: latestNews.data.body
    })
  }

  //渲染租房最新资讯
  renderLatestNews() {
    return (
      <div className={styles.news}>
        <h3 className={styles.groupTitle}>最新资讯</h3>
        {this.state.latestNews.map(item => {
          return (
            <WingBlank size="md" className={styles.newsItem} key={item.id}>
              <div className={styles.imgWrap}>
                <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
              </div>
              <Flex
                direction="column"
                justify="between"
                className={styles.content}
              >
                <h3 className={styles.title}>{item.title}</h3>
                <Flex className={styles.info} justify="between">
                  <span>{item.from}</span>
                  <span>{item.date}</span>
                </Flex>
              </Flex>
            </WingBlank>
          )
        })}
      </div>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 渲染顶部搜索框 */}
        <div>
          <SearchHeader cityName="深圳" />
        </div>
        {/* 渲染轮播图 */}
        <div className={styles.swiper}>
          {this.state.isLoadingSwiper && this.carousel()}
        </div>
        {/* 渲染租房导航 */}
        <div>{this.tenementNav()}</div>
        {/* 渲染租房小组 */}
        <div>{this.renderTenement()}</div>
        {/* 渲染租房最新资讯 */}
        <div>{this.renderLatestNews()}</div>
      </div>
    )
  }
}
