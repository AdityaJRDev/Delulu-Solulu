import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './screens/Landing'
import Create from './screens/Create'
import Invite from './screens/Invite'
import Play from './screens/Play'
import Report from './screens/Report'
import CastGallery from './screens/CastGallery'
import NotFound from './screens/NotFound'

function Ambient() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block">
      <div className="absolute -left-40 top-[-10%] h-[520px] w-[520px] rounded-full bg-maroon-700/40 blur-[120px]" />
      <div className="absolute -right-32 top-[20%] h-[480px] w-[480px] rounded-full bg-gold-600/20 blur-[130px]" />
      <div className="absolute bottom-[-20%] left-1/3 h-[560px] w-[560px] rounded-full bg-teal-700/25 blur-[150px]" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-[100dvh] w-full bg-ink-950">
        <Ambient />
        <div className="relative mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-ink-950 sm:my-[3dvh] sm:h-[min(880px,94dvh)] sm:rounded-[40px] sm:border sm:border-white/10 sm:shadow-[0_60px_160px_-40px_rgba(0,0,0,0.95)]">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/create" element={<Create />} />
            <Route path="/invite/:id" element={<Invite />} />
            <Route path="/play/:id" element={<Play />} />
            <Route path="/report/:id" element={<Report />} />
            <Route path="/cast" element={<CastGallery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
