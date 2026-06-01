import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, StatusBar } from 'react-native';
import ScanModal from './ScanModal';
import HistoryTrend from './HistoryTrend';

export default function DeviceDashboard() {
  const [status, setStatus] = useState('未连接');
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [sensorData, setSensorData] = useState({
    pm25: '--',
    co2: '--',
    temperature: '--',
    humidity: '--',
  });
  const [aiResult, setAiResult] = useState('');
  const [showScanModal, setShowScanModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // 模拟数据更新
  useEffect(() => {
    if (connectedDevice) {
      const interval = setInterval(() => {
        setSensorData({
          pm25: Math.floor(Math.random() * 50 + 20).toString(),
          co2: Math.floor(Math.random() * 100 + 400).toString(),
          temperature: (Math.random() * 5 + 20).toFixed(1),
          humidity: Math.floor(Math.random() * 30 + 40).toString(),
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [connectedDevice]);

  const handleConnect = (device) => {
    setConnectedDevice(device);
    setStatus(`已连接: ${device.name}`);
  };

  const handleDisconnect = () => {
    setConnectedDevice(null);
    setStatus('未连接');
    setSensorData({
      pm25: '--',
      co2: '--',
      temperature: '--',
      humidity: '--',
    });
  };

  const getAiAnalysis = () => {
    setAiResult('分析中...');
    setTimeout(() => {
      const results = [
        '当前空气质量良好，适合户外活动。',
        '空气质量一般，建议减少户外活动时间。',
        '空气质量较差，建议佩戴口罩。',
        '当前空气质量优，非常适合户外活动！',
      ];
      setAiResult(results[Math.floor(Math.random() * results.length)]);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />

      {/* 头部标题 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logo}>🌬️</Text>
          <Text style={styles.title}>空气守护者</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerIcon}>📊</Text>
          <Text style={styles.headerIcon}>📱</Text>
        </View>
      </View>

      {/* 设备连接区 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>设备连接</Text>
        <View style={styles.controlRow}>
          <Button
            title="扫描设备"
            onPress={() => setShowScanModal(true)}
            color="#2196F3"
          />
          <Button
            title="断开"
            onPress={handleDisconnect}
            color="#f44336"
            disabled={!connectedDevice}
          />
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>状态:</Text>
          <Text style={[styles.statusValue, connectedDevice ? styles.statusConnected : styles.statusDisconnected]}>
            {status}
          </Text>
        </View>
      </View>

      {/* 实时空气质量区 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 实时空气质量</Text>
        <View style={styles.dataGrid}>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>PM2.5</Text>
            <Text style={styles.dataValue}>{sensorData.pm25}</Text>
            <Text style={styles.dataUnit}>μg/m³</Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>CO₂</Text>
            <Text style={styles.dataValue}>{sensorData.co2}</Text>
            <Text style={styles.dataUnit}>ppm</Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>温度</Text>
            <Text style={styles.dataValue}>{sensorData.temperature}</Text>
            <Text style={styles.dataUnit}>°C</Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>湿度</Text>
            <Text style={styles.dataValue}>{sensorData.humidity}</Text>
            <Text style={styles.dataUnit}>%</Text>
          </View>
        </View>
      </View>

      {/* AI健康分析区 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🤖 AI 健康分析</Text>
        <Button
          title="获取空气质量分析"
          onPress={getAiAnalysis}
          color="#2196F3"
        />
        <View style={styles.aiResult}>
          <Text style={styles.aiText}>
            {aiResult || '当前空气质量良好...'}
          </Text>
        </View>
      </View>

      {/* 底部按钮 */}
      <View style={styles.bottomButton}>
        <Button title="查看历史趋势" onPress={() => setShowHistory(true)} color="#2196F3" />
      </View>

      {/* 扫描弹窗 */}
      <ScanModal
        visible={showScanModal}
        onClose={() => setShowScanModal(false)}
        onConnect={handleConnect}
      />

      {/* 历史趋势页 */}
      <HistoryTrend
        visible={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    fontSize: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIcon: {
    fontSize: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  controlRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusConnected: {
    color: '#4CAF50',
  },
  statusDisconnected: {
    color: '#9E9E9E',
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dataCard: {
    width: '45%',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  dataValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  dataUnit: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  aiResult: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    minHeight: 48,
  },
  aiText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomButton: {
    marginTop: 8,
  },
});