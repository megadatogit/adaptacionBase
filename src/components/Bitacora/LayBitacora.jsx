import { useState } from "react"
import HeaderPaciente from "./HeaderPaciente"
import SelectorEntrada from "./SelectorEntrada"
import TablaRegistros from "./TablaRegistros"
import PanelGraficas from "./PanelGraficas"
import ResumenClinicoFooter from "./ResumenClinicoFooter"
import styles from "../../css/Bitacora.module.css"

const LayBitacora = () => {
  const [paciente] = useState({
    nombre: "Milton Herrera",
    ufm: "UFM ´14",
    nss: "********265",
    consultorio: "1",
    turno: "TM",
    edad: 44,
    peso: 94.6,
    talla: 1.77,
    tipoSangre: "O+"
  })

  const [registros, setRegistros] = useState([
    { id: 1, isoString: "2026-10-01T02:30:00Z", valor: "132/91", frecuenciaCardiaca: 88, alerta: "subio" },
    { id: 2, isoString: "2026-10-02T03:15:00Z", valor: "125/83", frecuenciaCardiaca: 82, alerta: "bajo" },
    { id: 3, isoString: "2026-10-03T02:30:00Z", valor: "122/81", frecuenciaCardiaca: 79, alerta: "bajo" },
    { id: 4, isoString: "2026-09-30T02:30:00Z", valor: "122/81", frecuenciaCardiaca: 60, alerta: "neutro" },
    { id: 5, isoString: "2026-10-01T02:30:00Z", valor: "120/80", frecuenciaCardiaca: 76, alerta: "subio" },
    { id: 6, isoString: "2026-10-02T03:15:00Z", valor: "118/79", frecuenciaCardiaca: 72, alerta: "bajo" },
    { id: 7, isoString: "2026-10-03T02:30:00Z", valor: "122/81", frecuenciaCardiaca: 80, alerta: "subio" },
    { id: 8, isoString: "2026-10-04T01:45:00Z", valor: "125/83", frecuenciaCardiaca: 84, alerta: "subio" },
    { id: 9, isoString: "2026-10-05T02:30:00Z", valor: "121/80", frecuenciaCardiaca: 75, alerta: "bajo" },
    { id: 10, isoString: "2026-10-06T03:15:00Z", valor: "117/76", frecuenciaCardiaca: 81, alerta: "subio" },
    { id: 11, isoString: "2026-10-07T02:30:00Z", valor: "122/81", frecuenciaCardiaca: 78, alerta: "subio" },
    { id: 12, fecha: "2026-09-22", hora: "13:45", brazoIzquierdo: "128/89", brazoDerecho: "130/90", frecuenciaCardiaca: 95 },
    { id: 13, fecha: "2026-09-22", hora: "20:00", brazoIzquierdo: "134/89", brazoDerecho: null, frecuenciaCardiaca: 103 },
    { id: 14, fecha: "2026-09-23", hora: "09:54", brazoIzquierdo: "120/70", brazoDerecho: "122/75", frecuenciaCardiaca: 83 },
    { id: 15, fecha: "2026-09-23", hora: "20:19", brazoIzquierdo: "130/89", brazoDerecho: "127/89", frecuenciaCardiaca: 96 },
    { id: 16, fecha: "2026-09-24", hora: "06:39", brazoIzquierdo: "127/87", brazoDerecho: "115/86", frecuenciaCardiaca: 81 },
    { id: 17, fecha: "2026-09-24", hora: "19:17", brazoIzquierdo: "126/92", brazoDerecho: "125/84", frecuenciaCardiaca: 103 },
    { id: 18, fecha: "2026-09-25", hora: "07:48", brazoIzquierdo: "135/90", brazoDerecho: "135/91", frecuenciaCardiaca: 91 },
    { id: 19, fecha: "2026-09-25", hora: "09:33", brazoIzquierdo: null, brazoDerecho: "140/100", frecuenciaCardiaca: null },
    { id: 20, fecha: "2026-09-26", hora: "07:34", brazoIzquierdo: "129/90", brazoDerecho: "117/92", frecuenciaCardiaca: 83 },
    { id: 21, fecha: "2026-09-26", hora: "13:43", brazoIzquierdo: "120/82", brazoDerecho: "116/81", frecuenciaCardiaca: 92 },
    { id: 22, fecha: "2026-09-27", hora: null, brazoIzquierdo: "113/84", brazoDerecho: "110/85", frecuenciaCardiaca: 76 },
    { id: 23, fecha: "2026-09-28", hora: null, brazoIzquierdo: "135/87", brazoDerecho: "129/85", frecuenciaCardiaca: 88 },
    { id: 24, fecha: "2026-09-29", hora: null, brazoIzquierdo: "117/85", brazoDerecho: "121/86", frecuenciaCardiaca: 81 },
    { id: 25, fecha: "2026-10-01", hora: "07:38", brazoIzquierdo: "124/83", brazoDerecho: "114/78", frecuenciaCardiaca: 86 },
    { id: 26, fecha: "2026-10-02", hora: "06:13", brazoIzquierdo: "127/91", brazoDerecho: "121/83", frecuenciaCardiaca: 82 },
    { id: 27, fecha: "2026-10-03", hora: "06:10", brazoIzquierdo: "107/77", brazoDerecho: "110/77", frecuenciaCardiaca: 76 }
  ])

  const [hoveredId, setHoveredId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [selectionOrigin, setSelectionOrigin] = useState(null)

  const handleAgregarRegistro = (nuevo) => {
    setRegistros([nuevo, ...registros])
  }

  const handleSeleccionarRegistro = (id, origin) => {
    if (selectedId === id) {
      setSelectedId(null)
      setSelectionOrigin(null)
      return
    }

    setSelectedId(id)
    setSelectionOrigin(origin)
  }

  return (
    <section className={styles.LayBitacora}>
      <HeaderPaciente paciente={paciente} />
      <SelectorEntrada onAgregarRegistro={handleAgregarRegistro} />
      
      <div className={styles.cuerpoPrincipalDashboard}>
        <TablaRegistros
          registros={registros}
          hoveredId={hoveredId}
          selectedId={selectedId}
          scrollToSelected={selectionOrigin === "grafica"}
          onHoverRow={setHoveredId}
          onSelectRow={(id) => handleSeleccionarRegistro(id, "tabla")}
        />
        <PanelGraficas
          registros={registros}
          hoveredId={hoveredId}
          selectedId={selectedId}
          scrollToSelected={selectionOrigin === "tabla"}
          onHoverPoint={setHoveredId}
          onSelectPoint={(id) => handleSeleccionarRegistro(id, "grafica")}
        />
      </div>

      <ResumenClinicoFooter registros={registros} />
    </section>
  )
}

export default LayBitacora
