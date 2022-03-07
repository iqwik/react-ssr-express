import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import loadable from '@loadable/component'

import '@assets/styles/main.scss'

const Home = loadable(() => import('./pages/home' /* webpackChunkName: "pages-home" */))
const About = loadable(() => import('./pages/about' /* webpackChunkName: "pages-about" */))

const App: React.FC = () => {
  return (
    <div>
      <nav>
        <h2>Navigation</h2>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  )
}

export default App
