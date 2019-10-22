import React from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

//导入虚拟化长列表的样式
import 'react-virtualized/styles.css'

//全局导入字体图标
import './assets/fonts/iconfont.css'

import Home from './views/Home'
import Login from './views/Login'
import CityList from './views/CityList'
import Map from './views/Map'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/cityList" component={CityList} />
          <Route path="/map" component={Map} />
          <Redirect exact from="/" to="/home" />
        </Switch>
      </div>
    </Router>
  )
}

export default App
