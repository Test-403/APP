import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { COLORS } from '../constants/colors';

export default function AirQualityCard({ title, value, unit, icon, color }) {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Text style={[styles.icon, { color }]}>{icon}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text variant="bodySmall" style={styles.title}>{title}</Text>
          <View style={styles.valueContainer}>
            <Text variant="headlineMedium" style={[styles.value, { color }]}>
              {value}
            </Text>
            <Text variant="bodySmall" style={styles.unit}>{unit}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  unit: {
    color: COLORS.textSecondary,
  },
});
