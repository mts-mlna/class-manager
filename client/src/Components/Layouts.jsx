import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './Global/Header'
import Table from './Pages/Table'
import Login from './Pages/Login'
import Home from './Pages/Home'
import Signup from './Pages/Signup'
import Classes from './Pages/Classes'
import CreateClass from './Pages/CreateClass'
import Messaging from './Pages/Messaging'

function Layouts() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/class/:id' element={<Table/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/classes' element={<Classes/>}/>
          <Route path='/classes/new' element={<CreateClass/>}/>
          <Route path="/classes/edit/:id" element={<CreateClass />} />
          <Route path="/messages" element={<Messaging />} />
        </Routes>
      </Router>
    </>
  )
}

export default Layouts
