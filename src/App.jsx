import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Header, Footer, WhatsAppFab } from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Courses from './pages/Courses.jsx'
import Course from './pages/Course.jsx'
import Book from './pages/Book.jsx'
import { Category, City, Destinations, Calendar } from './pages/Listings.jsx'
import { ForTeams, Advisory, About, Contact, Faq, Legal } from './pages/Info.jsx'
import Admin from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) { document.getElementById(hash.slice(1))?.scrollIntoView(); return }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const admin = pathname.startsWith('/admin')
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<Course />} />
          <Route path="/book/:slug" element={<Book />} />
          <Route path="/categories/:slug" element={<Category />} />
          <Route path="/cities/:slug" element={<City />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/for-teams" element={<ForTeams />} />
          <Route path="/advisory" element={<Advisory />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy" element={<Legal kind="privacy" />} />
          <Route path="/terms" element={<Legal kind="terms" />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {!admin && <WhatsAppFab />}
    </>
  )
}
