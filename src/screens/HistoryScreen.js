import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { COLORS } from '../constants/colors';
import { useSensor } from '../context/SensorContext';

export default function HistoryScreen({ onBack }) {
  const { history, clearHistory } = useSensor();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyTime}>{formatTime(item.timestamp)}</Text>
      <Text style={styles.historyData}>
        PM2.5:{item.data.pm25?.toFixed(1)} CO₂:{item.data.co2?.toFixed(0)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>历史数据趋势</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onBack}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>最近记录</Text>
        {history.length > 0 ? (
          <FlatList
            data={[...history].reverse()}
            renderItem={renderHistoryItem}
            keyExtractor={item => item.timestamp.toString()}
            style={styles.list}
          />
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>暂无历史记录</Text>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={styles.clearButton}
        onPress={clearHistory}
      >
        <Text style={styles.clearButtonText}>清空历史记录</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </View>
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
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontSize: 20, color: COLORS.textSecondary },
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
  list: { maxHeight: 400 },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  historyItemLast: { borderBottomWidth: 0 },
  historyTime: { color: COLORS.textSecondary },
  historyData: { color: COLORS.textPrimary },
  empty: { alignItems: 'center', padding: 40 },
  emptyText: { color: COLORS.textSecondary },
  clearButton: {
    margin: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '500' },
  bottomSpacer: { height: 100 },
});
