import React from 'react'
import NavBar from '../component/NavBar'
import UserDashboard from '../component/UserDashboard'
import Footer from '../component/Footer'
import RecruiterDashboard from '../component/RecruiterDashboard'


// import {setLoading, setUser } from '../redux/features/AuthSlice'
import { useSelector } from 'react-redux'



export default function DashBoard() {
  const user = useSelector((state) => state.auth.user)
  const role = user?.role


  
  return (
    <div>
      <NavBar/>
     <UserDashboard/>
      <Footer/>
    
    </div>
  )
}
