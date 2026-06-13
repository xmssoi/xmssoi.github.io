import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Timeline from './pages/Timeline'
import Statistics from './pages/Statistics'
import Search from './pages/Search'
import Admin from './pages/Admin'
import { DataProvider } from './context/DataContext'
import './App.css'

function App() {
  return (
    <Router>
      <DataProvider>
        <div className="app">
          <nav className="navbar">
            <div className="nav-brand">双十中学信息学竞赛</div>
            <div className="nav-links">
              <Link to="/">首页</Link>
              <Link to="/timeline">时间轴</Link>
              <Link to="/statistics">统计分析</Link>
              <Link to="/search">学生查询</Link>
              <Link to="/admin">数据统计</Link>
            </div>
          </nav>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/search" element={<Search />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <footer className="footer">
            <p>双十中学信息学竞赛发展史 (1985-2025)</p>
          </footer>
        </div>
      </DataProvider>
    </Router>
  )
}

export default App