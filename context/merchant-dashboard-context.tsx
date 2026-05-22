"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { DashboardPeriod, MerchantDashboardData } from "@/types/merchant-dashboard";
import {
  applyDashboardPeriod,
  buildTransactionsCsv,
  downloadTextFile,
} from "@/lib/merchant-period";

const SETTINGS_KEY = "deuna-merchant-settings";

type MerchantSettings = {
  qrActive: boolean;
  isOpen: boolean;
  peakHours: string;
};

type MerchantDashboardContextValue = {
  period: DashboardPeriod;
  setPeriod: (period: DashboardPeriod) => void;
  data: MerchantDashboardData;
  qrActive: boolean;
  isOpen: boolean;
  peakHours: string;
  showAllTransactions: boolean;
  setShowAllTransactions: (value: boolean) => void;
  hoursSheetOpen: boolean;
  toast: string | null;
  scrollToSection: (id: string) => void;
  toggleQrActive: () => void;
  generateQr: () => void;
  downloadReport: () => void;
  openHoursEditor: () => void;
  closeHoursEditor: () => void;
  saveHours: (next: { isOpen: boolean; peakHours: string }) => void;
  dismissToast: () => void;
  showMessage: (message: string) => void;
  activeNav: "panel" | "ventas" | "qr";
  setActiveNav: (nav: "panel" | "ventas" | "qr") => void;
};

const MerchantDashboardContext =
  createContext<MerchantDashboardContextValue | null>(null);

function loadSettings(fallback: MerchantSettings): MerchantSettings {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = sessionStorage.getItem(SETTINGS_KEY);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function persistSettings(settings: MerchantSettings) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function MerchantDashboardProvider({
  baseData,
  children,
}: {
  baseData: MerchantDashboardData;
  children: React.ReactNode;
}) {
  const [period, setPeriodState] = useState<DashboardPeriod>("hoy");
  const [settings, setSettings] = useState<MerchantSettings>(() =>
    loadSettings({
      qrActive: baseData.qrActive,
      isOpen: baseData.isOpen,
      peakHours: "12:00 – 14:00",
    }),
  );
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [hoursSheetOpen, setHoursSheetOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<"panel" | "ventas" | "qr">("panel");

  useEffect(() => {
    setSettings((prev) =>
      loadSettings({
        qrActive: baseData.qrActive,
        isOpen: baseData.isOpen,
        peakHours: prev.peakHours,
      }),
    );
  }, [baseData.qrActive, baseData.isOpen]);

  const setPeriod = useCallback((next: DashboardPeriod) => {
    setPeriodState(next);
    setShowAllTransactions(false);
    setToast(`Mostrando datos de ${next === "hoy" ? "hoy" : next === "semana" ? "la semana" : "el mes"}`);
  }, []);

  const data = useMemo(() => {
    const withPeriod = applyDashboardPeriod(baseData, period);
    return {
      ...withPeriod,
      qrActive: settings.qrActive,
      isOpen: settings.isOpen,
    };
  }, [baseData, period, settings.qrActive, settings.isOpen]);

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (id === "ventas") setActiveNav("ventas");
    else if (id === "qr") setActiveNav("qr");
    else setActiveNav("panel");
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "ventas" || hash === "qr") {
      scrollToSection(hash);
    }
  }, [scrollToSection]);

  const updateSettings = useCallback((patch: Partial<MerchantSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      persistSettings(next);
      return next;
    });
  }, []);

  const toggleQrActive = useCallback(() => {
    updateSettings({ qrActive: !settings.qrActive });
    showToast(settings.qrActive ? "QR desactivado" : "QR activado para cobros");
  }, [settings.qrActive, updateSettings, showToast]);

  const generateQr = useCallback(() => {
    updateSettings({ qrActive: true });
    scrollToSection("qr");
    showToast("QR listo para cobrar");
  }, [scrollToSection, showToast, updateSettings]);

  const downloadReport = useCallback(() => {
    const csv = buildTransactionsCsv(data, period);
    const filename = `deuna-${data.merchantId}-${period}-${Date.now()}.csv`;
    downloadTextFile(filename, csv);
    showToast("Reporte descargado");
  }, [data, period, showToast]);

  const openHoursEditor = useCallback(() => setHoursSheetOpen(true), []);
  const closeHoursEditor = useCallback(() => setHoursSheetOpen(false), []);

  const saveHours = useCallback(
    (next: { isOpen: boolean; peakHours: string }) => {
      updateSettings(next);
      setHoursSheetOpen(false);
      showToast(next.isOpen ? "Horario actualizado · Abierto" : "Horario actualizado · Cerrado");
    },
    [showToast, updateSettings],
  );

  const value = useMemo(
    () => ({
      period,
      setPeriod,
      data,
      qrActive: settings.qrActive,
      isOpen: settings.isOpen,
      peakHours: settings.peakHours,
      showAllTransactions,
      setShowAllTransactions,
      hoursSheetOpen,
      toast,
      scrollToSection,
      toggleQrActive,
      generateQr,
      downloadReport,
      openHoursEditor,
      closeHoursEditor,
      saveHours,
      dismissToast,
      showMessage: showToast,
      activeNav,
      setActiveNav,
    }),
    [
      period,
      setPeriod,
      data,
      settings.qrActive,
      settings.isOpen,
      settings.peakHours,
      showAllTransactions,
      hoursSheetOpen,
      toast,
      scrollToSection,
      toggleQrActive,
      generateQr,
      downloadReport,
      openHoursEditor,
      closeHoursEditor,
      saveHours,
      dismissToast,
      showToast,
      activeNav,
    ],
  );

  return (
    <MerchantDashboardContext.Provider value={value}>
      {children}
    </MerchantDashboardContext.Provider>
  );
}

export function useMerchantDashboard() {
  const ctx = useContext(MerchantDashboardContext);
  if (!ctx) {
    throw new Error("useMerchantDashboard must be used within MerchantDashboardProvider");
  }
  return ctx;
}
