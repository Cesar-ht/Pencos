import Sidebar from './Sidebar'
import Topbar from './Topbar'

function Layout({ children }) {
  return (
    <>
      <Sidebar />
      
      <div className="main-content">
        <Topbar />
        
        <div className="content">
          {children}
        </div>
      </div>
    </>
  )
}

export default Layout