import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function SensorCard({ title, value, unit }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.unit}>{unit}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    minWidth: '45%',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  infoContainer: {
    alignItems: 'center',
  },
  title: {
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontSize: 12,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginRight: 4,
    fontSize: 24,
  },
  unit: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});