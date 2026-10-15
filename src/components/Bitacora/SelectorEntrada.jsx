import React, { useState } from "react"
import styles from "../../css/Bitacora.module.css"

const SelectorEntrada = ({ onAgregarRegistro }) => {
  // Estado para alternar entre "manual" y "dispositivo"
  const [tipoModo, setTipoModo] = useState("manual")

  // Estados locales para los valores del registro manual (sliders/inputs)
  const [sistolica, setSistolica] = useState(120)
  const [diastolica, setDiastolica] = useState(80)
  const [frecuencia, setFrecuencia] = useState(72)
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState("")

  const handleSubmitManual = (e) => {
    e.preventDefault()
    // Generamos un registro con fecha actual ISO de ejemplo o la seleccionada
    const nuevoRegistro = {
      id: Date.now(),
      isoString: new Date().toISOString(),
      valor: `${sistolica}/${diastolica}`,
      frecuenciaCardiaca: frecuencia,
      tipo: "manual"
    }
    if (onAgregarRegistro) onAgregarRegistro(nuevoRegistro)
  }

  return (
    <div className={styles.contenedorEntrada}>
      {/* Pestañas o selectores de tipo de entrada */}
      <div className={styles.tabsEntrada}>
        <button
          type="button"
          className={`${styles.tabBtn} ${tipoModo === "manual" ? styles.tabActivo : ""}`}
          onClick={() => setTipoModo("manual")}
        >
          <span className={styles.iconoTab}>🧮</span> Registro manual
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${tipoModo === "dispositivo" ? styles.tabActivo : ""}`}
          onClick={() => setTipoModo("dispositivo")}
        >
          <span className={styles.iconoTab}>🔌</span> Conexión a recurso (USB / SD)
        </button>
      </div>

      {/* Contenido según el modo seleccionado */}
      <div className={styles.cuerpoEntrada}>
        {tipoModo === "manual" ? (
          <form onSubmit={handleSubmitManual} className={styles.formManual}>
            <div className={styles.bloqueInputsScroll}>
              <div className={styles.controlGrupo}>
                <label>Sistólica</label>
                <input
                  type="number"
                  value={sistolica}
                  onChange={(e) => setSistolica(Number(e.target.value))}
                  min="70"
                  max="200"
                />
                <span className={styles.unidadMedida}>mmHg</span>
              </div>

              <div className={styles.controlGrupo}>
                <label>Diastólica</label>
                <input
                  type="number"
                  value={diastolica}
                  onChange={(e) => setDiastolica(Number(e.target.value))}
                  min="40"
                  max="130"
                />
                <span className={styles.unidadMedida}>mmHg</span>
              </div>

              <div className={styles.controlGrupo}>
                <label>Frecuencia</label>
                <input
                  type="number"
                  value={frecuencia}
                  onChange={(e) => setFrecuencia(Number(e.target.value))}
                  min="40"
                  max="180"
                />
                <span className={styles.unidadMedida}>bpm</span>
              </div>
            </div>

            <button type="submit" className={styles.btnGuardarLectura}>
              Guardar Lectura
            </button>
          </form>
        ) : (
          <div className={styles.panelDispositivo}>
            <div className={styles.infoConexion}>
              <p>Conecta el tensiómetro mediante puerto USB, inserta la tarjeta SD o vincula vía Bluetooth.</p>
              <div className={styles.selectorPuerto}>
                <select
                  value={dispositivoSeleccionado}
                  onChange={(e) => setDispositivoSeleccionado(e.target.value)}
                  className={styles.selectDevice}
                >
                  <option value="">Selecciona dispositivo detectado...</option>
                  <option value="usb">Dispositivo USB Directo (/dev/ttyUSB0)</option>
                  <option value="sd">Tarjeta SD (Directorio /DCIM/BP_DATA)</option>
                  <option value="bluetooth">Tensiómetro Bluetooth BLE (OMRON_HEM7360)</option>
                </select>
                <button
                  type="button"
                  className={styles.btnSincronizar}
                  disabled={!dispositivoSeleccionado}
                >
                  📥 Descargar y Sincronizar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SelectorEntrada