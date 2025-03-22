import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import SignUp from './STUDENTS/SignUp'
import NewUpload from './STUDENTS/NewUpload'
import Profile from './STUDENTS/Profile'
import Search from './HR/Search'
import Data from './HR/Data'
import List from './STUDENTS/List'

const App = () => {
  return (
    <Routes>
      {/* students */}
      <Route path="/" element={<Home />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/new-upload" element={<NewUpload/>} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/cert/:studentId" element={<List/>} />
      {/* HR */}
      <Route path="/search" element={<Search />} />
      <Route path="/data" element={<Data />} />
    </Routes>
  )
}

export default App