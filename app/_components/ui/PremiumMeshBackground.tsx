/** Fondo marketing — malla sutil tipo Stripe, sin blobs violeta pesados */

export function PremiumMeshBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black premium-mesh">
      <div className="absolute inset-0 premium-grid opacity-40" />
      <div
        className="absolute -top-[40%] left-1/2 h-[min(900px,80vh)] w-[min(1200px,100vw)] -translate-x-1/2 rounded-full opacity-90"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(99, 91, 255, 0.12) 0%, transparent 68%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 h-[400px] w-[400px] opacity-60"
        style={{
          background:
            "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.03), transparent 60%)",
        }}
      />
    </div>
  );
}
