import React, { useState } from 'react'
import Layouts from './Components/Layouts'
import { AuthProvider } from "./context/AuthContext";

function App() {

  return (
    <AuthProvider>
      <Layouts />
    </AuthProvider>
  )
}

export default App
