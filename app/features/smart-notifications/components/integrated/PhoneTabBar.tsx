"use client";



import { motion } from "framer-motion";

import { Home, User, Wallet } from "lucide-react";



import { deuna } from "../../styles/deuna-ui";



export type DeUnaTabId = "home" | "pay" | "profile";



const TABS: {

  id: DeUnaTabId;

  label: string;

  icon: typeof Home;

}[] = [

  { id: "home", label: "Inicio", icon: Home },

  { id: "pay", label: "Billetera", icon: Wallet },

  { id: "profile", label: "Tú", icon: User },

];



type PhoneTabBarProps = {

  activeTab: DeUnaTabId;

  onTabPress: (tab: DeUnaTabId) => void;

};



export function PhoneTabBar({ activeTab, onTabPress }: PhoneTabBarProps) {

  return (

    <nav

      className={`relative z-50 shrink-0 ${deuna.tabBar}`}

      style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom, 6px))" }}

    >

      <div className="flex items-stretch justify-around px-2 pt-1.5">

        {TABS.map((tab) => {

          const Icon = tab.icon;

          const active = tab.id === activeTab;

          return (

            <button

              key={tab.id}

              type="button"

              onClick={() => onTabPress(tab.id)}

              className="relative flex min-w-0 flex-1 flex-col items-center gap-1 py-1 touch-manipulation"

              aria-current={active ? "page" : undefined}

            >

              <span className="flex h-8 w-8 items-center justify-center">

                <Icon

                  className={`h-[18px] w-[18px] transition-colors ${

                    active ? deuna.brandText : deuna.tabInactive

                  }`}

                  strokeWidth={active ? 2.25 : 1.75}

                />

              </span>

              <span

                className={`text-[10px] font-semibold ${

                  active ? deuna.brandText : deuna.tabInactive

                }`}

              >

                {tab.label}

              </span>

            </button>

          );

        })}

      </div>

    </nav>

  );

}


