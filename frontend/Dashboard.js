
import React, { useEffect, useMemo, useState } from "react";
import './dashboard.css'
function TopNav({ title = "Smart Traffic & Fleet Monitoring", systemStatus = "Running" }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const statusColor =
    systemStatus === "Running" ? "#16a34a" : systemStatus === "Warning" ? "#f59e0b" : "#dc2626";

  return (
    <header className="topnav">
      <div className="topnav__left">
        <div className="topnav__title">{title}</div>
        <span className="topnav__badge" style={{ background: statusColor }}>
          {systemStatus}
        </span>
      </div>
      <div className="topnav__right">
        <span className="topnav__clock">
          {now.toLocaleDateString()} &nbsp;|&nbsp; {now.toLocaleTimeString()}
        </span>
      </div>
    </header>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="statcard">
      <div className="statcard__label">{label}</div>
      <div className="statcard__value">{value}</div>
      {sub ? <div className="statcard__sub">{sub}</div> : null}
    </div>
  );
}

function Tag({ tone = "neutral", children }) {
  const map = {
    neutral: "#64748b",
    success: "#16a34a",
    warn: "#f59e0b",
    danger: "#dc2626",
    info: "#2563eb",
  };
  return (
    <span className="tag" style={{ background: map[tone] || map.neutral }}>
      {children}
    </span>
  );
}

