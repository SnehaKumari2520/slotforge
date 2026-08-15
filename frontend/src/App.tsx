import React, { useEffect, useState } from "react";
import { fetchSlots, createSlot, deleteSlot, type Slot } from "./api";
import "./App.css";

export function App() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadSlots = async () => {
    try {
      const data = await fetchSlots();
      setSlots(data);
    } catch (err: any) {
      setError("Failed to fetch slots from server.");
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const checkConflict = (): { hasConflict: boolean; conflictingSlot?: Slot } => {
    if (!startTime || !endTime) return { hasConflict: false };

    const newStart = new Date(startTime).getTime();
    const newEnd = new Date(endTime).getTime();

    if (isNaN(newStart) || isNaN(newEnd) || newEnd <= newStart) {
      return { hasConflict: false };
    }

    for (const slot of slots) {
      const sStart = new Date(slot.startTime).getTime();
      const sEnd = new Date(slot.endTime).getTime();

      if (newStart < sEnd && newEnd > sStart) {
        return { hasConflict: true, conflictingSlot: slot };
      }
    }

    return { hasConflict: false };
  };

  const { hasConflict, conflictingSlot } = checkConflict();
  const isValidRange = startTime && endTime && new Date(endTime) > new Date(startTime);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title || !startTime || !endTime) {
      setError("Please fill in all fields.");
      return;
    }

    if (hasConflict) {
      setError(`Cannot book: Time overlaps with '${conflictingSlot?.title}'.`);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      };

      await createSlot(payload);

      setSuccess("Time slot reserved successfully!");
      setTitle("");
      setStartTime("");
      setEndTime("");

      await loadSlots();
    } catch (err: any) {
      const serverError = err.response?.data?.error || "Failed to create slot.";
      setError(serverError);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      setSuccess(null);
      await deleteSlot(id);
      setSlots((prev) => prev.filter((slot) => slot.id !== id));
      setSuccess("Slot deleted successfully.");
    } catch (err: any) {
      setError("Failed to delete slot.");
    }
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSlotPosition = (slot: Slot) => {
    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);

    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();

    let left = (startMinutes / 1440) * 100;
    let width = ((endMinutes - startMinutes) / 1440) * 100;

    left = Math.max(0, Math.min(left, 100));
    width = Math.max(2, Math.min(width, 100 - left));

    return { left: `${left}%`, width: `${width}%` };
  };

  return (
    <div className="page">
      <header className="header">
        <div className="badge">✨ SLOTFORGE • VIBRANT SCHEDULER</div>
        <h1 className="title">Dynamic Schedule Engine</h1>
        <p className="subtitle">Real-time scheduling with interval overlap prevention.</p>
      </header>

      <section className="timeline-card">
        <div className="timeline-header">
          <h3 className="timeline-title">📊 24-Hour Occupancy Map</h3>
          <span className="timeline-sub">Visual time allocation</span>
        </div>
        <div className="timeline-track">
          {slots.map((slot) => {
            const pos = getSlotPosition(slot);
            return (
              <div
                key={slot.id}
                className="timeline-block"
                style={{ left: pos.left, width: pos.width }}
                title={`${slot.title} (${formatTime(slot.startTime)} - ${formatTime(slot.endTime)})`}
              >
                <span className="block-label">{slot.title}</span>
              </div>
            );
          })}
        </div>
        <div className="timeline-scale">
          <span>12 AM</span>
          <span>06 AM</span>
          <span>12 PM</span>
          <span>06 PM</span>
          <span>12 AM</span>
        </div>
      </section>

      <main className="main-container">
        <section className="card">
          <h2 className="card-title">➕ Create Time Slot</h2>

          {error && <div className="error-box">⚠️ {error}</div>}
          {success && <div className="success-box">🎉 {success}</div>}

          <form onSubmit={handleSubmit} className="form">
            <div className="field-group">
              <label className="label">Slot Title</label>
              <input
                type="text"
                placeholder="e.g. System Architecture Review"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
              />
            </div>

            <div className="field-group">
              <label className="label">Start Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="input"
              />
            </div>

            <div className="field-group">
              <label className="label">End Time</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="input"
              />
            </div>

            {startTime && endTime && (
              <div className="availability-box">
                {!isValidRange ? (
                  <span style={{ color: "#e11d48", fontWeight: 600 }}>⚠️ End time must be after start time.</span>
                ) : hasConflict ? (
                  <span style={{ color: "#e11d48", fontWeight: 600 }}>
                    🔴 <strong>Slot Occupied:</strong> Overlaps with "{conflictingSlot?.title}"
                  </span>
                ) : (
                  <span style={{ color: "#059669", fontWeight: 600 }}>
                    🟢 <strong>Slot Available:</strong> No interval collisions detected.
                  </span>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || hasConflict || !isValidRange}
              className="primary-button"
              style={{
                opacity: loading || hasConflict || !isValidRange ? 0.5 : 1,
                cursor: loading || hasConflict || !isValidRange ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Reserving Slot..." : "Reserve Slot ✨"}
            </button>
          </form>
        </section>

        <section className="card">
          <div className="list-header">
            <h2 className="card-title">📅 Reserved Slots</h2>
            <span className="count-badge">{slots.length} Active</span>
          </div>

          {slots.length === 0 ? (
            <div className="empty-state">
              <p style={{ margin: "0 0 6px 0", fontSize: "1.05rem", fontWeight: 600, color: "#4b5563" }}>
                No time slots scheduled yet.
              </p>
              <small style={{ color: "#9ca3af" }}>Use the form to add your first slot.</small>
            </div>
          ) : (
            <div className="slot-list">
              {slots.map((slot, idx) => (
                <div
                  key={slot.id}
                  className="slot-item"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="slot-details">
                    <h3 className="slot-title">{slot.title}</h3>
                    <div className="time-range">
                      <span>🕒 {formatTime(slot.startTime)}</span>
                      <span style={{ margin: "0 6px", opacity: 0.5 }}>→</span>
                      <span>{formatTime(slot.endTime)}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(slot.id)} className="delete-button">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;