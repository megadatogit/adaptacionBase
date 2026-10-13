import styles from "./css/App.module.css"
import Fecha from "./components/Fecha"

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
