import styles from "../css/App.module.css"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

// Función auxiliar para formatear la fecha de forma limpia
const formatearPartes = (isoString) => {
  const fecha = parseISO(isoString)

  return {
    diaSemana: format(fecha, "EEEE", { locale: es }), // "martes"
    diaNumero: format(fecha, "d"),                    // "13"
    mesAño: format(fecha, "MMMM yyyy", { locale: es }), // "octubre de 2026"
    hora: format(fecha, "HH"),
    minuto: format(fecha, "mm")                // "14:50 hrs"
  }
}

const Fecha = () => {
  // Ejemplo de datos que vendrían de una API o backend
  const registros = [
    { id: 1, isoString: "2026-10-01T08:30:00Z", valor: "120/80" },
    { id: 2, isoString: "2026-10-02T09:15:00Z", valor: "118/79" },
    { id: 3, isoString: "2026-10-03T18:00:00Z", valor: "122/81" },
    { id: 4, isoString: "2026-10-04T07:45:00Z", valor: "119/78" },
    { id: 5, isoString: "2026-10-05T20:10:00Z", valor: "125/83" },
    { id: 6, isoString: "2026-10-06T08:00:00Z", valor: "121/80" },
    { id: 7, isoString: "2026-10-07T14:30:00Z", valor: "117/76" },
    { id: 8, isoString: "2026-10-08T09:00:00Z", valor: "120/82" },
    { id: 9, isoString: "2026-10-09T21:15:00Z", valor: "123/84" },
    { id: 10, isoString: "2026-10-10T08:10:00Z", valor: "118/80" },
    { id: 11, isoString: "2026-10-11T11:20:00Z", valor: "119/77" },
    { id: 12, isoString: "2026-10-12T19:45:00Z", valor: "121/79" },
    { id: 13, isoString: "2026-10-13T07:30:00Z", valor: "120/80" },
    { id: 14, isoString: "2026-10-13T12:00:00Z", valor: "122/81" },
    { id: 15, isoString: "2026-10-13T18:15:00Z", valor: "119/78" }
  ]



  return (
    <div className={styles.Fecha}>
      <h2>Registros capturados ({registros.length})</h2>

      <ul>
        {registros.map((registro) => {
          const { diaSemana, diaNumero, mesAño, hora, minuto } = formatearPartes(registro.isoString)

          return (
            <>
             {<span className={styles.mesAño}>{mesAño}</span>}
              <li key={registro.id} className={styles.item}>
                <span className={styles.diaSemana}>{diaSemana}, </span>
                <span className={styles.diaNumero}>{diaNumero} </span>
                <span className={styles.separador}> - </span>
                <span className={styles.hora}>{hora}</span>
                <span className={styles.separador}> : </span>
                <span className={styles.minuto}>{minuto}</span>
              </li>
            </>
          )
        })}
      </ul>
    </div>
  )
}

export default Fecha