import { generateNearbyMoment } from "../../src/lib/notification-engine";

export default function Moments() {
  const message = generateNearbyMoment(
    "Hamburguesas",
    "Burger Factory",
    250,
    15
  );

  return (
    <main style={{ background: "#f3f4f6", minHeight: "100vh", padding: 20 }}>
      <section
        style={{
          maxWidth: 390,
          margin: "0 auto",
          background: "#111827",
          color: "white",
          borderRadius: 28,
          padding: 20,
          fontFamily: "Arial",
        }}
      >
        <p style={{ color: "#9ca3af" }}>Ahora</p>

        <div
          style={{
            background: "#1f2937",
            borderRadius: 20,
            padding: 16,
            marginTop: 20,
          }}
        >
          <strong>📍 DeUna Nearby</strong>
          <p style={{ lineHeight: 1.5 }}>{message}</p>

          <button
            style={{
              width: "100%",
              background: "#7c3aed",
              color: "white",
              border: "none",
              borderRadius: 14,
              padding: 12,
              fontWeight: "bold",
            }}
          >
            Ver beneficio
          </button>
        </div>
      </section>
    </main>
  );
}