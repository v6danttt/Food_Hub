import React, { useContext, useEffect, useState } from 'react'
import './header.css'
import banner from '../../assets/food_web_banner_29.jpg'
import { storecontext } from '../../context/storecontext'

const Header = () => {
  const { menuItems, searchOpen, setSearchOpen } = useContext(storecontext)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }
    const q = query.toLowerCase()
    setResults(menuItems.filter((m) => m.name.toLowerCase().includes(q)))
  }, [query, menuItems])

  return (
    <div className='header' style={{ backgroundImage: `url(${banner})` }}>
      <div className='header-overlay'>
        <div className='header-contents'>
          <h2>Order Your Favorite Food Here</h2>
          <p>Choose from our wide variety of delicious dishes crafted with the finest ingredients.</p>
          <button>View Menu</button>
        </div>

        {searchOpen && (
          <div className='search-overlay' onClick={() => setSearchOpen(false)}>
            <div className='search-box' onClick={(e) => e.stopPropagation()}>
              <div className='search-row'>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Search foods, drinks, snacks...'
                  className='search-input'
                />
                <button className='search-close' onClick={() => setSearchOpen(false)}>Close</button>
              </div>

              <ul className='search-results'>
                {results.length === 0 && query && <li className='no-result'>No results</li>}
                {results.map((item) => (
                  <li key={item.id} className='search-item'>
                    <strong>{item.name}</strong>
                    <span className='item-type'>{item.type}</span>
                    <span className='item-price'>₹{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header