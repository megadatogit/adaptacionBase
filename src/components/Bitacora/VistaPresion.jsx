import GraficaPresion from "./GraficaPresion"
import { formatearDatosParaGrafica } from "./formatosFecha" // O donde ubiques la helper
import { datosPresion } from '../Bitacora/dataPresion.js'

const registrosRaw = datosPresion

const VistaPresion = () => {
  // Transformamos antes de entregar al componente de UI
  const datosFormateados = formatearDatosParaGrafica(registrosRaw)

  return <GraficaPresion datos={datosFormateados} />
}

export default VistaPresion