export default function Dashboard() {
  const [vehicles, setVehicles] = useState(() =>
    Array.from({ length: 10 }).map((_, i) => ({
      id: i + 1,
      lat: 17.385 + Math.random() * 0.08, 
      lng: 78.486 + Math.random() * 0.08,
      speed: Math.floor(Math.random() * 90), 
      fuel: Math.floor(40 + Math.random() * 60),
      location: ["Highway", "City Center", "Industrial Area", "Ring Road"][i % 4],
    }))
  );
  useEffect(() => {
    const t = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          const deltaLat = (Math.random() - 0.5) * 0.01;
          const deltaLng = (Math.random() - 0.5) * 0.01;
          const nextSpeed = Math.max(0, Math.min(110, v.speed + Math.floor((Math.random() - 0.5) * 20)));
          const fuelDrop = nextSpeed > 0 ? Math.random() * 2 : Math.random() * 0.4;
          const nextFuel = Math.max(0, v.fuel - fuelDrop);
          return {
            ...v,
            lat: v.lat + deltaLat,
            lng: v.lng + deltaLng,
            speed: nextSpeed,
            fuel: nextFuel,
          };
        })
      );
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v) => v.speed > 0).length;
  const lowFuelCount = vehicles.filter((v) => v.fuel < 20).length;
  const avgSpeed = useMemo(() => {
    if (!vehicles.length) return 0;
    const s = vehicles.reduce((a, b) => a + b.speed, 0);
    return Math.round(s / vehicles.length);
  }, [vehicles]);

  const slowOrStopped = vehicles.filter((v) => v.speed < 30).length;
  const congestionPct = Math.round((slowOrStopped / Math.max(1, totalVehicles)) * 100);
  let congestionLevel = "Low";
  if (congestionPct >= 60) congestionLevel = "High";
  else if (congestionPct >= 30) congestionLevel = "Medium";

  const maintenanceAlerts = vehicles
    .filter((v) => v.fuel < 15 || v.speed === 0)
    .slice(0, 5)
    .map((v) => ({
      id: v.id,
      reason: v.fuel < 15 ? "Low Fuel (<15%)" : "Stopped",
      fuel: Math.round(v.fuel),
      speed: v.speed,
    }));

  const [query, setQuery] = useState("");
  const filtered = vehicles.filter(
    (v) =>
      String(v.id).includes(query) ||
      v.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="dash">
      <TopNav />

      <section className="dash__stats">
        <StatCard label="Total Vehicles" value={totalVehicles} sub={`${activeVehicles} active`} />
        <StatCard label="Average Speed" value={`${avgSpeed} km/h`} sub={<Tag tone="info">Live</Tag>} />
        <StatCard
          label="Low Fuel"
          value={lowFuelCount}
          sub={
            lowFuelCount > 0 ? <Tag tone="warn">Refuel needed</Tag> : <Tag tone="success">All good</Tag>
          }
        />
        <StatCard
          label="Congestion"
          value={`${congestionLevel}`}
          sub={<span>{congestionPct}% slow/stopped</span>}
        />
      </section>

      <section className="dash__controls">
        <input
          className="dash__search"
          placeholder="Search by Vehicle ID or Location…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="dash__legend">
          <span className="legend__dot legend__ok" /> Normal
          <span className="legend__dot legend__warn" /> Low Fuel
          <span className="legend__dot legend__danger" /> Stopped
        </div>
      </section>

      <div className="dash__grid">
        <section className="panel">
          <div className="panel__title">Live Map (Simulated)</div>
          <div className="map">
            {vehicles.map((v) => {
              const tone =
                v.speed === 0 ? "danger" : v.fuel < 20 ? "warn" : "ok";
              const x = ((v.lng - 78.46) / 0.12) * 100; // 0–100%
              const y = ((v.lat - 17.36) / 0.12) * 100; // 0–100%
              return (
                <div
                  key={v.id}
                  className={`map__dot map__dot--${tone}`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  title={`V${v.id} • ${v.location}\nSpeed: ${v.speed} km/h\nFuel: ${Math.round(
                    v.fuel
                  )}%`}
                />
              );
            })}
            <div className="map__watermark">Map placeholder • Integrate Google Maps or Leaflet later</div>
          </div>
        </section>

        <section className="panel">
          <div className="panel__title">Predictive Traffic Insights</div>
          <ul className="list">
            <li>
              <strong>Congestion Level:</strong> {congestionLevel} ({congestionPct}% vehicles &lt; 30 km/h)
            </li>
            <li>
              <strong>ETA Risk:</strong>{" "}
              {congestionLevel === "High" ? (
                <Tag tone="danger">Delays likely</Tag>
              ) : congestionLevel === "Medium" ? (
                <Tag tone="warn">Monitor ETAs</Tag>
              ) : (
                <Tag tone="success">On time</Tag>
              )}
            </li>
            <li>
              <strong>Suggested Action:</strong>{" "}
              {congestionLevel === "High"
                ? "Reroute through alternate corridors. Defer non-urgent trips."
                : congestionLevel === "Medium"
                ? "Proactively optimize routes for affected vehicles."
                : "Maintain current routes; continue monitoring."}
            </li>
          </ul>
        </section>

        <section className="panel">
          <div className="panel__title">Predictive Maintenance Alerts</div>
          {maintenanceAlerts.length === 0 ? (
            <div className="empty">No maintenance alerts right now.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Reason</th>
                  <th>Fuel</th>
                  <th>Speed</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceAlerts.map((a) => (
                  <tr key={a.id}>
                    <td>V{a.id}</td>
                    <td>
                      {a.reason === "Low Fuel (<15%)" ? (
                        <Tag tone="warn">{a.reason}</Tag>
                      ) : (
                        <Tag tone="danger">{a.reason}</Tag>
                      )}
                    </td>
                    <td>{a.fuel}%</td>
                    <td>{a.speed} km/h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="panel panel--wide">
          <div className="panel__title">Fleet Details</div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Vehicle ID</th>
                  <th>Location</th>
                  <th>Speed (km/h)</th>
                  <th>Fuel (%)</th>
                  <th>Lat</th>
                  <th>Lng</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => {
                  const status =
                    v.speed === 0 ? (
                      <Tag tone="danger">Stopped</Tag>
                    ) : v.fuel < 20 ? (
                      <Tag tone="warn">Low Fuel</Tag>
                    ) : (
                      <Tag tone="success">Normal</Tag>
                    );
                  return (
                    <tr key={v.id}>
                      <td>V{v.id}</td>
                      <td>{v.location}</td>
                      <td>{v.speed}</td>
                      <td>{Math.round(v.fuel)}</td>
                      <td>{v.lat.toFixed(4)}</td>
                      <td>{v.lng.toFixed(4)}</td>
                      <td>{status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <footer className="dash__footer">
        © {new Date().getFullYear()} Smart Traffic & Fleet Monitoring • Demo Dashboard
      </footer>
    </div>
  );
}
