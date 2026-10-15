import React from "react"
import styles from "../../css/Bitacora.module.css"

const HeaderPaciente = ({ paciente }) => {
  const { nombre, ufm, nss, consultorio, turno, edad, peso, talla, tipoSangre } = paciente
  const imc = (peso / (talla * talla)).toFixed(1)

  const obtenerClasificacionImc = (valor) => {
    if (valor < 18.5) return "Bajo peso"
    if (valor < 25) return "Normal"
    if (valor < 30) return "Sobrepeso"
    return "Obesidad"
  }

  return (
    <header className={styles.headerContainer}>
      <div className={styles.seccionAdmin}>
        <h1 className={styles.tituloBitacora}>BITÁCORA DE PRESIÓN</h1>
        <h2 className={styles.nombrePaciente}>{nombre}</h2>
        <div className={styles.detallesAdmin}>
          <span><strong>UFM:</strong> {ufm}</span>
          <span><strong>NSS:</strong> {nss}</span>
          <span><strong>Consultorio:</strong> {consultorio} {turno}</span>
        </div>
      </div>

      <div className={styles.seccionClinica}>
        <div className={styles.cardDato}>
          <span className={styles.label}>Edad</span>
          <span className={styles.valor}>{edad} <small>años</small></span>
        </div>
        <div className={styles.cardDato}>
          <span className={styles.label}>Peso</span>
          <span className={styles.valor}>{peso} <small>kg</small></span>
        </div>
        <div className={styles.cardDato}>
          <span className={styles.label}>Altura</span>
          <span className={styles.valor}>{talla} <small>m</small></span>
        </div>
        <div className={styles.cardDato}>
          <span className={styles.label}>IMC</span>
          <span className={styles.valor}>{imc} <small>({obtenerClasificacionImc(imc)})</small></span>
        </div>
        <div className={styles.cardDato}>
          <span className={styles.label}>Tipo Sangre</span>
          <span className={styles.valorDestacado}>{tipoSangre}</span>
        </div>
      </div>
    </header>
  )
}

export default HeaderPaciente