import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import EventListPage from './pages/EventListPage'
import EventDetailPage from './pages/EventDetailPage'
import RegisterPage from './pages/RegisterPage'
import CreateEventPage from './pages/CreateEventPage'
import EditEventPage from './pages/EditEventPage'
import CategoryStatsPage from './pages/CategoryStatsPage'
import DemoPage from './pages/DemoPage'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<EventListPage />} />
          <Route path="/events/create" element={<CreateEventPage />} />
          <Route path="/events/:id/edit" element={<EditEventPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/events/:id/register" element={<RegisterPage />} />
          <Route path="/categories/stats" element={<CategoryStatsPage />} />
          <Route path="/demo" element={<DemoPage />} />
        </Routes>
      </main>
    </div>
  )
}
