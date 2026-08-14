import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

interface BarChartProps {
  data: number[];
  labels: string[];
  maxValue?: number;
  height?: number;
  color?: string;
}

export default function SimpleBarChart({
  data,
  labels,
  maxValue = 5,
  height = 150,
  color = '#1a1a2e',
}: BarChartProps) {
  const maxDataValue = Math.max(...data, 1);
  const chartHeight = height - 30;

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.chartArea}>
        {data.map((value, index) => {
          const barHeight = (value / Math.max(maxDataValue, maxValue)) * chartHeight;
          const isHighlight = value > 3;
          return (
            <View key={index} style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max(barHeight, 4),
                    backgroundColor: isHighlight ? '#FF6B6B' : color,
                  },
                ]}
              />
              <Text style={styles.barLabel}>{labels[index] || ''}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 4,
  },
  chartArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
});
