import React from "react"
import styles from "../../css/App.module.css"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

// El componente solo recibe 'datos' y 'titulo' vía props (Componente tonto / Pure Presentational)
const GraficaPresion = ({ datos = [], titulo = "Registros de Presión" }) => {
  return (
    <div className={styles.Fecha}>
      <h2>{titulo} ({datos.length})</h2>

      <div style={{ width: "100%", height: 500 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            layout="vertical"
            data={datos}
            margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            
            {/* Eje X numérico con dominio especificado para presión arterial */}
            <XAxis type="number" domain={[50, 180]} unit=" mmHg" />
            
            {/* Eje Y con la etiqueta de tiempo/fecha */}
            <YAxis dataKey="etiquetaEje" type="category" />
            
            <Tooltip />
            <Legend />

            {/* Línea Sistólica */}
            <Line
              dataKey="sistolica"
              name="Sistólica"
              stroke="#e63946"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            
            {/* Línea Diastólica */}
            <Line
              dataKey="diastolica"
              name="Diastólica"
              stroke="#1d3557"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default GraficaPresion