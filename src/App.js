import React from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

//全局导入字体图标
import './assets/fonts/iconfont.css'

import Home from './views/Home'
import Login from './views/Login'
import CityList from './views/CityList'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/cityList" component={CityList} />
          <Redirect exact from="/" to="/home" />
        </Switch>
      </div>
    </Router>
  )
}

export default App
