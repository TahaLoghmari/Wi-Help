import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView as NativeScrollView,
  StyleSheet,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import {
  HOUR_VALUES,
  MINUTE_VALUES,
  ITEM_H,
  VISIBLE_ITEMS,
  WHEEL_PAD,
} from "@/features/professionals/lib/utils";

export interface WheelColumnProps {
  items: string[];
  initialIndex: number;
  onChange: (index: number) => void;
}

export function WheelColumn({
  items,
  initialIndex,
  onChange,
}: WheelColumnProps) {
  const scrollRef = useRef<NativeScrollView>(null);
  const [activeIdx, setActiveIdx] = useState(initialIndex);

  useEffect(() => {
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: initialIndex * ITEM_H,
        animated: false,
      });
    }, 60);
    return () => clearTimeout(t);
  }, [initialIndex]);

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const idx = Math.max(
        0,
        Math.min(items.length - 1, Math.round(offsetY / ITEM_H)),
      );
      setActiveIdx(idx);
      onChange(idx);
    },
    [items.length, onChange],
  );

  return (
    <View style={styles.wheelContainer}>
      {/* Selection highlight */}
      <View pointerEvents="none" style={styles.wheelHighlight} />

      <NativeScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
          const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
          setActiveIdx(Math.max(0, Math.min(items.length - 1, idx)));
        }}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={{ paddingVertical: WHEEL_PAD }}
      >
        {items.map((item, i) => (
          <View key={i} style={styles.wheelItem}>
            <Text
              style={[
                styles.wheelText,
                i === activeIdx
                  ? styles.wheelTextActive
                  : styles.wheelTextInactive,
              ]}
            >
              {item}
            </Text>
          </View>
        ))}
      </NativeScrollView>
    </View>
  );
}

// Re-export for convenience
export { HOUR_VALUES, MINUTE_VALUES };

const styles = StyleSheet.create({
  wheelContainer: {
    height: ITEM_H * VISIBLE_ITEMS,
    width: 72,
    overflow: "hidden",
  },
  wheelHighlight: {
    position: "absolute",
    top: WHEEL_PAD,
    left: 4,
    right: 4,
    height: ITEM_H,
    borderRadius: 10,
    backgroundColor: "rgba(0,57,74,0.07)",
    zIndex: 10,
  },
  wheelItem: {
    height: ITEM_H,
    alignItems: "center",
    justifyContent: "center",
  },
  wheelText: {
    fontSize: 20,
  },
  wheelTextActive: {
    color: "#00394a",
    fontWeight: "600",
  },
  wheelTextInactive: {
    color: "rgba(0,84,110,0.35)",
    fontWeight: "400",
  },
});
