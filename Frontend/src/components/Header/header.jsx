import React from 'react'
import './header.css'
import banner from '../../assets/food_web_banner_29.jpg'

const Header = () => {
  return (
    <div className='header' style={{ backgroundImage: `url(${banner})` }}>
      <div className='header-overlay'>
        <div className='header-contents'>
          <h2>Order Your Favorite Food Here</h2>
          <p>Choose from our wide variety of delicious dishes crafted with the finest ingredients.</p>
          <button>View Menu</button>
        </div>
      </div>
    </div>
  )
}

export default Header