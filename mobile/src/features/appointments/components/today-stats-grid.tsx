import React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { TodayStatCard } from "./today-stat-card";
import { type AppointmentStats } from "../lib/utils";

interface TodayStatsGridProps {
  stats: AppointmentStats;
}

export function TodayStatsGrid({ stats }: TodayStatsGridProps) {
  const { t } = useTranslation();
  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <TodayStatCard
          label={t("professional.dashboard.stats.confirmed")}
          count={stats.todayConfirmed}
          bgColor="rgba(20,211,172,0.10)"
          iconBgColor="rgba(20,211,172,0.18)"
          iconName="checkmark"
          iconColor="#14d3ac"
        />
        <TodayStatCard
          label={t("professional.dashboard.stats.offered")}
          count={stats.todayOffered}
          bgColor="rgba(63,166,255,0.10)"
          iconBgColor="rgba(63,166,255,0.18)"
          iconName="time-outline"
          iconColor="#3fa6ff"
        />
      </View>
      <View className="flex-row gap-3">
        <TodayStatCard
          label={t("professional.dashboard.stats.completed")}
          count={stats.todayCompleted}
          bgColor="rgba(0,233,132,0.09)"
          iconBgColor="rgba(0,233,132,0.18)"
          iconName="checkmark-circle-outline"
          iconColor="#00e984"
        />
        <TodayStatCard
          label={t("professional.dashboard.stats.cancelled")}
          count={stats.todayCancelled}
          bgColor="rgba(0,84,110,0.07)"
          iconBgColor="rgba(0,84,110,0.12)"
          iconName="close"
          iconColor="#00546e"
        />
      </View>
    </View>
  );
}
