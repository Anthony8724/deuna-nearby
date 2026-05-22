"use client";

import { motion } from "framer-motion";
import { Bell, Brain } from "lucide-react";

import { AIInsightPanel } from "@/app/features/smart-notifications/components/AIInsightPanel";
import {
  PushNotificationPreview,
  pushPreviewPropsFromUltimaNotificacion,
} from "@/app/features/smart-notifications/components/PushNotificationPreview";
import { SmartNotificationSimulator } from "@/app/features/smart-notifications/components/SmartNotificationSimulator";
import { DEMO_USER } from "@/app/features/smart-notifications/config/demo";
import type { UseSmartNotificationsReturn } from "@/app/features/smart-notifications/hooks/useSmartNotifications";

import { premium } from "@/app/_components/ui/premium";
import { SectionEyebrow } from "@/app/_components/ui/SectionEyebrow";

import { DemoBadge } from "./DemoBadge";

type DemoWorkspaceProps = {
  demo: UseSmartNotificationsReturn;
};

export function DemoWorkspace({ demo }: DemoWorkspaceProps) {
  return (
    <section id="simulador" className="mb-20 scroll-mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-6 flex items-end justify-between gap-4"
      >
        <div>
          <SectionEyebrow>Simulador</SectionEyebrow>
          <h2 className={`mt-4 ${premium.h2} text-2xl sm:text-3xl`}>
            Demo en vivo
          </h2>
          <p className={`mt-2 ${premium.body}`}>
            Red de 19 comercios · scoring 45/35/20 · push con IA y explicabilidad.
          </p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`flex max-h-[min(720px,85vh)] flex-col overflow-hidden ${premium.cardLg} shadow-stripe-lg`}
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-white/60" strokeWidth={1.75} />
              <h3 className="font-semibold text-white">Simulador IA</h3>
            </div>
            <DemoBadge variant="live">Live</DemoBadge>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            <SmartNotificationSimulator
              embedded
              demoState={demo}
              hideLastNotification
            />
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">
          <AIInsightPanel
            recomendaciones={demo.recomendaciones}
            ultimaNotificacion={demo.ultimaNotificacion}
            userId={DEMO_USER.id}
            loading={demo.loading}
          />

          {demo.ultimaNotificacion ? (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${premium.cardLg} p-4 sm:p-5`}
            >
              <div className="mb-4 flex items-center gap-2 text-white/70">
                <Bell className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Vista previa push
                </span>
              </div>
              <PushNotificationPreview
                key={demo.ultimaNotificacion.id}
                {...pushPreviewPropsFromUltimaNotificacion(
                  demo.ultimaNotificacion,
                )}
              />
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
