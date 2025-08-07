import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Registration from './pages/Registration.jsx'
import Home from './pages/Home.jsx'
import DashBoard from './pages/DashBoard.jsx'
import Login from './pages/Login.jsx'
import Jobs from './pages/Jobs.jsx'
import PostJobForm from './component/PostJobForm.jsx'
import RecruiterDashboard from './component/RecruiterDashboard.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/signup' element={<Registration />} />
        <Route path='/dashboard' element={<DashBoard/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/jobs' element={<Jobs/>}/>
        <Route path='/postjob' element={<PostJobForm/>}/>
        <Route path='/myposts' element={<RecruiterDashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}
