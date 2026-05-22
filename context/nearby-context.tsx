"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { nearbyMoments } from "@/constants/nearby-moments";
import { notificationGenerator } from "@/lib/notification-generator";
import type { NearbyMoment } from "@/types/nearby-moment";
import type { SmartPushNotification } from "@/types/smart-recommendation";
import { shallowEqualMomentIds } from "@/lib/shallow-equal";
import { NearbyIntelligenceSync } from "@/components/nearby/nearby-intelligence-sync";
import { NearbyNotificationToast } from "@/components/nearby/nearby-notification-toast";

type NearbyState = {
  activeMoment: NearbyMoment | null;
  isSheetOpen: boolean;
  visibleMoments: NearbyMoment[];
  carouselMoments: NearbyMoment[];
  pushQueue: SmartPushNotification[];
  unreadCount: number;
};

type NearbyActions = {
  openSheet: (moment: NearbyMoment) => void;
  closeSheet: () => void;
  dismissMoment: (id: string) => void;
  markNotificationRead: (notificationId: string) => void;
  refreshPushQueue: () => void;
  registerSmartMoments: (moments: NearbyMoment[]) => void;
  openTopNotification: () => void;
  getMomentById: (id: string) => NearbyMoment | undefined;
};

type NearbyContextValue = NearbyState & NearbyActions;

const NearbyStateContext = createContext<NearbyState | null>(null);
const NearbyActionsContext = createContext<NearbyActions | null>(null);
const NearbyContext = createContext<NearbyContextValue | null>(null);

export function NearbyProvider({ children }: { children: React.ReactNode }) {
  const [activeMoment, setActiveMoment] = useState<NearbyMoment | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [smartMoments, setSmartMoments] = useState<NearbyMoment[]>([]);
  const [pushQueue, setPushQueue] = useState<SmartPushNotification[]>([]);

  const pushQueueRef = useRef(pushQueue);
  pushQueueRef.current = pushQueue;
  const smartMomentsRef = useRef(smartMoments);
  smartMomentsRef.current = smartMoments;

  const visibleMoments = useMemo(
    () => nearbyMoments.filter((m) => !dismissedIds.includes(m.id)),
    [dismissedIds],
  );

  const carouselMoments = useMemo(() => {
    const staticVisible = visibleMoments;
    const seen = new Set(
      staticVisible.map((m) => m.merchantName?.toLowerCase()).filter(Boolean),
    );
    const extra = smartMoments.filter((m) => {
      if (dismissedIds.includes(m.id)) return false;
      const name = m.merchantName?.toLowerCase();
      return name ? !seen.has(name) : true;
    });
    return [...staticVisible, ...extra];
  }, [visibleMoments, smartMoments, dismissedIds]);

  const carouselMomentsRef = useRef(carouselMoments);
  carouselMomentsRef.current = carouselMoments;

  const unreadCount = useMemo(
    () => pushQueue.filter((n) => !n.read).length,
    [pushQueue],
  );

  const refreshPushQueue = useCallback(() => {
    setPushQueue(notificationGenerator.getQueue());
  }, []);

  const getMomentById = useCallback((id: string) => {
    return [...nearbyMoments, ...smartMomentsRef.current].find((m) => m.id === id);
  }, []);

  const registerSmartMoments = useCallback((moments: NearbyMoment[]) => {
    setSmartMoments((prev) =>
      shallowEqualMomentIds(prev, moments) ? prev : moments,
    );
  }, []);

  const openSheet = useCallback((moment: NearbyMoment) => {
    setActiveMoment(moment);
    setIsSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setIsSheetOpen(false);
  }, []);

  const dismissMoment = useCallback((id: string) => {
    setDismissedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const markNotificationRead = useCallback(
    (notificationId: string) => {
      notificationGenerator.markRead(notificationId);
      refreshPushQueue();
    },
    [refreshPushQueue],
  );

  const openTopNotification = useCallback(() => {
    const unread = pushQueueRef.current.filter((n) => !n.read);
    const top = unread[0];

    if (top) {
      const moment = [...nearbyMoments, ...smartMomentsRef.current].find(
        (m) => m.id === top.recommendationId,
      );
      if (moment) {
        markNotificationRead(top.id);
        openSheet(moment);
        return;
      }
    }

    const first = carouselMomentsRef.current[0];
    if (first) openSheet(first);
  }, [markNotificationRead, openSheet]);

  const state = useMemo(
    () => ({
      activeMoment,
      isSheetOpen,
      visibleMoments,
      carouselMoments,
      pushQueue,
      unreadCount,
    }),
    [
      activeMoment,
      isSheetOpen,
      visibleMoments,
      carouselMoments,
      pushQueue,
      unreadCount,
    ],
  );

  const actions = useMemo(
    () => ({
      openSheet,
      closeSheet,
      dismissMoment,
      markNotificationRead,
      refreshPushQueue,
      registerSmartMoments,
      openTopNotification,
      getMomentById,
    }),
    [
      openSheet,
      closeSheet,
      dismissMoment,
      markNotificationRead,
      refreshPushQueue,
      registerSmartMoments,
      openTopNotification,
      getMomentById,
    ],
  );

  const value = useMemo(
    () => ({ ...state, ...actions }),
    [state, actions],
  );

  return (
    <NearbyContext.Provider value={value}>
      <NearbyActionsContext.Provider value={actions}>
        <NearbyStateContext.Provider value={state}>
          <NearbyIntelligenceSync />
          {children}
          <NearbyNotificationToast />
        </NearbyStateContext.Provider>
      </NearbyActionsContext.Provider>
    </NearbyContext.Provider>
  );
}

export function useNearby() {
  const ctx = useContext(NearbyContext);
  if (!ctx) {
    throw new Error("useNearby must be used within NearbyProvider");
  }
  return ctx;
}

export function useNearbyState() {
  const ctx = useContext(NearbyStateContext);
  if (!ctx) {
    throw new Error("useNearbyState must be used within NearbyProvider");
  }
  return ctx;
}

export function useNearbyActions() {
  const ctx = useContext(NearbyActionsContext);
  if (!ctx) {
    throw new Error("useNearbyActions must be used within NearbyProvider");
  }
  return ctx;
}

/** @deprecated Use useNearby */
export const useNearbySidebar = useNearby;

/** @deprecated Use NearbyProvider */
export const NearbySidebarProvider = NearbyProvider;
