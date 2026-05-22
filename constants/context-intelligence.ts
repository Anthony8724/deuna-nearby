export type AiContextType = "habits" | "frequency" | "location" | "promo";

export const aiContextLabels: Record<AiContextType, string> = {
  habits: "Basado en tus hábitos",
  frequency: "Frecuentas cafeterías por las mañanas",
  location: "Promoción relevante cerca de ti",
  promo: "Promoción relevante cerca de ti",
};

export type ContextualInsight = {
  id: string;
  type: AiContextType;
  message: string;
  shortLabel: string;
};

export function getHomeInsight(): ContextualInsight {
  const hour = new Date().getHours();
  if (hour < 11) {
    return {
      id: "morning-frequency",
      type: "frequency",
      message: "Frecuentas cafeterías por las mañanas",
      shortLabel: "Basado en tus hábitos",
    };
  }
  if (hour < 15) {
    return {
      id: "lunch-promo",
      type: "promo",
      message: "Promoción relevante cerca de ti",
      shortLabel: "Cerca de ti",
    };
  }
  return {
    id: "habits-default",
    type: "habits",
    message: "Basado en tus hábitos de consumo",
    shortLabel: "Personalizado",
  };
}
