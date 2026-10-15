import React from "react"
import styles from "../../css/Bitacora.module.css"

const ResumenClinicoFooter = ({ registros = [], tratamiento = "Enalapril 10 mg c/24 hrs" }) => {
  // Cálculo matemático básico de promedios basado en los registros actuales
  const calcularPromedios = () => {
    if (registros.length === 0) return { sistolica: 0, diastolica: 0, fc: 0 }

    let sumaSis = 0
    let sumaDias = 0
    let sumaFc = 0

    registros.forEach((reg) => {
      const [sis, dias] = reg.valor.split("/").map(Number)
      sumaSis += sis
      sumaDias += dias
      sumaFc += reg.frecuenciaCardiaca || 0
    })

    return {
      sistolica: Math.round(sumaSis / registros.length),
      diastolica: Math.round(sumaDias / registros.length),
      fc: Math.round(sumaFc / registros.length)
    }
  }

  const promedio = calcularPromedios()

  return (
    <footer className={styles.contenedorFooterClinico}>
      <div className={styles.cardResumenItem}>
        <span className={styles.footerLabel}>Promedio Presión (Global/Semanal)</span>
        <span className={styles.footerValorDestacado}>
          {promedio.sistolica} / {promedio.diastolica} <small>mmHg</small>
        </span>
      </div>

      <div className={styles.cardResumenItem}>
        <span className={styles.footerLabel}>Frecuencia Cardíaca Media</span>
        <span className={styles.footerValor}>
          {promedio.fc} <small>bpm</small>
        </span>
      </div>

      <div className={styles.cardResumenItemTratamiento}>
        <span className={styles.footerLabel}>Medicación / Tratamiento Actual</span>
        <span className={styles.footerValorTratamiento}>
          💊 {tratamiento}
        </span>
      </div>
    </footer>
  )
}

export default ResumenClinicoFooter