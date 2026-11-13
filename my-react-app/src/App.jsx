import Catalog from './pages/Catalog.jsx'
import { Routes, Route, Link } from 'react-router-dom'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'

export default function App() {
  return (
    <div>
      <header>
        <h1>Wattway Auto</h1>
        <nav>
          <Link to="/">Vehicles</Link>
          {' | '}
          <Link to="/register">Register</Link>
          {' | '}
          <Link to="/login">Log in</Link>
          <hr />
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<p>Page not found. <Link to="/">Back to vehicles</Link></p>} />
        </Routes>
      </main>
    </div>
  )
}