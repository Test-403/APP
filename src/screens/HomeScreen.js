import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { COLORS } from '../constants/colors';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text variant="headlineLarge">蓝牙数据采集</Text>
      <Text variant="bodyMedium" style={styles.description}>
        连接蓝牙设备，读取传感器数据，上传到云端
      </Text>
      <Button mode="contained" onPress={() => navigation?.navigate('Device')}>
        开始连接设备
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: COLORS.background,
  },
  description: {
    marginVertical: 16,
    textAlign: 'center',
    color: COLORS.textSecondary,
  },
});
