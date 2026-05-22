import type { NearbyMoment } from "@/types/nearby-moment";
import type {
  SmartPushNotification,
  SmartRecommendation,
} from "@/types/smart-recommendation";

const STORAGE_KEY = "deuna-smart-push-queue";

function loadQueue(): SmartPushNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SmartPushNotification[]) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: SmartPushNotification[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(queue.slice(0, 20)));
}

export const notificationGenerator = {
  generate(recommendations: SmartRecommendation[]): SmartPushNotification[] {
    const now = Date.now();

    return recommendations.slice(0, 2).map((rec, index) => ({
      id: `push-${rec.id}-${now}-${index}`,
      title: "DeUna Nearby",
      body: `${rec.merchantName} · ${rec.benefit} · ${rec.distance}`,
      recommendationId: rec.id,
      createdAt: now + index * 1200,
      read: false,
    }));
  },

  enqueue(notifications: SmartPushNotification[]): SmartPushNotification[] {
    const existing = loadQueue();
    const existingIds = new Set(existing.map((n) => n.recommendationId));
    const fresh = notifications.filter((n) => !existingIds.has(n.recommendationId));
    const merged = [...fresh, ...existing].slice(0, 20);
    saveQueue(merged);
    return merged;
  },

  enqueueFromMoment(moment: NearbyMoment): SmartPushNotification[] {
    const notification: SmartPushNotification = {
      id: `push-${moment.id}-${Date.now()}`,
      title: "DeUna Nearby",
      body: `${moment.merchantName} · ${moment.benefit} · ${moment.distance}`,
      recommendationId: moment.id,
      createdAt: Date.now(),
      read: false,
    };
    return this.enqueue([notification]);
  },

  getQueue(): SmartPushNotification[] {
    return loadQueue();
  },

  markRead(id: string) {
    const queue = loadQueue().map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    saveQueue(queue);
  },

  markReadByRecommendationId(recommendationId: string) {
    const queue = loadQueue().map((n) =>
      n.recommendationId === recommendationId ? { ...n, read: true } : n,
    );
    saveQueue(queue);
  },
};
