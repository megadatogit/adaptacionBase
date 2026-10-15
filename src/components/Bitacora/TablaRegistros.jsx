import React from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import styles from "../../css/Bitacora.module.css"

const TablaRegistros = ({ registros = [], hoveredId, onHoverRow }) => {
  // Función auxiliar para ordenar o agrupar registros por mes si se desea, 
  // o podemos procesarlos directamente manteniendo la estructura de tu wireframe.
  
  // Renderiza el indicador de umbral (triángulo y color)
  const renderAlerta = (alerta) => {
    if (alerta === "subio") {
      return <span className={`${styles.badgeAlerta} ${styles.alertaSubio}`}>▲</span>
    }
    if (alerta === "bajo") {
      return <span className={`${styles.badgeAlerta} ${styles.alertaBajo}`}>▼</span>
    }
    return <span className={`${styles.badgeAlerta} ${styles.alertaNeutro}`}>—</span>
  }

  return (
    <div className={styles.contenedorTablaRegistros}>
      <div className={styles.headerTablaTitulo}>
        <h3>REGISTROS</h3>
      </div>

      <div className={styles.tablaHeaderGrid}>
        <span>Fecha de registro</span>
        <span>Sistólica</span>
        <span>Diastólica</span>
        <span>Frecuencia cardíaca</span>
        <span>Umbral de alerta</span>
      </div>

      <div className={styles.cuerpoTablaScroll}>
        {registros.map((reg) => {
          const fechaObj = parseISO(reg.isoString)
          const nombreMesAnio = format(fechaObj, "MMMM yyyy", { locale: es }).toUpperCase()
          const diaSemanaStr = format(fechaObj, "EEEE", { locale: es })
          const diaNumStr = format(fechaObj, "dd")
          const horaStr = format(fechaObj, "HH:mm 'hrs'")
          
          const [sistolica, diastolica] = reg.valor.split("/")
          const isHovered = hoveredId === reg.id

          return (
            <div
              key={reg.id}
              className={`${styles.filaRegistro} ${isHovered ? styles.filaHovered : ""}`}
              onMouseEnter={() => onHoverRow && onHoverRow(reg.id)}
              onMouseLeave={() => onHoverRow && onHoverRow(null)}
            >
              <div className={styles.celdaFecha}>
                <span className={styles.diaTexto}>{diaSemanaStr} {diaNumStr}</span>
                <span className={styles.horaTexto}>{horaStr}</span>
              </div>
              <div className={styles.celdaValor}>{sistolica}</div>
              <div className={styles.celdaValor}>{diastolica}</div>
              <div className={styles.celdaValor}>{reg.frecuenciaCardiaca} bpm</div>
              <div className={styles.celdaAlerta}>
                {renderAlerta(reg.alerta)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TablaRegistros