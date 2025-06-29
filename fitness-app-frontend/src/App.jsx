import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ActivityProvider } from './contexts/ActivityContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Activities from './pages/Activities'
import AddActivity from './pages/AddActivity'
import Recommendations from './pages/Recommendations'
import Profile from './pages/Profile'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <ActivityProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="activities" element={<Activities />} />
            <Route path="activities/add" element={<AddActivity />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </ActivityProvider>
    </AuthProvider>
  )
}

export default App 