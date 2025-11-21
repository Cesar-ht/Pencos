export function AjustesComponent() {
  const handleCambiarTema = (e) => {
    const tema = e.target.value
    document.body.classList.remove('tema-oscuro', 'tema-claro')
    document.body.classList.add(`tema-${tema}`)
  }

  return (
    <>
      <h2>Ajustes</h2>
      <h4>Configuración de la aplicación</h4>
      
      <div style={{ marginTop: '30px', maxWidth: '600px' }}>
        <div className="settings-item">
          <div>
            <h4 style={{ marginBottom: '5px' }}>Tema</h4>
            <p style={{ fontSize: '12px' }}>Cambia entre tema claro y oscuro</p>
          </div>
          <select className="settings-select" onChange={handleCambiarTema}>
            <option value="oscuro">Oscuro</option>
            <option value="claro">Claro</option>
          </select>
        </div>
      </div>
    </>
  )
}
export default AjustesComponent