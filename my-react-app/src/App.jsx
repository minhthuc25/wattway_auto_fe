import Catalog from './pages/Catalog.jsx'
import { Routes, Route, Link } from 'react-router-dom'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import { useAuth } from './auth.jsx'

export default function App() {
  const { user } = useAuth()
  let accountLinks = null
  if (user) {
    accountLinks = <span>Hello, {user.firstName}</span>
  } else {
    accountLinks = (
      <span>
        <Link to="/register">Register</Link>
        {' | '}
        <Link to="/login">Log in</Link>
      </span>
    )
  }
  return (
    <div>
      <header>
        <h1>Wattway Auto</h1>
        <nav>
          <Link to="/">Vehicles</Link>
          {' | '}
          {accountLinks}
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