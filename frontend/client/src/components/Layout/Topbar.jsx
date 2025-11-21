import { useState } from 'react'

function Topbar() {
  const [busqueda, setBusqueda] = useState('')
  return (
    <div className="topbar">
      <h1>GameTracker</h1>
      <div className="search-box">
        <input 
            type="text" 
            placeholder="Buscar..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
    </div>
  )
}

export default Topbar