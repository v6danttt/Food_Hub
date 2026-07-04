import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import './home.css'
import Header from '../../components/Header/header'
import ExploreMenu from '../../components/explore menu/exploremenu'
import { storecontext } from '../../context/storecontext'
import { assets } from '../../assets/assests'

const Home = () => {
  const location = useLocation()
  const { aboutInfo } = useContext(storecontext)

  React.useEffect(() => {
    if (location.hash === '#menu') {
      const menuSection = document.getElementById('menu')
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else if (location.hash === '#about') {
      const aboutSection = document.getElementById('about')
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else if (location.hash === '#mobile-app') {
      const mobileAppSection = document.getElementById('mobile-app')
      if (mobileAppSection) {
        mobileAppSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else if (location.hash === '#contact') {
      const contactSection = document.getElementById('contact')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [location.hash])

  return (
    <div>
      <Header />
      <ExploreMenu />

      <section id='about' className='about-section'>
        <div className='about-card'>
          <div className='about-text'>
            <h2>{aboutInfo.title}</h2>
            <p>{aboutInfo.description}</p>
            <p>
              Food Hub was created to make ordering delicious meals simple, fast,
              and enjoyable for everyone.
            </p>
          </div>

          <div className='review-box'>
            <h3>What our customers say</h3>
            <div className='review-list'>
              {aboutInfo.reviews.map((review, index) => (
                <div key={index} className='review-item'>
                  <img src={assets.delivaryMan} alt='review' />
                  <p>{review}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='contact-section' id='contact'>
        <div className='contact-card'>
          <h2>Contact Us</h2>
          <p>We are always happy to hear from you.</p>

          <div className='contact-info'>
            <div>
              <strong>Email</strong>
              <p>{aboutInfo.email}</p>
            </div>
            <div>
              <strong>Phone</strong>
              <p>{aboutInfo.phone}</p>
            </div>
            <div>
              <strong>Address</strong>
              <p>{aboutInfo.address}</p>
            </div>
          </div>
        </div>
      </section>

      <section className='mobile-app-section' id='mobile-app'>
        <div className='mobile-app-card'>
          <div className='mobile-app-content'>
            <span className='mobile-badge'>Our Mobile App</span>
            <h2>Order your favorite food in seconds</h2>
            <p>
              Food Hub makes food ordering easy with fast delivery, simple checkout,
              and a smooth experience from your phone.
            </p>

            <div className='feature-list'>
              <div className='feature-item'>⚡ Fast delivery</div>
              <div className='feature-item'>📱 Easy ordering</div>
              <div className='feature-item'>⭐ Favorite meals saved</div>
            </div>
          </div>

          <div className='mobile-app-visual'>
            <img src={assets.delivaryMan} alt='Food delivery app preview' />
            <div className='mini-card'>
              <h4>About Us</h4>
              <p>We bring delicious meals closer to your doorstep with care and speed.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
