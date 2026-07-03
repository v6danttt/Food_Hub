import React from 'react'
import { useLocation } from 'react-router-dom'
import './home.css'
import Header from '../../components/Header/header'
import ExploreMenu from '../../components/explore menu/exploremenu'

const Home = () => {
  const location = useLocation()

  React.useEffect(() => {
    if (location.hash === '#menu') {
      const menuSection = document.getElementById('menu')
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [location.hash])

  return (
    <div>
      <Header />
      <ExploreMenu />
    </div>
  )
}

export default Home
