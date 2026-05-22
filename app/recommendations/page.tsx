import { supabase } from "../../src/lib/supabase";
import { calculateRecommendationScore } from "../../src/lib/recommendation-engine";

export default async function Recommendations() {
  const favoriteCategory = "Hamburguesas";

  const { data: businesses } = await supabase.from("businesses").select("*");

  const recommendations = businesses
    ?.map((business) => {
      const distanceMeters = business.name === "Burger Factory" ? 250 : 700;
      const discount = business.name === "Burger Factory" ? 15 : 10;

      const score = calculateRecommendationScore(
        business.category,
        favoriteCategory,
        distanceMeters,
        discount
      );

      return { ...business, distanceMeters, discount, score };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <main style={{ background: "#f3f4f6", minHeight: "100vh", padding: 20 }}>
      <section
        style={{
          maxWidth: 390,
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: 28,
          padding: 20,
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
          fontFamily: "Arial",
        }}
      >
        <h2 style={{ color: "#4b0082", marginBottom: 4 }}>Hola, Ana 👋</h2>
        <p style={{ color: "#666", marginTop: 0 }}>Tu saldo disponible</p>

        <h1 style={{ fontSize: 36, margin: "8px 0" }}>$120.00</h1>

        <div style={{ display: "flex", gap: 10, margin: "20px 0" }}>
          {["Pagar", "Transferir", "Recargar"].map((item) => (
            <button
              key={item}
              style={{
                flex: 1,
                background: "#4b0082",
                color: "white",
                border: "none",
                borderRadius: 16,
                padding: 12,
                fontWeight: "bold",
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <h3>📍 DeUna Nearby</h3>
        <p style={{ color: "#666", fontSize: 14 }}>
          Beneficios recomendados según tus hábitos y ubicación.
        </p>

        {recommendations?.map((business) => (
          <div
            key={business.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 18,
              padding: 14,
              marginTop: 12,
              background: "#fafafa",
            }}
          >
            <strong>{business.name}</strong>
            <p style={{ margin: "6px 0", color: "#555" }}>
              {business.category} · {business.distanceMeters} m
            </p>

            <p style={{ margin: "6px 0", color: "#4b0082" }}>
              {business.discount}% beneficio DeUna
            </p>

            <small>{business.score}% compatible contigo</small>
          </div>
        ))}
      </section>
    </main>
  );
}