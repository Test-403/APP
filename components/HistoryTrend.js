import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

export default function HistoryTrend({ visible, onClose }) {
  const [activeTab, setActiveTab] = useState('pm25');
  const [historyData, setHistoryData] = useState([
    { time: '10:23', pm25: 32, co2: 450, temperature: 22.5, humidity: 45 },
    { time: '10:19', pm25: 35, co2: 445, temperature: 22.3, humidity: 46 },
    { time: '10:15', pm25: 33, co2: 448, temperature: 22.4, humidity: 45 },
    { time: '10:11', pm25: 38, co2: 452, temperature: 22.2, humidity: 47 },
    { time: '10:07', pm25: 31, co2: 440, temperature: 22.6, humidity: 44 },
  ]);

  const tabs = [
    { key: 'pm25', label: 'PM2.5' },
    { key: 'co2', label: 'CO₂' },
    { key: 'temperature', label: '温度' },
    { key: 'humidity', label: '湿度' },
  ];

  const clearHistory = () => {
    setHistoryData([]);
  };

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        {/* 标题栏 */}
        <View style={styles.modalHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.chartIcon}>📈</Text>
            <Text style={styles.modalTitle}>历史数据趋势</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* 指标筛选 */}
        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 曲线图区域 */}
        <View style={styles.chartArea}>
          <Text style={styles.chartTitle}>曲线图</Text>
          <View style={styles.chartPlaceholder}>
            <View style={styles.chartLines}>
              {/* 模拟折线 */}
              <View style={styles.line1} />
              <View style={styles.line2} />
              <View style={styles.line3} />
            </View>
            <Text style={styles.chartLabel}>时间 →</Text>
          </View>
        </View>

        {/* 最近记录 */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>最近记录</Text>
          <FlatList
            data={historyData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.recordItem}>
                {item.time}  PM2.5:{item.pm25}  CO₂:{item.co2}
              </Text>
            )}
          />
          {historyData.length === 0 && (
            <Text style={styles.emptyText}>暂无记录</Text>
          )}
        </View>

        {/* 清空按钮 */}
        <View style={styles.clearButtonContainer}>
          <Button title="清空历史记录" onPress={clearHistory} color="#f44336" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
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
  chartIcon: {
    fontSize: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    fontSize: 24,
    color: '#999',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  chartArea: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  chartPlaceholder: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartLines: {
    width: '100%',
    height: 80,
    position: 'relative',
  },
  line1: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: '30%',
    height: 2,
    backgroundColor: '#2196F3',
    borderRadius: 1,
  },
  line2: {
    position: 'absolute',
    top: 40,
    left: '20%',
    right: '15%',
    height: 2,
    backgroundColor: '#2196F3',
    borderRadius: 1,
  },
  line3: {
    position: 'absolute',
    top: 60,
    left: '40%',
    right: 0,
    height: 2,
    backgroundColor: '#2196F3',
    borderRadius: 1,
  },
  chartLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  historySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  recordItem: {
    fontSize: 14,
    color: '#666',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  clearButtonContainer: {
    marginTop: 10,
  },
});