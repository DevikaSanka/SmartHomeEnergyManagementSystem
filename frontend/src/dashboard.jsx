import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import "./dashboard.css";

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#38bdf8', '#c084fc'];

const defaultDevices = {
  light_1: { name: "Smart Light", power: 10, room: "Living Room", state: false, icon: "💡" },
  fan_1: { name: "Ceiling Fan", power: 60, room: "Living Room", state: false, icon: "🌀" },
  ac_1: { name: "Air Conditioner", power: 1500, room: "Bedroom", state: false, icon: "❄️" },
  tv_1: { name: "Smart TV", power: 120, room: "Living Room", state: false, icon: "📺" }
};

const defaultHistory = [
  { time: "08:00", usage: 450 }, { time: "10:00", usage: 1100 },
  { time: "12:00", usage: 1600 }, { time: "14:00", usage: 1300 },
  { time: "16:00", usage: 2100 }, { time: "18:00", usage: 2400 },
];

function Dashboard() {
  const navigate = useNavigate();

  // Data State with Persistence
  const [devices, setDevices] = useState(() => {
    const saved = localStorage.getItem("sh_devices");
    return saved ? JSON.parse(saved) : defaultDevices;
  });

  const [costRate, setCostRate] = useState(() => {
    const saved = localStorage.getItem("sh_costRate");
    return saved ? Number(saved) : 8;
  });

  const [energyHistory, setEnergyHistory] = useState(() => {
    const saved = localStorage.getItem("sh_history");
    return saved ? JSON.parse(saved) : defaultHistory;
  });

  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDevicePower, setNewDevicePower] = useState("");
  const [newDeviceRoom, setNewDeviceRoom] = useState("Living Room");
  const [toast, setToast] = useState(null);

  // Sync state to local storage
  useEffect(() => { localStorage.setItem("sh_devices", JSON.stringify(devices)); }, [devices]);
  useEffect(() => { localStorage.setItem("sh_costRate", costRate.toString()); }, [costRate]);
  useEffect(() => { localStorage.setItem("sh_history", JSON.stringify(energyHistory)); }, [energyHistory]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const toggle = (id) => {
    setDevices(prev => ({
      ...prev,
      [id]: { ...prev[id], state: !prev[id].state }
    }));
  };

  const deleteDevice = (id) => {
    setDevices(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    showToast("Device removed", "info");
  };

  const handleAddDevice = () => {
    if (!newDeviceName || !newDevicePower) {
      showToast("Please enter name and power", "warning");
      return;
    }
    const id = newDeviceName.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now();
    setDevices(prev => ({
      ...prev,
      [id]: {
        name: newDeviceName,
        power: Number(newDevicePower),
        room: newDeviceRoom,
        state: false,
        icon: "🔌"
      }
    }));
    setNewDeviceName("");
    setNewDevicePower("");
    showToast(`${newDeviceName} added successfully!`, "success");
  };

  const { total, cost, status, pieData } = useMemo(() => {
    let totalPower = 0;
    let chartData = [];

    Object.values(devices).forEach(device => {
      if (device.state) {
        totalPower += device.power;
        chartData.push({ name: device.name, value: device.power });
      }
    });

    let calculatedCost = (totalPower / 1000) * costRate;
    let usageStatus = totalPower > 2000 ? "High Usage ⚠" : totalPower > 1000 ? "Moderate" : "Normal";

    return { total: totalPower, cost: calculatedCost, status: usageStatus, pieData: chartData };
  }, [devices, costRate]);

  // Alert on high usage
  useEffect(() => {
    if (total > 2000) {
      showToast("Warning: High power usage detected!", "warning");
    }
  }, [total]);

  // Dynamic Chart Updater (updates every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyHistory(prev => {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        const newEntry = { time: timeStr, usage: total };
        const newHistory = [...prev, newEntry];
        if (newHistory.length > 20) newHistory.shift();
        return newHistory;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [total]);

  const rooms = useMemo(() => {
    const acc = {};
    Object.entries(devices).forEach(([id, device]) => {
      if (!acc[device.room]) acc[device.room] = [];
      acc[device.room].push({ id, ...device });
    });
    return acc;
  }, [devices]);

  return (
    <div className="dashboard">
      {toast && (
        <div className={`toast toast-${toast.type} show-toast`}>
          {toast.message}
        </div>
      )}

      <header className="header">
        <div className="logo-section">
          <h2>⚡ Smart Home Energy</h2>
        </div>
        <nav className="nav-menu">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/features">Features</Link>
          <Link to="/contact">Contact</Link>
          <button className="logout-btn" onClick={() => navigate("/login")}>Logout</button>
        </nav>
      </header>

      <div className="container animate-fade-in">

        {/* Settings Bar */}
        <div className="settings-bar glass-panel animate-slide-up">
          <div className="welcome">Welcome back, <span>User</span> 👋</div>
          <div className="settings-controls">
            <div className="rate-setting">
              <label>Rate (₹/kWh): </label>
              <input
                type="number"
                value={costRate}
                onChange={(e) => setCostRate(Number(e.target.value))}
                className="rate-input"
              />
            </div>
            <button className="reset-btn" onClick={() => {
              if (window.confirm("Reset all settings and history to default?")) {
                localStorage.clear();
                window.location.reload();
              }
            }}>Factory Reset</button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="cards animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className={`card ${total > 2000 ? 'alert-card' : ''}`}>
            <div className="card-icon">⚡</div>
            <div className="card-content">
              <h3>Total Power</h3>
              <p className="counter-val">{total} W</p>
            </div>
          </div>
          <div className="card">
            <div className="card-icon">₹</div>
            <div className="card-content">
              <h3>Est. Cost/hr</h3>
              <p className="counter-val">₹{cost.toFixed(2)}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>Status</h3>
              <p className={`status-text ${status.includes("High") ? "text-danger" : "text-success"}`}>{status}</p>
            </div>
          </div>
        </div>

        {/* --- CHARTS SECTION --- */}
        <div className="charts-grid animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="chart-box glass-panel">
            <h3>Live Energy Consumption</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={energyHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    tickMargin={10}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#34d399' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="usage"
                    stroke="#34d399"
                    strokeWidth={4}
                    dot={false}
                    activeDot={{ r: 6, fill: '#34d399', stroke: '#fff', strokeWidth: 2 }}
                    isAnimationActive={true}
                    animationDuration={500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-box glass-panel">
            <h3>Active Device Breakdown</h3>
            <div className="chart-wrapper">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      isAnimationActive={true}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '12px', color: '#fff' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data">
                  <div className="empty-icon glass-icon">🔌</div>
                  <p>Turn on devices to see the breakdown</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DEVICE CONTROLS (Grouped by Room) */}
        <div className="devices-header animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <h2>Device Fleet</h2>
        </div>

        <div className="rooms-container animate-slide-up" style={{ animationDelay: "0.4s" }}>
          {Object.keys(rooms).length === 0 ? (
            <p className="no-data">No devices added yet.</p>
          ) : (
            Object.keys(rooms).sort().map((roomName) => (
              <div key={roomName} className="room-section">
                <h3 className="room-title">{roomName}</h3>
                <div className="devices-grid">
                  {rooms[roomName].map(device => (
                    <div className={`device-item glass-panel ${device.state ? 'device-on' : 'device-off'}`} key={device.id}>
                      <div className="device-info">
                        <div className={`device-icon-wrapper ${device.state ? 'icon-on' : ''}`}>
                          <span className="device-icon">{device.icon}</span>
                        </div>
                        <div className="device-details">
                          <h4>{device.name}</h4>
                          <p>{device.power}W</p>
                        </div>
                      </div>
                      <div className="device-actions">
                        <label className="switch">
                          <input type="checkbox" checked={device.state} onChange={() => toggle(device.id)} />
                          <span className="slider round"></span>
                        </label>
                        <button className="icon-btn delete-btn" title="Remove Device" onClick={() => deleteDevice(device.id)}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ADD DEVICE FORM */}
        <div className="add-section glass-panel animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <div className="add-header">
            <span className="add-icon">➕</span>
            <h3>Add New Device</h3>
          </div>
          <div className="add-form">
            <input
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              placeholder="Device Name (e.g., Heater)"
              className="glass-input"
            />
            <input
              type="number"
              value={newDevicePower}
              onChange={(e) => setNewDevicePower(e.target.value)}
              placeholder="Power (W)"
              className="glass-input"
            />
            <select
              value={newDeviceRoom}
              onChange={(e) => setNewDeviceRoom(e.target.value)}
              className="glass-input"
            >
              <option value="Living Room">Living Room</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Bathroom">Bathroom</option>
              <option value="Garage">Garage</option>
              <option value="Other">Other</option>
            </select>
            <button className="btn-primary" onClick={handleAddDevice}>Add Device</button>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>© 2026 Smart Home Energy Management System</p>
        <p>support@smarthome.com</p>
      </footer>
    </div>
  );
}

export default Dashboard;