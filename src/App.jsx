import styles from "./css/App.module.css"
import Fecha from "./components/Bitacora/VistaPresion"

function App() {
  

  return (
    <>
      <div className={`${styles.App} flex-center container `}>
        <Fecha />
      </div>
    </>
  )
}

export default App
