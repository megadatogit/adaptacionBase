import styles from "./css/App.module.css"
import LayBitacora from "./components/Bitacora/LayBitacora"

function App() {
  

  return (
    <>
      <div className={`${styles.App} flex-center `}>
        <LayBitacora />
      </div>
    </>
  )
}

export default App
