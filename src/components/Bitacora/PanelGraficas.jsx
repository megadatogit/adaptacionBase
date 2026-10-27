import { useEffect, useRef } from "react"
import { format } from "date-fns"
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
import { agregarCambiosMes, obtenerFecha, obtenerHora, obtenerPresion, ordenarRegistrosVisualmente } from "./registroUtils"

const configuracionEjes = {
  presion: {
    domain: [50, 150],
    ticks: [60, 80, 100, 120, 140],
    margin: { top: 0, right: 20, left: 20, bottom: 0 },
    anchoEjeY: 104,
    unidad: "mmHg"
  },
  frecuencia: {
    domain: [40, 120],
    ticks: [40, 60, 80, 100, 120],
    margin: { top: 0, right: 30, left: 10, bottom: 0 },
    anchoEjeY: 0,
    unidad: "bpm"
  }
}

const TickFecha = ({ x, y, payload }) => {
  const [hora, dia] = String(payload.value).split("|")
  const posicionX = x - 8
  const descripcion = `${hora}, ${dia}`

  return (
    <g role="img" aria-label={descripcion}>
      <title>{descripcion}</title>
      <text
        x={posicionX}
        y={y}
        textAnchor="end"
        fill="#64748b"
        fontSize="10"
      >
        <tspan x={posicionX} dy="-0.25em">{hora}</tspan>
        <tspan x={posicionX} dy="1.25em">{dia}</tspan>
      </text>
    </g>
  )
}

const EjeFijo = ({ configuracion }) => {
  const [minimo, maximo] = configuracion.domain
  const estiloAreaTrazado = {
    marginLeft: configuracion.margin.left + configuracion.anchoEjeY,
    marginRight: configuracion.margin.right
  }

  return (
    <div className={styles.ejeFijo} style={estiloAreaTrazado}>
      {configuracion.ticks.map((valor) => (
        <span
          key={valor}
          style={{ left: `${((valor - minimo) / (maximo - minimo)) * 100}%` }}
        >
          {valor}
        </span>
      ))}
      <small>{configuracion.unidad}</small>
    </div>
  )
}

