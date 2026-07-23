"use client";
import { useEffect, useState } from "react";

type Despacho = {
  id: number;
  tracking_code: string;
  cliente_nombre: string;
  direccion_entrega: string;
  estado: string;
  tiempo_creacion: string;
  latitud?: number;
  longitud?: number;
  repartidor_nombre?: string;
  notas?: string;
};

// ️ Reemplaza con tu URL real del puerto 8000 en Codespaces
const API_BASE_URL = "http://127.0.0.1:8000/api/despachos";

export default function Home() {
  const [despachos, setDespachos] = useState<Despacho[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cambiandoEstado, setCambiandoEstado] = useState<number | null>(null);

  // Cargar despachos
  const cargarDespachos = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}`);
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const data = await res.json();
      setDespachos(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDespachos();
  }, []);

  // Cambiar estado de un despacho
  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    setCambiandoEstado(id);
    try {
      const res = await fetch(`${API_BASE_URL}/${id}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) throw new Error(`Error al cambiar estado: ${res.status}`);

      const despachoActualizado = await res.json();

      // Actualización optimista: actualiza el estado en la UI sin recargar
      setDespachos((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...despachoActualizado } : d))
      );
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setCambiandoEstado(null);
    }
  };

  const estadoColor: Record<string, string> = {
    pendiente: "#f59e0b",
    en_camino: "#3b82f6",
    entregado: "#10b981",
    fallido: "#ef4444",
  };

  // Renderiza los botones según el estado actual
  const renderBotonesAccion = (d: Despacho) => {
    const isLoading = cambiandoEstado === d.id;

    if (d.estado === "entregado" || d.estado === "fallido") {
      return <span style={{ color: "#9ca3af", fontSize: "13px" }}>Sin acciones</span>;
    }

    return (
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {d.estado === "pendiente" && (
          <button
            onClick={() => cambiarEstado(d.id, "en_camino")}
            disabled={isLoading}
            style={btnStyle("#3b82f6")}
          >
            ️ Iniciar
          </button>
        )}
        {d.estado === "en_camino" && (
          <button
            onClick={() => cambiarEstado(d.id, "entregado")}
            disabled={isLoading}
            style={btnStyle("#10b981")}
          >
             Entregar
          </button>
        )}
        <button
          onClick={() => cambiarEstado(d.id, "fallido")}
          disabled={isLoading}
          style={btnStyle("#ef4444")}
        >
           Fallido
        </button>
      </div>
    );
  };

  if (loading) return <div style={{ padding: "24px" }}>Cargando datos...</div>;
  if (error) return <div style={{ padding: "24px", color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto", fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: "8px" }}> Dashboard de Despachos</h1>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>Gestión operativa en tiempo real</p>

      {/* Tarjetas de métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        <MetricCard title="Total hoy" value={despachos.length} color="#6366f1" />
        <MetricCard title="En camino" value={despachos.filter(d => d.estado === "en_camino").length} color="#3b82f6" />
        <MetricCard title="Entregados" value={despachos.filter(d => d.estado === "entregado").length} color="#10b981" />
        <MetricCard title="Pendientes" value={despachos.filter(d => d.estado === "pendiente").length} color="#f59e0b" />
      </div>

      {/* Tabla de despachos */}
      <div style={{ background: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <div style={{ padding: "16px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "18px" }}>Despachos activos</h2>
          <button onClick={cargarDespachos} style={btnStyle("#6366f1")}>
             Actualizar
          </button>
        </div>

        {despachos.length === 0 ? (
          <p style={{ padding: "16px", color: "#6b7280" }}>No hay despachos registrados.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
                  <th style={thStyle}>Tracking</th>
                  <th style={thStyle}>Cliente</th>
                  <th style={thStyle}>Dirección</th>
                  <th style={thStyle}>Estado</th>
                  <th style={thStyle}>Repartidor</th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {despachos.map((d) => (
                  <tr key={d.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td style={tdStyle}><strong style={{ fontFamily: "monospace" }}>{d.tracking_code}</strong></td>
                    <td style={tdStyle}>{d.cliente_nombre}</td>
                    <td style={{ ...tdStyle, color: "#4b5563" }}>{d.direccion_entrega}</td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: "4px 10px",
                        borderRadius: "12px",
                        background: estadoColor[d.estado] || "#6b7280",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase"
                      }}>
                        {d.estado.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: "#4b5563" }}>{d.repartidor_nombre || "Sin asignar"}</td>
                    <td style={tdStyle}>{renderBotonesAccion(d)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Estilos reutilizables
const thStyle: React.CSSProperties = { padding: "12px", fontWeight: 600, fontSize: "13px", color: "#374151" };
const tdStyle: React.CSSProperties = { padding: "12px" };

function btnStyle(color: string): React.CSSProperties {
  return {
    padding: "6px 12px",
    borderRadius: "6px",
    background: color,
    color: "white",
    border: "none",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s",
  };
}

function MetricCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      borderLeft: `4px solid ${color}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
    }}>
      <p style={{ margin: 0, color: "#6b7280", fontSize: "14px", fontWeight: 500 }}>{title}</p>
      <p style={{ margin: "8px 0 0", fontSize: "32px", fontWeight: 700, color: color }}>{value}</p>
    </div>
  );
}