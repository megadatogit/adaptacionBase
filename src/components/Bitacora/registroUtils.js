import { parseISO } from "date-fns"

const parsePresion = (valor) => {
  if (!valor || typeof valor !== "string") return null

  const [sistolica, diastolica] = valor.split("/").map(Number)
  if (!Number.isFinite(sistolica) || !Number.isFinite(diastolica)) return null

  return { valor, sistolica, diastolica }
}

export const obtenerPresion = (registro, brazo) => {
  const valorBrazo = brazo === "izquierdo"
    ? registro.brazoIzquierdo
    : registro.brazoDerecho

  return parsePresion(valorBrazo || (brazo === "izquierdo" ? registro.valor : null))
}

export const obtenerFecha = (registro) => {
  if (registro.fecha) return parseISO(`${registro.fecha}T12:00:00`)
  return parseISO(registro.isoString)
}

export const obtenerHora = (registro) => {
  if (Object.prototype.hasOwnProperty.call(registro, "hora")) return registro.hora
  return registro.isoString ? registro.isoString.slice(11, 16) : ""
}

const formateadorMes = new Intl.DateTimeFormat("es-MX", {
  month: "long",
  year: "numeric"
})

const obtenerDiaOrden = (registro) => registro.fecha || registro.isoString?.slice(0, 10) || ""

export const ordenarRegistrosVisualmente = (registros = []) => registros
  .map((registro, posicionOriginal) => ({ registro, posicionOriginal }))
  .sort((a, b) => {
    const diferenciaDia = obtenerDiaOrden(b.registro).localeCompare(obtenerDiaOrden(a.registro))
    if (diferenciaDia) return diferenciaDia

    const horaA = obtenerHora(a.registro)
    const horaB = obtenerHora(b.registro)
    if (horaA && horaB) {
      const diferenciaHora = horaB.localeCompare(horaA)
      if (diferenciaHora) return diferenciaHora
    } else if (horaA !== horaB) {
      return horaA ? -1 : 1
    }

    return a.posicionOriginal - b.posicionOriginal
  })
  .map(({ registro }) => registro)

export const agregarCambiosMes = (registros = []) => registros.map((registro, indice) => {
  const fecha = obtenerFecha(registro)
  const claveMes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`
  const fechaAnterior = indice > 0 ? obtenerFecha(registros[indice - 1]) : null
  const claveMesAnterior = fechaAnterior
    ? `${fechaAnterior.getFullYear()}-${String(fechaAnterior.getMonth() + 1).padStart(2, "0")}`
    : null

  return {
    registro,
    iniciaMes: indice > 0 && claveMes !== claveMesAnterior,
    etiquetaMes: formateadorMes.format(fecha)
  }
})

const obtenerResumenPresion = (registro) => {
  const presiones = [
    obtenerPresion(registro, "izquierdo"),
    obtenerPresion(registro, "derecho")
  ].filter(Boolean)

  if (!presiones.length) return null

  return {
    sistolicaMaxima: Math.max(...presiones.map((presion) => presion.sistolica)),
    diastolicaMinima: Math.min(...presiones.map((presion) => presion.diastolica))
  }
}

export const calcularIndicadoresPresion = (registros = []) => {
  const cronologicos = registros
    .map((registro, posicionOriginal) => ({
      registro,
      posicionOriginal,
      dia: obtenerDiaOrden(registro),
      hora: obtenerHora(registro)
    }))
    .sort((a, b) => {
      const diferenciaDia = a.dia.localeCompare(b.dia)
      if (diferenciaDia) return diferenciaDia

      if (a.hora && b.hora) {
        const diferenciaHora = a.hora.localeCompare(b.hora)
        if (diferenciaHora) return diferenciaHora
      } else if (a.hora !== b.hora) {
        return a.hora ? -1 : 1
      }

      return a.posicionOriginal - b.posicionOriginal
    })

  const indicadores = new Map()

  cronologicos.forEach(({ registro }, indice) => {
    const actual = obtenerResumenPresion(registro)
    const anterior = indice > 0 ? obtenerResumenPresion(cronologicos[indice - 1].registro) : null

    if (!actual) {
      indicadores.set(registro, {
        direccion: "neutral",
        estado: "sin-datos",
        descripcion: "Sin presión registrada"
      })
      return
    }

    let direccion = "neutral"
    if (anterior) {
      if (actual.sistolicaMaxima > anterior.sistolicaMaxima) direccion = "subio"
      else if (actual.sistolicaMaxima < anterior.sistolicaMaxima) direccion = "bajo"
      else direccion = "igual"
    }

    const fueraDeRango = actual.sistolicaMaxima > 120 || actual.diastolicaMinima < 60
    const textoDireccion = {
      subio: "Subió respecto de la lectura anterior",
      bajo: "Bajó respecto de la lectura anterior",
      igual: "Sin cambio respecto de la lectura anterior",
      neutral: "Sin lectura anterior para comparar"
    }[direccion]

    indicadores.set(registro, {
      direccion,
      estado: fueraDeRango ? "fuera-rango" : "en-rango",
      descripcion: `${textoDireccion}; ${fueraDeRango ? "fuera del rango de referencia" : "dentro del rango de referencia"}`
    })
  })

  return indicadores
}
