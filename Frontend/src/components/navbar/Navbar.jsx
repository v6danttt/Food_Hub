import React from 'react'
import './navbar.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { assets } from '../../assets/assests'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [menu, setMenu] = React.useState('home')

  React.useEffect(() => {
    if (location.pathname === '/') {
      if (location.hash === '#menu') {
        setMenu('menu')
      } else {
        setMenu('home')
      }
    }
  }, [location.pathname, location.hash])

  return (
    <header className='navbar'>
      <div className='navbar-left'>
        <img src={assets.foodHub} alt='Food Hub' className='navbar-logo' />
      </div>

      <nav className='navbar-menu'>
        <li onClick={() => navigate('/')} className={menu === 'home' ? 'active' : ''}>Home</li>
        <li onClick={() => navigate('/#menu')} className={menu === 'menu' ? 'active' : ''}>Menu</li>
        <li onClick={() => setMenu('about')} className={menu === 'about' ? 'active' : ''}>About</li>
        <li onClick={() => setMenu('mobile-app')} className={menu === 'mobile-app' ? 'active' : ''}>Mobile-app</li>
        <li onClick={() => setMenu('contact')} className={menu === 'contact' ? 'active' : ''}>Contact</li>
      </nav>

      <div className='navbar-right'>
        <button className='icon-button' aria-label='Search'>
          <img src={assets.seo} alt='Search' />
        </button>
        <button className='icon-button' aria-label='Cart'>
          <img src={assets.cart} alt='Cart' />
          <span className='cart-badge'>0</span>
        </button>
        <button className='signin-button'>Sign In</button>
      </div>
    </header>
  )
}

export default Navbar