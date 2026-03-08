import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ModeSelectPage } from './pages/ModeSelectPage'
import { TalentPathPage } from './pages/TalentPathPage'
import { DecisionPage } from './pages/DecisionPage'
import { DemoPage } from './pages/DemoPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/app" element={<ModeSelectPage />} />
      <Route path="/app/talent-path" element={<TalentPathPage />} />
      <Route path="/app/decision" element={<DecisionPage />} />
      <Route path="/demo" element={<DemoPage />} />
    </Routes>
  )
}
