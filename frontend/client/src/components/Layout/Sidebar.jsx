import { NavLink } from 'react-router-dom'
import inicioIcon from '../../assets/img/Inicio.png'
import tiendaIcon from '../../assets/img/Tienda.png'
import bibliotecaIcon from '../../assets/img/Biblioteca.png'
import perfilIcon from '../../assets/img/Perfil.png'
import ajustesIcon from '../../assets/img/ajustes.png'

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="top-icons">
        <NavLink to="/">
          <img src={inicioIcon} alt="Inicio" title="Inicio" />
        </NavLink>
        
        <NavLink to="/tienda">
          <img src={tiendaIcon} alt="Tienda" title="Tienda" />
        </NavLink>
        
        <NavLink to="/biblioteca">
          <img src={bibliotecaIcon} alt="Biblioteca" title="Biblioteca" />
        </NavLink>
        
        <NavLink to="/perfil">
          <img src={perfilIcon} alt="Perfil" title="Perfil" />
        </NavLink>
      </div>

      <div className="bottom-icons">
        <NavLink to="/ajustes">
          <img src={ajustesIcon} alt="Ajustes" title="Ajustes" />
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
