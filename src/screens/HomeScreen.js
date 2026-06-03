import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';
import { useSensor } from '../context/SensorContext';

export default function HomeScreen({ onNavigate }) {
  const { sensorData, aiAnalysis, isAnalyzing, fetchAiAnalysis } = useSensor();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>空气守护者</Text>
        <View style={styles.headerIcons}>
          <Text>📊</Text>
          <Text>📱</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>设备连接</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.containedButton}
            onPress={() => onNavigate('scan')}
          >
            <Text style={styles.buttonText}>扫描设备</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.outlinedButton}
          >
            <Text style={styles.outlinedButtonText}>断开</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>状态:</Text>
          <Text style={styles.statusText}>已连接</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>实时空气质量</Text>
        <View style={styles.dataGrid}>
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>PM2.5</Text>
            <Text style={styles.dataValue}>{sensorData?.pm25?.toFixed(1) || '--'}</Text>
            <Text style={styles.dataUnit}>μg/m³</Text>
          </View>
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>CO₂</Text>
            <Text style={styles.dataValue}>{sensorData?.co2?.toFixed(0) || '--'}</Text>
            <Text style={styles.dataUnit}>ppm</Text>
          </View>
        </View>
        <View style={styles.dataGrid}>
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>温度</Text>
            <Text style={styles.dataValue}>{sensorData?.temperature?.toFixed(1) || '--'}</Text>
            <Text style={styles.dataUnit}>°C</Text>
          </View>
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>湿度</Text>
            <Text style={styles.dataValue}>{sensorData?.humidity?.toFixed(1) || '--'}</Text>
            <Text style={styles.dataUnit}>%</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>AI 健康分析</Text>
        <TouchableOpacity 
          style={styles.containedButton}
          onPress={fetchAiAnalysis}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>获取空气质量分析</Text>
          )}
        </TouchableOpacity>
        <View style={styles.analysisBox}>
          <Text style={styles.analysisText}>
            {aiAnalysis || '当前空气质量良好...'}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.outlinedButtonFull}
        onPress={() => onNavigate('history')}
      >
        <Text style={styles.outlinedButtonText}>查看历史趋势</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
    backgroundColor: COLORS.background,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary },
  headerIcons: { flexDirection: 'row', gap: 12 },
  card: {
    margin: 16,
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 12 },
  buttonRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  containedButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  outlinedButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlinedButtonText: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '500' },
  outlinedButtonFull: {
    margin: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusLabel: { color: COLORS.textSecondary },
  statusText: { color: COLORS.success, marginLeft: 8 },
  dataGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  dataItem: { alignItems: 'center' },
  dataLabel: { color: COLORS.textSecondary, marginBottom: 8, fontSize: 12 },
  dataValue: { fontWeight: 'bold', fontSize: 24, color: COLORS.textPrimary },
  dataUnit: { color: COLORS.textSecondary, fontSize: 12 },
  analysisBox: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    minHeight: 60,
    marginTop: 8,
  },
  analysisText: { fontSize: 14, color: '#333', lineHeight: 20 },
  bottomSpacer: { height: 100 },
});
