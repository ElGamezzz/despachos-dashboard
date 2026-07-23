"use client";
import { useEffect, useState } from "react";

type Despacho = {
  id: number;
  tracking_code: string;
  cliente_nombre: string;
  direccion_entrega: string;
  estado: string;
  tiempo_creacion: string;
};

export default function Home() {
  const [despachos, setDespachos] = useState<Despacho[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/despachos/")
      .then((res) => res.json())
      .then((data) => {
        setDespachos(data);
        setLoading(false);
      });
  }, []);

  const estadoColor: Record<string, string> = {
    pendiente: "#f59e0b",
    en_camino: "#3b82f6",
    entregado: "#10b981",
    fallido: "#ef4444",
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "8px" }}>📦 Dashboard de Despachos</h1>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        Trackeo en tiempo real
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        <MetricCard title="Total hoy" value={despachos.length} color="#6366f1" />
        <MetricCard title="En camino" value={despachos.filter(d => d.estado === "en_camino").length} color="#3b82f6" />
        <MetricCard title="Entregados" value={despachos.filter(d => d.estado === "entregado").length} color="#10b981" />
        <MetricCard title="Pendientes" value={despachos.filter(d => d.estado === "pendiente").length} color="#f59e0b" />
      </div>

      <div style={{ background: "white", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
        <div style={{ padding: "16px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ margin: 0 }}>Despachos activos</h2>
        </div>
        {loading ? (
          <p style={{ padding: "16px" }}>Cargando...</p>
        ) : despachos.length === 0 ? (
          <p style={{ padding: "16px", color: "#6b7280" }}>
            No hay despachos. Crea uno desde la API.
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f9fafb" }}>
              <tr>
                <th style={{ padding: "12px", textAlign: "left" }}>Tracking</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Cliente</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Dirección</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Estado</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Creado</th>
              </tr>
            </thead>
            <tbody>
              {despachos.map((d) => (
                <tr key={d.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "12px", fontFamily: "monospace" }}>{d.tracking_code}</td>
                  <td style={{ padding: "12px" }}>{d.cliente_nombre}</td>
                  <td style={{ padding: "12px" }}>{d.direccion_entrega}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      background: estadoColor[d.estado] || "#6b7280",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}>
                      {d.estado.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: "#6b7280", fontSize: "14px" }}>
                    {new Date(d.tiempo_creacion).toLocaleString("es")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      borderLeft: `4px solid ${color}`,
    }}>
      <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>{title}</p>
      <p style={{ margin: "8px 0 0", fontSize: "32px", fontWeight: 700, color }}>{value}</p>
    </div>
  );
}