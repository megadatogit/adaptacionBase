import styles from "../../css/Bitacora.module.css"
import { obtenerPresion } from "./registroUtils"

const ResumenClinicoFooter = ({ registros = [], tratamiento = "Sin medicamentos" }) => {
  // Cálculo matemático básico de promedios basado en los registros actuales
  const calcularPromedios = () => {
    const presiones = registros.flatMap((reg) => [
      obtenerPresion(reg, "izquierdo"),
      obtenerPresion(reg, "derecho")
    ]).filter(Boolean)
    const frecuencias = registros
      .map((reg) => reg.frecuenciaCardiaca)
      .filter((valor) => Number.isFinite(valor))

    const sumaSis = presiones.reduce((total, presion) => total + presion.sistolica, 0)
    const sumaDias = presiones.reduce((total, presion) => total + presion.diastolica, 0)
    const sumaFc = frecuencias.reduce((total, frecuencia) => total + frecuencia, 0)

    return {
      sistolica: presiones.length ? Math.round(sumaSis / presiones.length) : null,
      diastolica: presiones.length ? Math.round(sumaDias / presiones.length) : null,
      fc: frecuencias.length ? Math.round(sumaFc / frecuencias.length) : null
    }
  }

  const promedio = calcularPromedios()

  return (
    <footer className={styles.contenedorFooterClinico}>
      <div className={styles.cardResumenItem}>
        <span className={styles.footerLabel}>Promedio Presión Global</span>
        <span className={styles.footerValorDestacado}>
          {promedio.sistolica != null ? `${promedio.sistolica} / ${promedio.diastolica}` : "Sin datos"} <small>mmHg</small>
        </span>
      </div>

      <div className={styles.cardResumenItem}>
        <span className={styles.footerLabel}>Frecuencia Cardíaca Media</span>
        <span className={styles.footerValor}>
          {promedio.fc ?? "Sin datos"} <small>bpm</small>
        </span>
      </div>

      <div className={styles.cardResumenItemTratamiento}>
        <span className={styles.footerLabel}>Medicación / Tratamiento Actual</span>
        <span className={styles.footerValorTratamiento}>{tratamiento}</span>
      </div>
    </footer>
  )
}

export default ResumenClinicoFooter
