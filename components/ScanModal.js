import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

export default function ScanModal({ visible, onClose, onConnect }) {
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState([]);

  const startScan = () => {
    if (scanning) {
      setScanning(false);
      setDevices([]);
      return;
    }

    setScanning(true);
    setDevices([]);

    // 模拟扫描到设备
    setTimeout(() => {
      setDevices([
        { id: 'AA:BB:CC:DD:EE:01', name: 'AirSensor-001', rssi: -55 },
        { id: 'AA:BB:CC:DD:EE:02', name: 'AirMonitor-Pro', rssi: -62 },
      ]);
    }, 2000);
  };

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        {/* 标题栏 */}
        <View style={styles.modalHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.modalTitle}>蓝牙设备扫描</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* 状态提示 */}
        <Text style={styles.scanStatus}>
          {scanning ? '正在扫描...' : '点击下方按钮开始扫描'}
        </Text>

        {/* 扫描按钮 */}
        <View style={styles.buttonContainer}>
          <Button
            title={scanning ? '停止扫描' : '开始扫描'}
            onPress={startScan}
            color={scanning ? '#f44336' : '#2196F3'}
          />
        </View>

        {/* 设备列表 */}
        <View style={styles.deviceList}>
          <Text style={styles.listTitle}>设备列表</Text>
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.deviceItem}>
                <View>
                  <Text style={styles.deviceName}>{item.name}</Text>
                  <Text style={styles.deviceInfo}>
                    {item.id}  {item.rssi}dBm
                  </Text>
                </View>
                <Button
                  title="连接"
                  onPress={() => {
                    onConnect(item);
                    onClose();
                  }}
                  color="#2196F3"
                />
              </View>
            )}
          />
          {devices.length === 0 && (
            <Text style={styles.emptyText}>暂无设备</Text>
          )}
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
    maxHeight: '70%',
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
  searchIcon: {
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
  scanStatus: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  deviceList: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  deviceInfo: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
});