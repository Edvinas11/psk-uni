import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CourseListPage from './pages/CourseListPage'
import CourseDetailPage from './pages/CourseDetailPage'
import EnrollPage from './pages/EnrollPage'
import CreateCoursePage from './pages/CreateCoursePage'
import EditCoursePage from './pages/EditCoursePage'
import DepartmentStatsPage from './pages/DepartmentStatsPage'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<CourseListPage />} />
          <Route path="/courses/create" element={<CreateCoursePage />} />
          <Route path="/courses/:id/edit" element={<EditCoursePage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/courses/:id/enroll" element={<EnrollPage />} />
          <Route path="/departments/stats" element={<DepartmentStatsPage />} />
        </Routes>
      </main>
    </div>
  )
}
