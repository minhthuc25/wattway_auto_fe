import Catalog from './pages/Catalog.jsx'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import { useAuth } from './auth.jsx'
import { api, setToken } from './api.js'
import VehicleDetails from './pages/VehicleDetails.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Account from './pages/Account.jsx'

export default function App() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
    async function handleLogout() {
      try {
        await api('DELETE', '/api/sessions/current')
      } catch {
      }
      setToken(null)
      setUser(null)
      navigate('/')
    }
  let accountLinks
  if (user) {
    accountLinks = (
      <span>
        Hello, {user.firstName}
        {' | '}
        <Link to="/account">Account</Link>
        {' | '}
        <button onClick={handleLogout}>Log out</button>
      </span>
    )
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
          <Link to="/cart">Cart</Link>
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
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<p>Page not found. <Link to="/">Back to vehicles</Link></p>} />
        </Routes>
      </main>
    </div>
  )
}