const PanelGraficas = ({ registros = [], hoveredId, selectedId, scrollToSelected, onHoverPoint, onSelectPoint }) => {
  const scrollRef = useRef(null)
  const altoFila = 44
  const altoVisible = altoFila * 10

  // Preparamos y transformamos los datos para Recharts
  const dataGrafica = agregarCambiosMes(ordenarRegistrosVisualmente(registros)).map(({ registro: reg, iniciaMes }, indice) => {
    const fechaObj = obtenerFecha(reg)
    const hora = obtenerHora(reg)
    const izquierda = obtenerPresion(reg, "izquierdo")
    const derecha = obtenerPresion(reg, "derecho")
    const etiquetaHora = hora || "Sin hora"

    return {
      id: reg.id,
      indice,
      iniciaMes,
      // Etiqueta legible para el Eje Y
      etiquetaEje: `${etiquetaHora}|${format(fechaObj, "EEEE dd", { locale: es })}`,
      etiquetaCorta: `${format(fechaObj, "EEE dd", { locale: es })} ${etiquetaHora}`,
      rangoIzquierdo: izquierda ? [izquierda.diastolica, izquierda.sistolica] : null,
      rangoDerecho: derecha ? [derecha.diastolica, derecha.sistolica] : null,
      frecuencia: reg.frecuenciaCardiaca ?? null,
      alerta: reg.alerta
    }
  })

  const altoDatos = Math.max(altoVisible, dataGrafica.length * altoFila)
  const selectedIndex = dataGrafica.findIndex((entrada) => entrada.id === selectedId)

  useEffect(() => {
    if (selectedId == null || !scrollToSelected || !scrollRef.current || selectedIndex < 0) return

    const contenedor = scrollRef.current
    const destino = selectedIndex * altoFila - (contenedor.clientHeight - altoFila) / 2
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    contenedor.scrollTo({ top: Math.max(0, destino), behavior: reduceMotion ? "auto" : "smooth" })
  }, [selectedId, selectedIndex, scrollToSelected])

  return (
    <div className={styles.contenedorPanelGraficas}>
      <div className={styles.headerGraficas}>
        <div className={styles.colGraficaHeader}>
          <h3>Presión arterial</h3>
          <div className={styles.leyendaBrazos} aria-label="Series de presión arterial">
            <span><i className={styles.muestraIzquierda} />Izquierdo</span>
            <span><i className={styles.muestraDerecha} />Derecho</span>
          </div>
        </div>
        <div className={styles.colGraficaHeader}>
          <h3>Frecuencia cardíaca</h3>
        </div>
      </div>

      <div ref={scrollRef} className={styles.graficasScroll} style={{ height: altoVisible }}>
        <div className={styles.cuerpoGraficasFlex} style={{ height: altoDatos }}>
          <div className={styles.bandasInteraccionGraficas} aria-hidden="true">
            {dataGrafica.map((entrada) => {
              const seleccionada = selectedId === entrada.id
              const sobrevolada = hoveredId === entrada.id && !seleccionada
              if (!seleccionada && !sobrevolada) return null

              return (
                <i
                  key={`banda-${entrada.id}`}
                  className={seleccionada ? styles.bandaSeleccionada : styles.bandaHover}
                  style={{
                    top: `${(entrada.indice / dataGrafica.length) * 100}%`,
                    height: `${100 / dataGrafica.length}%`
                  }}
                />
              )
            })}
          </div>
          {/* Gráfica 1: Presión Arterial (Eje Horizontal con rango de presión) */}
          <div className={styles.graficaIndividual}>
            <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              layout="vertical"
              data={dataGrafica}
              margin={configuracionEjes.presion.margin}
            >
              <CartesianGrid stroke="#e2e8f0" strokeOpacity={0.35} horizontal={false} />
              
              <XAxis type="number" domain={configuracionEjes.presion.domain} scale="linear" allowDataOverflow hide />
              
              <YAxis
                dataKey="etiquetaEje"
                type="category"
                width={configuracionEjes.presion.anchoEjeY}
                tick={<TickFecha />}
                tickLine={false}
                axisLine={false}
              />
              
              <Tooltip
                formatter={(value) => Array.isArray(value) ? `${value[1]}/${value[0]} mmHg` : value}
                labelFormatter={(label, items) => items[0]?.payload?.etiquetaCorta || label}
              />
              
              <ReferenceLine x={60} stroke="#22c55e" strokeWidth={2} strokeDasharray="4 5" />
              <ReferenceLine x={120} stroke="#eab308" strokeWidth={2} strokeDasharray="4 5" />

              {/* Barras flotantes por brazo (rango diastólica a sistólica) */}
              <Bar
                dataKey="rangoIzquierdo"
                name="Brazo izquierdo"
                barSize={6}
                radius={[6, 6, 6, 6]}
                onMouseEnter={(entry) => onHoverPoint && onHoverPoint(entry.id)}
                onMouseLeave={() => onHoverPoint && onHoverPoint(null)}
                onClick={(entry) => onSelectPoint && onSelectPoint(entry.id)}
              >
                {dataGrafica.map((entry) => (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={hoveredId === entry.id || selectedId === entry.id ? "#0284c7" : "#38bdf8"}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="rangoDerecho"
                name="Brazo derecho"
                barSize={6}
                radius={[6, 6, 6, 6]}
                onMouseEnter={(entry) => onHoverPoint && onHoverPoint(entry.id)}
                onMouseLeave={() => onHoverPoint && onHoverPoint(null)}
                onClick={(entry) => onSelectPoint && onSelectPoint(entry.id)}
              >
                {dataGrafica.map((entry) => (
                  <Cell
                    key={`cell-derecho-${entry.id}`}
                    fill={hoveredId === entry.id || selectedId === entry.id ? "#0284c7" : "#a855f7"}
                  />
                ))}
              </Bar>
            </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfica 2: Frecuencia Cardíaca (Eje Vertical con Línea y Puntos) */}
          <div className={styles.graficaIndividual}>
            <ResponsiveContainer width="100%" height="100%">
            <LineChart
              layout="vertical"
              data={dataGrafica}
              margin={configuracionEjes.frecuencia.margin}
            >
              <CartesianGrid stroke="#e2e8f0" strokeOpacity={0.35} horizontal={false} />
              
              <XAxis type="number" domain={configuracionEjes.frecuencia.domain} scale="linear" allowDataOverflow hide />
              
              <YAxis
                dataKey="etiquetaEje"
                type="category"
                width={configuracionEjes.frecuencia.anchoEjeY}
                hide
              />

              <ReferenceLine x={80} stroke="#eab308" strokeWidth={2} strokeDasharray="4 5" />
              
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
                  if (payload.frecuencia == null || !Number.isFinite(cx) || !Number.isFinite(cy)) return null
                  const isActive = hoveredId === payload.id || selectedId === payload.id
                  const seleccionarConTeclado = (evento) => {
                    if (evento.key === "Enter" || evento.key === " ") {
                      evento.preventDefault()
                      onSelectPoint && onSelectPoint(payload.id)
                    }
                  }
                  return (
                    <circle
                      key={`dot-${payload.id}`}
                      cx={cx}
                      cy={cy}
                      r={isActive ? 7 : 4}
                      fill={isActive ? "#0284c7" : "#ef4444"}
                      stroke="#ffffff"
                      strokeWidth={2}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => onHoverPoint && onHoverPoint(payload.id)}
                      onMouseLeave={() => onHoverPoint && onHoverPoint(null)}
                      onClick={() => onSelectPoint && onSelectPoint(payload.id)}
                      onKeyDown={seleccionarConTeclado}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selectedId === payload.id}
                    />
                  )
                }}
              />
            </LineChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.separadoresMesGraficas} aria-hidden="true">
            {dataGrafica.filter((entrada) => entrada.iniciaMes).map((entrada) => (
              <i
                key={`mes-${entrada.id}`}
                style={{ top: `${(entrada.indice / dataGrafica.length) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.ejesScrollCompensacion}>
        <div className={styles.ejesGraficasFlex} aria-label="Escalas fijas de las gráficas">
          <div className={styles.graficaIndividual}>
            <EjeFijo configuracion={configuracionEjes.presion} />
          </div>
          <div className={styles.graficaIndividual}>
            <EjeFijo configuracion={configuracionEjes.frecuencia} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PanelGraficas
