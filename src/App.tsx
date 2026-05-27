import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AuthCallbackPage } from './pages/AuthCallbackPage'
import { AboutPage } from './pages/AboutPage'
import { BuildingDetailPage } from './pages/BuildingDetailPage'
import { CheckinMapPage } from './pages/CheckinMapPage'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'
import { LibraryPage } from './pages/LibraryPage'
import { MuseumPage } from './pages/MuseumPage'
import { PatternGeneratorPage } from './pages/PatternGeneratorPage'
import { ProfilePage } from './pages/ProfilePage'
import { QuizPage } from './pages/QuizPage'
import { RestorePage } from './pages/RestorePage'
import { StructurePage } from './pages/StructurePage'

export default function App() {
  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/login" element={<Navigate to="/profile?view=login" replace />} />
      <Route path="/register" element={<Navigate to="/profile?view=register" replace />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/library/:id" element={<BuildingDetailPage />} />
        <Route path="/museum" element={<MuseumPage />} />
        <Route path="/checkin" element={<CheckinMapPage />} />
        <Route path="/pattern" element={<PatternGeneratorPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/structure" element={<StructurePage />} />
        <Route path="/restore" element={<RestorePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
