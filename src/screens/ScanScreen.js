import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { COLORS } from '../constants/colors';

export default function ScanScreen({ onBack }) {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setDevices([]);
    setTimeout(() => {
      setDevices([
        { id: 'AA:BB:CC:DD:EE:01', name: 'AirSensor-001', rssi: -55 },
        { id: 'AA:BB:CC:DD:EE:02', name: 'AirMonitor-Pro', rssi: -62 },
      ]);
      setIsScanning(false);
    }, 2000);
  };

  const handleConnect = () => {
    onBack();
  };

  const renderDeviceItem = ({ item }) => (
    <View style={styles.deviceItem}>
      <View>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.deviceAddr}>{item.id} · {item.rssi}dBm</Text>
      </View>
      <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
        <Text style={styles.connectButtonText}>连接</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>蓝牙设备扫描</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onBack}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusBar}>
        <Text style={styles.statusText}>状态: {isScanning ? '扫描中...' : '点击下方按钮开始扫描'}</Text>
      </View>

      <TouchableOpacity 
        style={styles.scanButton}
        onPress={handleScan}
        disabled={isScanning}
      >
        {isScanning ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.scanButtonText}>{isScanning ? '扫描中' : '开始扫描'}</Text>
        )}
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>设备列表</Text>
        
        {isScanning ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>正在搜索设备...</Text>
          </View>
        ) : devices.length > 0 ? (
          <FlatList
            data={devices}
            renderItem={renderDeviceItem}
            keyExtractor={item => item.id}
          />
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>未发现蓝牙设备</Text>
          </View>
        )}
      </View>
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
  statusBar: { padding: 16, backgroundColor: COLORS.background },
  statusText: { color: COLORS.textSecondary },
  scanButton: {
    margin: 16,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 12 },
  loading: { alignItems: 'center', padding: 40 },
  loadingText: { marginTop: 12, color: COLORS.textSecondary },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deviceName: { fontWeight: '600', color: COLORS.textPrimary },
  deviceAddr: { color: COLORS.textSecondary, fontSize: 12 },
  connectButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 8,
    borderRadius: 6,
  },
  connectButtonText: { color: COLORS.primary, fontSize: 14 },
  empty: { alignItems: 'center', padding: 40 },
  emptyText: { color: COLORS.textSecondary },
});
