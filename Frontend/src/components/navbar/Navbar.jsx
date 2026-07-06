import React, { useContext } from 'react'
import './navbar.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { assets } from '../../assets/assests'
import { storecontext } from '../../context/storecontext'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [menu, setMenu] = React.useState('home')
  const { searchOpen, setSearchOpen } = useContext(storecontext)

  React.useEffect(() => {
    if (location.pathname === '/') {
      if (location.hash === '#menu') {
        setMenu('menu')
      } else if (location.hash === '#about') {
        setMenu('about')
      } else if (location.hash === '#mobile-app') {
        setMenu('mobile-app')
      } else if (location.hash === '#contact') {
        setMenu('contact')
      } else {
        setMenu('home')
      }
    }
  }, [location.pathname, location.hash])

  const scrollToSection = (sectionId, menuName) => {
    setMenu(menuName)
    navigate(`/#${sectionId}`)
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleAboutClick = () => {
    scrollToSection('about', 'about')
  }

  const handleMobileAppClick = () => {
    scrollToSection('mobile-app', 'mobile-app')
  }

  const handleContactClick = () => {
    scrollToSection('contact', 'contact')
  }

  return (
    <header className='navbar'>
      <div className='navbar-left'>
        <img src={assets.foodHub} alt='Food Hub' className='navbar-logo' />
      </div>

      <nav className='navbar-menu'>
        <li onClick={() => navigate('/')} className={menu === 'home' ? 'active' : ''}>Home</li>
        <li onClick={() => scrollToSection('menu', 'menu')} className={menu === 'menu' ? 'active' : ''}>Menu</li>
        <li onClick={handleAboutClick} className={menu === 'about' ? 'active' : ''}>About</li>
        <li onClick={handleMobileAppClick} className={menu === 'mobile-app' ? 'active' : ''}>Mobile-app</li>
        <li onClick={handleContactClick} className={menu === 'contact' ? 'active' : ''}>Contact</li>
      </nav>

      <div className='navbar-right'>
        <button
          className='icon-button'
          aria-label='Search'
          onClick={() => setSearchOpen((v) => !v)}
          aria-expanded={searchOpen}
        >
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