
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Index from './pages/Index'
import TripManagement from './pages/TripManagement'
import TripDetails from './pages/TripDetails'
import B2BCollection from './pages/B2BCollection'
import NotFound from './pages/NotFound'
import { Toaster } from './components/ui/toaster'
import { ThemeProvider } from './components/theme-provider'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/b2b-collection" element={<B2BCollection />} />
          <Route path="/trip-management" element={<TripManagement />} />
          <Route path="/trip-management/details/:id" element={<TripDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
