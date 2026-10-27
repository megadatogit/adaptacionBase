import { useEffect, useRef } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import styles from "../../css/Bitacora.module.css"
import { agregarCambiosMes, calcularIndicadoresPresion, obtenerFecha, obtenerHora, obtenerPresion, ordenarRegistrosVisualmente } from "./registroUtils"

const TablaRegistros = ({ registros = [], hoveredId, selectedId, scrollToSelected, onHoverRow, onSelectRow }) => {
  const scrollRef = useRef(null)
  const selectedRowRef = useRef(null)
  const indicadores = calcularIndicadoresPresion(registros)
  const registrosConMes = agregarCambiosMes(ordenarRegistrosVisualmente(registros))

  useEffect(() => {
    if (selectedId == null || !scrollToSelected || !scrollRef.current || !selectedRowRef.current) return

    const contenedor = scrollRef.current
    const fila = selectedRowRef.current
    const destino = fila.offsetTop - (contenedor.clientHeight - fila.offsetHeight) / 2
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    contenedor.scrollTo({ top: Math.max(0, destino), behavior: reduceMotion ? "auto" : "smooth" })
  }, [selectedId, scrollToSelected])

  const renderAlerta = (indicador) => {
    const simbolos = { subio: "▲", bajo: "▼", igual: "=", neutral: "—" }
    const claseEstado = indicador.estado === "fuera-rango"
      ? styles.alertaFueraRango
      : indicador.estado === "en-rango"
        ? styles.alertaEnRango
        : styles.alertaNeutro

    return (
      <span
        className={`${styles.badgeAlerta} ${claseEstado}`}
        title={indicador.descripcion}
        aria-label={indicador.descripcion}
      >
        {simbolos[indicador.direccion]}
      </span>
    )
  }

  return (
    <div className={styles.contenedorTablaRegistros}>
      <div className={styles.headerTablaTitulo}>
        <h3>REGISTROS</h3>
      </div>

      <div className={styles.tablaHeaderGrid}>
        <span>Fecha de registro</span>
        <span>Brazo izquierdo</span>
        <span>Brazo derecho</span>
        <span>Frecuencia cardíaca</span>
        <span>Umbral de alerta</span>
      </div>

      <div ref={scrollRef} className={styles.cuerpoTablaScroll} role="listbox" aria-label="Registros de presión arterial">
        {registrosConMes.map(({ registro: reg, iniciaMes, etiquetaMes }) => {
          const fechaObj = obtenerFecha(reg)
          const diaSemanaStr = format(fechaObj, "EEEE", { locale: es })
          const diaNumStr = format(fechaObj, "dd")
          const hora = obtenerHora(reg)
          const horaStr = hora ? `${hora} hrs` : ""
          const izquierda = obtenerPresion(reg, "izquierdo")
          const derecha = obtenerPresion(reg, "derecho")
          const indicador = indicadores.get(reg)
          const isHovered = hoveredId === reg.id
          const isSelected = selectedId === reg.id

          const handleKeyDown = (evento) => {
            if (evento.key === "Enter" || evento.key === " ") {
              evento.preventDefault()
              onSelectRow && onSelectRow(reg.id)
            }
          }

          return (
            <div
              key={reg.id}
              ref={isSelected ? selectedRowRef : null}
              className={`${styles.filaRegistro} ${iniciaMes ? styles.filaCambioMes : ""} ${isHovered ? styles.filaHovered : ""} ${isSelected ? styles.filaSeleccionada : ""}`}
              data-mes={iniciaMes ? etiquetaMes : undefined}
              role="option"
              tabIndex={0}
              aria-selected={isSelected}
              onMouseEnter={() => onHoverRow && onHoverRow(reg.id)}
              onMouseLeave={() => onHoverRow && onHoverRow(null)}
              onClick={() => onSelectRow && onSelectRow(reg.id)}
              onKeyDown={handleKeyDown}
            >
              <div className={styles.celdaFecha}>
                <span className={styles.diaTexto}>{diaSemanaStr} {diaNumStr}</span>
                <span className={styles.horaTexto}>{horaStr}</span>
              </div>
              <div className={styles.celdaValor}>{izquierda?.valor || ""}</div>
              <div className={styles.celdaValor}>{derecha?.valor || ""}</div>
              <div className={styles.celdaValor}>
                {reg.frecuenciaCardiaca != null ? `${reg.frecuenciaCardiaca} bpm` : ""}
              </div>
              <div className={styles.celdaAlerta}>
                {renderAlerta(indicador)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TablaRegistros
