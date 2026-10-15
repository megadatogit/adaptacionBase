import React from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import {
  ComposedChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell
} from "recharts"
import styles from "../../css/Bitacora.module.css"

const PanelGraficas = ({ registros = [], hoveredId, onHoverPoint }) => {
  // Preparamos y transformamos los datos para Recharts
  const dataGrafica = [...registros].reverse().map((reg) => {
    const fechaObj = parseISO(reg.isoString)
    const [sistolica, diastolica] = reg.valor.split("/").map(Number)

    return {
      id: reg.id,
      // Etiqueta legible para el Eje Y
      etiquetaEje: `${format(fechaObj, "HH:mm", { locale: es })}\n${format(fechaObj, "EEEE dd", { locale: es })}`,
      etiquetaCorta: format(fechaObj, "EEE dd HH:mm", { locale: es }),
      sistolica,
      diastolica,
      // Usamos un array [min, max] para crear la barra flotante (rango sistólica/diastólica)
      rangoPresion: [diastolica, sistolica],
      frecuencia: reg.frecuenciaCardiaca,
      alerta: reg.alerta
    }
  })

  // Determinamos el color de la barra según la alerta de umbral
  const obtenerColorBarra = (alerta, isHovered) => {
    if (isHovered) return "#0284c7" // Azul destacado si está seleccionado
    if (alerta === "subio") return "#f87171" // Rojo / Rosa
    if (alerta === "bajo") return "#facc15" // Amarillo
    return "#4ade80" // Verde
  }

  return (
    <div className={styles.contenedorPanelGraficas}>
      <div className={styles.headerGraficas}>
        <div className={styles.colGraficaHeader}>
          <h3>Presión arterial</h3>
        </div>
        <div className={styles.colGraficaHeader}>
          <h3>Frecuencia cardíaca</h3>
        </div>
      </div>

      <div className={styles.cuerpoGraficasFlex}>
        {/* Gráfica 1: Presión Arterial (Eje Horizontal con rango de presión) */}
        <div className={styles.graficaIndividual}>
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart
              layout="vertical"
              data={dataGrafica}
              margin={{ top: 10, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              
              {/* Eje X con los valores numéricos de presión mmHg */}
              <XAxis type="number" domain={[50, 150]} ticks={[60, 70, 80, 90, 100, 110, 120, 130, 140]} />
              
              {/* Eje Y compartido con las fechas */}
              <YAxis dataKey="etiquetaEje" type="category" width={80} tick={{ fontSize: 11 }} />
              
              <Tooltip
                formatter={(value) => Array.isArray(value) ? `${value[1]}/${value[0]} mmHg` : value}
                labelFormatter={(label, items) => items[0]?.payload?.etiquetaCorta || label}
              />
              
              {/* Línea de umbral clínico en 130 mmHg */}
              <ReferenceLine x={130} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '130 mmHg', fill: '#ef4444', fontSize: 10 }} />

              {/* Barra flotante de Rango de Presión (Diastólica a Sistólica) */}
              <Bar
                dataKey="rangoPresion"
                barSize={12}
                radius={[6, 6, 6, 6]}
                onMouseEnter={(entry) => onHoverPoint && onHoverPoint(entry.id)}
                onMouseLeave={() => onHoverPoint && onHoverPoint(null)}
              >
                {dataGrafica.map((entry) => (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={obtenerColorBarra(entry.alerta, hoveredId === entry.id)}
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica 2: Frecuencia Cardíaca (Eje Vertical con Línea y Puntos) */}
        <div className={styles.graficaIndividual}>
          <ResponsiveContainer width="100%" height={450}>
            <LineChart
              layout="vertical"
              data={dataGrafica}
              margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              
              {/* Eje X numérico para BPM */}
              <XAxis type="number" domain={[40, 120]} ticks={[50, 60, 70, 80, 90, 100, 110]} />
              
              {/* Eje Y oculto para no duplicar etiquetas con la primera gráfica */}
              <YAxis dataKey="etiquetaEje" type="category" hide />
              
              <Tooltip
                formatter={(value) => [`${value} bpm`, 'Frecuencia']}
                labelFormatter={(label, items) => items[0]?.payload?.etiquetaCorta || label}
              />

              <Line
                type="monotone"
                dataKey="frecuencia"
                stroke="#ef4444"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props
                  const isHovered = hoveredId === payload.id
                  return (
                    <circle
                      key={`dot-${payload.id}`}
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 7 : 4}
                      fill={isHovered ? "#0284c7" : "#ef4444"}
                      stroke="#ffffff"
                      strokeWidth={2}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => onHoverPoint && onHoverPoint(payload.id)}
                      onMouseLeave={() => onHoverPoint && onHoverPoint(null)}
                    />
                  )
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default PanelGraficas