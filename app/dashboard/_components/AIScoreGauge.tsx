"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";

type AIScoreGaugeProps = {
  score: number;
  matchIa: number;
};

export function AIScoreGauge({ score, matchIa }: AIScoreGaugeProps) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#f4f4f5"
            strokeWidth="10"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-zinc-900">{score}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            / 100
          </span>
        </div>
      </div>
      <div className="max-w-xs space-y-2 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2 sm:justify-start">
          <Brain className="h-5 w-5 text-[#635bff]" />
          <p className="font-semibold text-zinc-900">Score efectividad IA</p>
        </div>
        <p className="text-sm text-zinc-500">
          Match IA promedio de{" "}
          <span className="font-mono font-semibold text-[#635bff]">
            {(matchIa * 100).toFixed(0)}%
          </span>{" "}
          en recomendaciones enviadas a usuarios cercanos.
        </p>
      </div>
    </div>
  );
}
