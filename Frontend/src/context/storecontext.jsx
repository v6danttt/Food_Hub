import { createContext, useMemo, useState } from 'react'

export const storecontext = createContext()

const StoreContextProvider = ({ children }) => {
  const [menuItems] = useState([
    { id: 1, name: 'Burger', type: 'food', price: 120 },
    { id: 2, name: 'Pizza', type: 'food', price: 180 },
    { id: 3, name: 'Pasta', type: 'food', price: 140 },
    { id: 4, name: 'Coke', type: 'drink', price: 50 },
    { id: 5, name: 'Lemon Tea', type: 'drink', price: 60 },
    { id: 6, name: 'Fries', type: 'snack', price: 80 },
    { id: 7, name: 'Sandwich', type: 'food', price: 110 },
    { id: 8, name: 'Momos', type: 'snack', price: 90 }
  ])

  const [aboutInfo] = useState({
    title: 'About Food Hub',
    description: 'We serve tasty food, fresh drinks, and quick snacks with fast delivery.',
    email: 'support@foodhub.com',
    phone: '+91 98765 43210',
    address: 'Mumbai, India',
    reviews: [
      'Amazing burgers and fast service!',
      'Fresh drinks and tasty snacks.',
      'Best food delivery experience.'
    ]
  })

  const [searchOpen, setSearchOpen] = useState(false)

  const foods = useMemo(() => menuItems.filter((item) => item.type === 'food'), [menuItems])
  const drinks = useMemo(() => menuItems.filter((item) => item.type === 'drink'), [menuItems])
  const snacks = useMemo(() => menuItems.filter((item) => item.type === 'snack'), [menuItems])

  const contextValue = { menuItems, foods, drinks, snacks, aboutInfo, searchOpen, setSearchOpen }

  return (
    <storecontext.Provider value={contextValue}>
      {children}
    </storecontext.Provider>
  )
}

export default StoreContextProvider
