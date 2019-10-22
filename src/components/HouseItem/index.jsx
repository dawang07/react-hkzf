import React from 'react'
import styles from './index.module.scss'
import { BASE_URL } from '../../utils/url'
import classNames from 'classnames'

function HouseItem({ desc, houseCode, houseImg, price, tags, title }) {
  return (
    <div className={styles.house}>
      <div className={styles.imgWrap}>
        <img src={`${BASE_URL}${houseImg}`} alt="" className={styles.img} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.desc}>{desc}</div>
        {tags.map((item, index) => {
          const tagName = `tag${(index % 3) + 1}`
          return (
            <span
              key={item}
              className={classNames(styles.tag, styles[tagName])}
            >
              {item}
            </span>
          )
        })}
        <div className={styles.price}>{price}元/月</div>
      </div>
    </div>
  )
}

//暴露
export default HouseItem
