import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import useAIReport from './src/hooks/useAIReport';

export default function TestAIReport() {
  const { isLoading, reportText, errorMsg, generateReport } = useAIReport();
  const [temp, setTemp] = useState('25.5');
  const [co2, setCo2] = useState('600');
  const [pm25, setPm25] = useState('35');
  const [hcho, setHcho] = useState('0.08');

  const handleGenerate = () => {
    generateReport({
      temp: parseFloat(temp) || 0,
      co2: parseFloat(co2) || 0,
      pm25: parseFloat(pm25) || 0,
      hcho: parseFloat(hcho) || 0,
    });
  };

  return (<ScrollView style={styles.container}>
    <View style={styles.card}>
      <Text style={styles.title}>useAIReport Hook 测试</Text>
      <Text style={styles.description}>输入传感器数据，测试 DeepSeek API 调用</Text>
    </View>

    <View style={styles.card}>
      <Text style={styles.sectionTitle}>传感器数据</Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>温度 (°C)</Text>
        <TextInput style={styles.input} value={temp} onChangeText={setTemp} keyboardType="numeric" placeholder="请输入温度"/>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>二氧化碳 (ppm)</Text>
        <TextInput style={styles.input} value={co2} onChangeText={setCo2} keyboardType="numeric" placeholder="请输入 CO2"/>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>PM2.5 (μg/m³)</Text>
        <TextInput style={styles.input} value={pm25} onChangeText={setPm25} keyboardType="numeric" placeholder="请输入 PM2.5"/>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>甲醛 (mg/m³)</Text>
        <TextInput style={styles.input} value={hcho} onChangeText={setHcho} keyboardType="numeric" placeholder="请输入甲醛"/>
      </View>
    </View>

    <TouchableOpacity onPress={handleGenerate} disabled={isLoading} style={[styles.button, isLoading ? styles.buttonDisabled : styles.buttonEnabled]}>
      <Text style={styles.buttonText}>{isLoading ? '请求中...' : '生成报告'}</Text>
    </TouchableOpacity>

    {isLoading && (<View style={styles.loadingContainer}>
      <ActivityIndicator animating={true} size="large"/>
      <Text style={styles.loadingText}>正在调用 DeepSeek API...</Text>
    </View>)}

    {errorMsg && (<View style={[styles.card, styles.errorCard]}>
      <Text style={styles.errorTitle}>错误信息</Text>
      <Text style={styles.errorText}>{errorMsg}</Text>
    </View>)}

    {reportText && (<View style={styles.card}>
      <Text style={styles.resultTitle}>分析报告</Text>
      <Text style={styles.resultText}>{reportText}</Text>
    </View>)}
  </ScrollView>);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F7', padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 16, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1D1D1F', marginBottom: 8 },
  description: { fontSize: 14, color: '#86868B' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1D1D1F', marginBottom: 16 },
  inputWrapper: { marginBottom: 16 },
  label: { fontSize: 14, color: '#86868B', marginBottom: 8 },
  input: { height: 48, borderColor: '#E5E5EA', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, fontSize: 16, backgroundColor: '#FFFFFF' },
  button: { borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24, marginVertical: 8, alignItems: 'center' },
  buttonEnabled: { backgroundColor: '#007AFF' },
  buttonDisabled: { backgroundColor: '#A0A0A0' },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  loadingContainer: { alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, color: '#86868B', fontSize: 14 },
  errorCard: { backgroundColor: '#FFF5F5', borderColor: '#FF3B30', borderWidth: 1 },
  errorTitle: { fontSize: 16, fontWeight: 'bold', color: '#FF3B30', marginBottom: 8 },
  errorText: { fontSize: 14, color: '#FF3B30' },
  resultTitle: { fontSize: 16, fontWeight: 'bold', color: '#007AFF', marginBottom: 8 },
  resultText: { fontSize: 14, lineHeight: 24, color: '#1D1D1F' },
});