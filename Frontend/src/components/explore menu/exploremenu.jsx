import React from 'react'
import './exploremenu.css'
import { assets } from '../../assets/assests'

const menuItems = [
  {
    id: 1,
    title: 'Classic Burger',
    category: 'Burgers',
    description: 'Juicy beef patty with cheese, lettuce, and tomato on a soft bun.',
    price: '$8.99',
    image: assets.burger,
  },
  {
    id: 2,
    title: 'Pepperoni Pizza',
    category: 'Pizza',
    description: 'Crispy crust with melted mozzarella, pepperoni, and savory tomato sauce.',
    price: '$12.49',
    image: assets.pizza,
  },
  {
    id: 3,
    title: 'Crispy French Fries',
    category: 'Sides',
    description: 'Golden fries seasoned perfectly with a side of dipping sauce.',
    price: '$4.99',
    image: assets.frenchFries,
  },
  {
    id: 4,
    title: 'Fresh Salad Bowl',
    category: 'Salads',
    description: 'Mixed greens, fresh veggies, and a light dressing for a healthy choice.',
    price: '$7.99',
    image: assets.salad,
  },
  {
    id: 5,
    title: 'Grilled Sandwich',
    category: 'Sandwiches',
    description: 'Warm toasted sandwich with savory fillings and melted cheese.',
    price: '$9.50',
    image: assets.sandwich,
  },
  {
    id: 6,
    title: 'Sweet Waffles',
    category: 'Desserts',
    description: 'Fluffy waffles topped with syrup and fresh fruit.',
    price: '$6.99',
    image: assets.waffles,
  },
]

const categories = ['All', 'Burgers', 'Pizza', 'Sides', 'Salads', 'Sandwiches', 'Desserts']

const ExploreMenu = () => {
  const [activeCategory, setActiveCategory] = React.useState('All')

  const filteredItems = activeCategory === 'All'
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory)

  return (
    <section id='menu' className='explore-menu'>
      <div className='menu-intro'>
        <span>Our Menu</span>
        <h2>Explore Delicious Meals</h2>
        <p>Choose from a hand-picked selection of dishes designed to satisfy every craving.</p>
      </div>

      <div className='menu-filters'>
        {categories.map((category) => (
          <button
            key={category}
            type='button'
            className={category === activeCategory ? 'filter-button active' : 'filter-button'}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className='menu-grid'>
        {filteredItems.map((item) => (
          <article key={item.id} className='menu-card'>
            <div className='menu-card-image'>
              <img src={item.image} alt={item.title} />
            </div>
            <div className='menu-card-content'>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className='menu-card-footer'>
                <span className='menu-price'>{item.price}</span>
                <button type='button'>Add to Cart</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ExploreMenu
