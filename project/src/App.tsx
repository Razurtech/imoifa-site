import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Books from './components/Books'
import Shop from './components/Shop'
import Directory from './components/Directory'
import Blog from './components/Blog'
import Testimonial from './components/Testimonial'
import Footer from './components/Footer'

function App() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <Navbar isDark={isDark} toggleDarkMode={toggleDarkMode} />
      <Hero />
      <Books />
      <Shop />
      <Directory />
      <Blog />
      <Testimonial />
      <Footer />
    </div>
  )
}

export default App