import React, { Component } from 'react'
import { Carousel } from 'antd-mobile'
import { BASE_URL } from '../../utils/url'

export default class index extends Component {
  state = {
    data: [],
    imgHeight: 212,
    isLoadingSwiper: false /* 加载轮播开关 */
  }
  componentDidMount() {
    this.getslideshowData()
  }

  async getslideshowData() {
    const result = await this.$axios.get('/home/swiper')
    this.setState({
      data: result.data.body,
      isLoadingSwiper: true
    })
  }

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

  render() {
    return (
      <div>
        {/* 渲染轮播图 */}
        {this.state.isLoadingSwiper && this.carousel()}
      </div>
    )
  }
}
