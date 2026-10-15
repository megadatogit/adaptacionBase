import React, { useState } from "react"
import HeaderPaciente from "./HeaderPaciente"
import SelectorEntrada from "./SelectorEntrada"
import TablaRegistros from "./TablaRegistros"
import PanelGraficas from "./PanelGraficas"
import ResumenClinicoFooter from "./ResumenClinicoFooter"
import styles from "../../css/Bitacora.module.css"

const LayBitacora = () => {
  const [paciente] = useState({
    nombre: "Nombre del Paciente",
    ufm: "UFM ´14",
    nss: "12345678901",
    consultorio: "1",
    turno: "TM",
    edad: 45,
    peso: 78,
    talla: 1.75,
    tipoSangre: "O+"
  })

  const [registros, setRegistros] = useState([
    { id: 1, isoString: "2026-09-01T02:30:00Z", valor: "132/91", frecuenciaCardiaca: 88, alerta: "subio" },
    { id: 2, isoString: "2026-09-02T03:15:00Z", valor: "125/83", frecuenciaCardiaca: 82, alerta: "bajo" },
    { id: 3, isoString: "2026-09-03T02:30:00Z", valor: "122/81", frecuenciaCardiaca: 79, alerta: "bajo" },
    { id: 4, isoString: "2026-09-30T02:30:00Z", valor: "122/81", frecuenciaCardiaca: 60, alerta: "neutro" },
    { id: 5, isoString: "2026-10-01T02:30:00Z", valor: "120/80", frecuenciaCardiaca: 76, alerta: "subio" },
    { id: 6, isoString: "2026-10-02T03:15:00Z", valor: "118/79", frecuenciaCardiaca: 72, alerta: "bajo" },
    { id: 7, isoString: "2026-10-03T02:30:00Z", valor: "122/81", frecuenciaCardiaca: 80, alerta: "subio" },
    { id: 8, isoString: "2026-10-04T01:45:00Z", valor: "125/83", frecuenciaCardiaca: 84, alerta: "subio" },
    { id: 9, isoString: "2026-10-05T02:30:00Z", valor: "121/80", frecuenciaCardiaca: 75, alerta: "bajo" },
    { id: 10, isoString: "2026-10-06T03:15:00Z", valor: "117/76", frecuenciaCardiaca: 81, alerta: "subio" },
    { id: 11, isoString: "2026-10-07T02:30:00Z", valor: "122/81", frecuenciaCardiaca: 78, alerta: "subio" }
  ])

  const [hoveredId, setHoveredId] = useState(null)

  const handleAgregarRegistro = (nuevo) => {
    setRegistros([nuevo, ...registros])
  }

  return (
    <section className={styles.LayBitacora}>
      <HeaderPaciente paciente={paciente} />
      <SelectorEntrada onAgregarRegistro={handleAgregarRegistro} />
      
      <div className={styles.cuerpoPrincipalDashboard}>
        <TablaRegistros
          registros={registros}
          hoveredId={hoveredId}
          onHoverRow={setHoveredId}
        />
        <PanelGraficas
          registros={registros}
          hoveredId={hoveredId}
          onHoverPoint={setHoveredId}
        />
      </div>

      <ResumenClinicoFooter 
        registros={registros} 
        tratamiento="Enalapril 10 mg c/24 hrs + Restricción sódica" 
      />
    </section>
  )
}

export default LayBitacora