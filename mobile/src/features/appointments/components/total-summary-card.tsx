import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { type AppointmentStats } from "../lib/utils";

interface StatRow {
  label: string;
  count: number;
  barColor: string;
  pct: number;
}

interface TotalSummaryCardProps {
  stats: AppointmentStats;
}

export function TotalSummaryCard({ stats }: TotalSummaryCardProps) {
  const { t } = useTranslation();
  const total =
    stats.totalConfirmed +
    stats.totalOffered +
    stats.totalCompleted +
    stats.totalCancelled;

  const rows: StatRow[] = [
    {
      label: t("professional.dashboard.stats.confirmed"),
      count: stats.totalConfirmed,
      barColor: "#14d3ac",
      pct: total > 0 ? stats.totalConfirmed / total : 0,
    },
    {
      label: t("professional.dashboard.stats.completed"),
      count: stats.totalCompleted,
      barColor: "#00e984",
      pct: total > 0 ? stats.totalCompleted / total : 0,
    },
    {
      label: t("professional.dashboard.stats.offered"),
      count: stats.totalOffered,
      barColor: "#3fa6ff",
      pct: total > 0 ? stats.totalOffered / total : 0,
    },
    {
      label: t("professional.dashboard.stats.cancelled"),
      count: stats.totalCancelled,
      barColor: "rgba(0,84,110,0.4)",
      pct: total > 0 ? stats.totalCancelled / total : 0,
    },
  ];

  return (
    <View
      className="bg-white rounded-2xl p-4 gap-4 border border-brand-secondary/5"
      style={{
        shadowColor: "#00394a",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <Text className="text-lg font-semibold text-brand-dark tracking-tight">
        {t("professional.dashboard.stats.totalAppointments")}
      </Text>
      <View className="gap-3">
        {rows.map((row) => (
          <View key={row.label} className="flex-row items-center gap-3">
            <Text className="text-xs font-medium text-brand-secondary/70 w-20 shrink-0">
              {row.label}
            </Text>
            <View
              className="flex-1 h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: "rgba(0,84,110,0.07)" }}
            >
              <View
                className="h-full rounded-full"
                style={{
                  width: `${Math.round(row.pct * 100)}%`,
                  backgroundColor: row.barColor,
                }}
              />
            </View>
            <Text className="text-sm font-semibold text-brand-dark w-6 text-right shrink-0">
              {String(row.count).padStart(2, "0")}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
