import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../constants/colors';
import AirQualityCard from '../components/AirQualityCard';

const getAQILevel = (aqi) => {
  if (aqi <= 50) return { level: '优', color: COLORS.aqiExcellent, desc: '空气质量令人满意，基本无污染' };
  if (aqi <= 100) return { level: '良', color: COLORS.aqiGood, desc: '空气质量可接受，某些污染物可能对少数敏感人群有影响' };
  if (aqi <= 150) return { level: '轻度污染', color: COLORS.aqiLightPollution, desc: '易感人群症状有轻度加剧' };
  if (aqi <= 200) return { level: '中度污染', color: COLORS.aqiMediumPollution, desc: '进一步加剧易感人群症状' };
  if (aqi <= 300) return { level: '重度污染', color: COLORS.aqiHeavyPollution, desc: '所有人的健康都可能受到影响' };
  return { level: '严重污染', color: COLORS.aqiSeverePollution, desc: '健康人群也会出现明显症状' };
};

export default function HomeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [airQuality, setAirQuality] = useState({
    aqi: 45,
    pm25: 23,
    pm10: 45,
    so2: 8,
    no2: 25,
    co: 0.8,
    o3: 65,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const aqiInfo = getAQILevel(airQuality.aqi);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>正在检测空气质量...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.headerTitle}>空气质量检测</Text>
        <Text variant="bodySmall" style={styles.headerSubtitle}>实时监测 · 智能分析</Text>
      </View>

      <Card style={styles.mainCard}>
        <Card.Content style={styles.mainCardContent}>
          <View style={styles.aqiCircle}>
            <Text variant="displayLarge" style={[styles.aqiValue, { color: aqiInfo.color }]}>
              {airQuality.aqi}
            </Text>
            <Text variant="bodySmall" style={styles.aqiUnit}>AQI</Text>
          </View>
          <View style={styles.aqiInfo}>
            <Text variant="headlineMedium" style={[styles.aqiLevel, { color: aqiInfo.color }]}>
              {aqiInfo.level}
            </Text>
            <Text variant="bodySmall" style={styles.aqiDesc}>{aqiInfo.desc}</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>主要污染物</Text>
        <View style={styles.cardGrid}>
          <AirQualityCard
            title="PM2.5"
            value={airQuality.pm25}
            unit="μg/m³"
            icon="cloud"
            color={airQuality.pm25 > 35 ? COLORS.warning : COLORS.success}
          />
          <AirQualityCard
            title="PM10"
            value={airQuality.pm10}
            unit="μg/m³"
            icon="cloud-outline"
            color={airQuality.pm10 > 50 ? COLORS.warning : COLORS.success}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>其他污染物</Text>
        <View style={styles.cardGrid}>
          <AirQualityCard
            title="SO₂"
            value={airQuality.so2}
            unit="μg/m³"
            icon="wind"
            color={COLORS.primary}
          />
          <AirQualityCard
            title="NO₂"
            value={airQuality.no2}
            unit="μg/m³"
            icon="cloud-rain"
            color={COLORS.secondary}
          />
          <AirQualityCard
            title="CO"
            value={airQuality.co}
            unit="mg/m³"
            icon="smoke"
            color={COLORS.warning}
          />
          <AirQualityCard
            title="O₃"
            value={airQuality.o3}
            unit="μg/m³"
            icon="sun"
            color={COLORS.aqiLightPollution}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button mode="contained" style={styles.refreshButton} onPress={() => setIsLoading(true)}>
          刷新数据
        </Button>
        <Text variant="bodySmall" style={styles.lastUpdate}>
          最后更新: 刚刚
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.textSecondary,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  mainCard: {
    margin: 16,
    elevation: 4,
  },
  mainCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  aqiCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  aqiValue: {
    fontWeight: 'bold',
  },
  aqiUnit: {
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  aqiInfo: {
    flex: 1,
  },
  aqiLevel: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  aqiDesc: {
    color: COLORS.textSecondary,
    lineHeight: 1.5,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    marginBottom: 12,
    fontWeight: '600',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  refreshButton: {
    marginBottom: 12,
    width: '100%',
  },
  lastUpdate: {
    color: COLORS.textSecondary,
  },
});
