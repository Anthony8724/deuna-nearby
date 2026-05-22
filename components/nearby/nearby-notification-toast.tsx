"use client";

import { useEffect, useMemo, useState } from "react";
import { demoTimings } from "@/constants/demo";
import { useNearbyActions, useNearbyState } from "@/context/nearby-context";
import { SmartNotification } from "./smart-notification";

export function NearbyNotificationToast() {
  const { pushQueue, isSheetOpen } = useNearbyState();
  const { getMomentById, openSheet, markNotificationRead } = useNearbyActions();

  const topUnread = useMemo(
    () => pushQueue.find((n) => !n.read),
    [pushQueue],
  );

  const moment = topUnread
    ? getMomentById(topUnread.recommendationId)
    : undefined;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!topUnread || !moment || isSheetOpen) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => setVisible(true), demoTimings.notificationToastMs);
    return () => clearTimeout(timer);
  }, [topUnread?.id, moment?.id, isSheetOpen, topUnread, moment]);

  useEffect(() => {
    if (isSheetOpen) setVisible(false);
  }, [isSheetOpen]);

  if (!topUnread || !moment) return null;

  return (
    <SmartNotification
      moment={moment}
      visible={visible}
      onOpen={() => {
        markNotificationRead(topUnread.id);
        setVisible(false);
        openSheet(moment);
      }}
      onDismiss={() => {
        markNotificationRead(topUnread.id);
        setVisible(false);
      }}
    />
  );
}
