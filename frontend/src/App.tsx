import React, { useEffect, useState } from "react";
import { fetchSlots, createSlot, deleteSlot, type Slot } from "./api";

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

  // --- LIVE AVAILABILITY CHECKER ---
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

  // Safe percentage calculator for visual timeline bar (0 to 24 Hours)
  const getSlotPosition = (slot: Slot) => {
    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);

    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();

    let left = (startMinutes / 1440) * 100;
    let width = ((endMinutes - startMinutes) / 1440) * 100;

    // Clamp values so blocks never break the UI container
    left = Math.max(0, Math.min(left, 100));
    width = Math.max(2, Math.min(width, 100 - left));

    return { left: `${left}%`, width: `${width}%` };
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.badge}>SLOTFORGE v1.0 • PRO SCHEDULER</div>
        <h1 style={styles.title}>Dynamic Schedule Engine</h1>
        <p style={styles.subtitle}>Real-time scheduling with interval overlap prevention.</p>
      </header>

      {/* REFINED VISUAL TIMELINE BAR */}
      <section style={styles.timelineCard}>
        <div style={styles.timelineHeader}>
          <h3 style={styles.timelineTitle}>📊 24-Hour Occupancy Map</h3>
          <span style={styles.timelineSub}>Visual time allocation</span>
        </div>
        <div style={styles.timelineTrack}>
          {slots.map((slot) => {
            const pos = getSlotPosition(slot);
            return (
              <div
                key={slot.id}
                style={{ ...styles.timelineBlock, left: pos.left, width: pos.width }}
                title={`${slot.title} (${formatTime(slot.startTime)} - ${formatTime(slot.endTime)})`}
              >
                <span style={styles.blockLabel}>{slot.title}</span>
              </div>
            );
          })}
        </div>
        <div style={styles.timelineScale}>
          <span>12 AM</span>
          <span>06 AM</span>
          <span>12 PM</span>
          <span>06 PM</span>
          <span>12 AM</span>
        </div>
      </section>

      <main style={styles.mainContainer}>
        {/* CREATION FORM */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>➕ Create Time Slot</h2>

          {error && <div style={styles.errorBox}>⚠️ {error}</div>}
          {success && <div style={styles.successBox}>✅ {success}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Slot Title</label>
              <input
                type="text"
                placeholder="e.g. System Architecture Review"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Start Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>End Time</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={styles.input}
              />
            </div>

            {/* LIVE AVAILABILITY FEEDBACK */}
            {startTime && endTime && (
              <div style={styles.availabilityBox}>
                {!isValidRange ? (
                  <span style={{ color: "#f87171" }}>⚠️ End time must be after start time.</span>
                ) : hasConflict ? (
                  <span style={{ color: "#f87171" }}>
                    🔴 <strong>Slot Occupied:</strong> Overlaps with "{conflictingSlot?.title}"
                  </span>
                ) : (
                  <span style={{ color: "#4ade80" }}>🟢 <strong>Slot Available:</strong> No interval collisions detected.</span>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || hasConflict || !isValidRange}
              style={{
                ...styles.primaryButton,
                opacity: loading || hasConflict || !isValidRange ? 0.5 : 1,
                cursor: loading || hasConflict || !isValidRange ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Reserving Slot..." : "Reserve Slot"}
            </button>
          </form>
        </section>

        {/* ACTIVE SLOTS LIST */}
        <section style={styles.card}>
          <div style={styles.listHeader}>
            <h2 style={styles.cardTitle}>📅 Reserved Slots</h2>
            <span style={styles.countBadge}>{slots.length} Active</span>
          </div>

          {slots.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No time slots scheduled yet.</p>
              <small>Use the form on the left to add your first slot.</small>
            </div>
          ) : (
            <div style={styles.slotList}>
              {slots.map((slot) => (
                <div key={slot.id} style={styles.slotItem}>
                  <div style={styles.slotDetails}>
                    <h3 style={styles.slotTitle}>{slot.title}</h3>
                    <div style={styles.timeRange}>
                      <span>🕒 {formatTime(slot.startTime)}</span>
                      <span style={{ margin: "0 6px", opacity: 0.5 }}>→</span>
                      <span>{formatTime(slot.endTime)}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(slot.id)} style={styles.deleteButton}>
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

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0b0f19",
    color: "#f8fafc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "40px 20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    backgroundColor: "#1e293b",
    color: "#38bdf8",
    fontSize: "0.75rem",
    fontWeight: "bold",
    letterSpacing: "1px",
    marginBottom: "12px",
    border: "1px solid #334155",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: 800,
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "1rem",
    margin: 0,
  },
  timelineCard: {
    maxWidth: "1100px",
    margin: "0 auto 30px auto",
    backgroundColor: "#111827",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #1f2937",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
  },
  timelineHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  timelineTitle: {
    margin: 0,
    fontSize: "1rem",
    color: "#f3f4f6",
  },
  timelineSub: {
    fontSize: "0.8rem",
    color: "#6b7280",
  },
  timelineTrack: {
    position: "relative",
    height: "38px",
    backgroundColor: "#030712",
    borderRadius: "8px",
    border: "1px solid #1f2937",
    overflow: "hidden",
  },
  timelineBlock: {
    position: "absolute",
    top: "3px",
    bottom: "3px",
    backgroundColor: "#0369a1",
    backgroundImage: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
    border: "1px solid #38bdf8",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    boxShadow: "0 2px 8px rgba(2, 132, 199, 0.4)",
    transition: "all 0.2s ease",
  },
  blockLabel: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#ffffff",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  timelineScale: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    fontSize: "0.75rem",
    color: "#6b7280",
    padding: "0 4px",
  },
  mainContainer: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "24px",
    alignItems: "start",
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #1f2937",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    margin: "0 0 20px 0",
    color: "#f3f4f6",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#9ca3af",
  },
  input: {
    backgroundColor: "#030712",
    border: "1px solid #1f2937",
    borderRadius: "6px",
    padding: "10px 12px",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
  },
  availabilityBox: {
    padding: "10px",
    backgroundColor: "#030712",
    borderRadius: "6px",
    border: "1px solid #1f2937",
    fontSize: "0.85rem",
  },
  primaryButton: {
    marginTop: "8px",
    backgroundColor: "#0284c7",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "12px",
    fontWeight: "bold",
    fontSize: "0.95rem",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  countBadge: {
    backgroundColor: "#030712",
    color: "#38bdf8",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    border: "1px solid #1f2937",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#6b7280",
  },
  slotList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  slotItem: {
    backgroundColor: "#030712",
    borderRadius: "8px",
    padding: "14px 16px",
    border: "1px solid #1f2937",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slotDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  slotTitle: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 600,
    color: "#f8fafc",
  },
  timeRange: {
    fontSize: "0.82rem",
    color: "#9ca3af",
  },
  deleteButton: {
    backgroundColor: "#7f1d1d",
    color: "#fca5a5",
    border: "1px solid #991b1b",
    borderRadius: "4px",
    padding: "6px 12px",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  errorBox: {
    backgroundColor: "#450a0a",
    border: "1px solid #dc2626",
    color: "#fca5a5",
    padding: "10px 14px",
    borderRadius: "6px",
    fontSize: "0.88rem",
    marginBottom: "16px",
  },
  successBox: {
    backgroundColor: "#064e3b",
    border: "1px solid #059669",
    color: "#6ee7b7",
    padding: "10px 14px",
    borderRadius: "6px",
    fontSize: "0.88rem",
    marginBottom: "16px",
  },
};

export default App;