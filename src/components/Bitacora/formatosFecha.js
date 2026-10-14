import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export const formatearDatosParaGrafica = (registrosRaw) => {
  return registrosRaw.map((registro) => {
    const fecha = parseISO(registro.isoString)
    
    // Separamos "120/80" -> sistolica: 120, diastolica: 80
    const [sistolica, diastolica] = registro.valor.split("/").map(Number)

    return {
      id: registro.id,
      diaSemana: format(fecha, "EEEE", { locale: es }),
      diaNumero: format(fecha, "d"),
      mesAño: format(fecha, "MMMM yyyy", { locale: es }),
      horaFormateada: format(fecha, "HH:mm"),
      // Etiqueta legible para el eje de la gráfica
      etiquetaEje: `${format(fecha, "dd MMM HH:mm", { locale: es })}`,
      sistolica,
      diastolica
    }
  })
}