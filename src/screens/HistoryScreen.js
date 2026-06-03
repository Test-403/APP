import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { COLORS } from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

const generateMockData = () => {
  const now = new Date();
  const data = [];
  
  for (let i = 11; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000);
    data.push({
      time: time,
      timeStr: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`,
      pm25: parseFloat((Math.random() * 50 + 10).toFixed(1)),
      co2: Math.floor(Math.random() * 500 + 400),
      temperature: parseFloat((Math.random() * 8 + 18).toFixed(1)),
      humidity: Math.floor(Math.random() * 30 + 35),
    });
  }
  
  return data;
};

const initialMockData = generateMockData();

const SimpleLineChart = ({ data, maxValue, labels }) => {
  if (!data || data.length === 0) return null;
  
  const chartHeight = 160;
  const chartWidth = screenWidth - 96;
  const padding = 20;
  
  const points = useMemo(() => {
    return data.map((item, index) => {
      const x = padding + (index * (chartWidth - padding * 2)) / (data.length - 1);
      const y = chartHeight - padding - (item.value / maxValue) * (chartHeight - padding * 2);
      return { x, y, value: item.value };
    });
  }, [data, maxValue]);

  const lineSegments = useMemo(() => {
    if (points.length < 2) return [];
    
    const segments = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      segments.push({
        x: p1.x,
        y: p1.y,
        width: length,
        rotation: (Math.atan2(dy, dx) * 180) / Math.PI,
      });
    }
    return segments;
  }, [points]);

  return (
    <View style={{ width: chartWidth + 60, height: chartHeight + 40 }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: 36, height: chartHeight, justifyContent: 'space-between', paddingVertical: padding }}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <Text key={index} style={{ fontSize: 10, color: '#6B7280', textAlign: 'right' }}>
              {Math.round(maxValue * (1 - ratio))}
            </Text>
          ))}
        </View>
        
        <View style={{ position: 'relative', width: chartWidth, height: chartHeight }}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <View 
              key={index} 
              style={{ 
                position: 'absolute', 
                left: 0, 
                right: 0, 
                top: padding + ratio * (chartHeight - padding * 2), 
                height: 1, 
                backgroundColor: '#E5E7EB' 
              }} 
            />
          ))}
          
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: '#E5E7EB' }} />
          
          {lineSegments.map((segment, index) => (
            <View
              key={index}
              style={{
                position: 'absolute',
                left: segment.x,
                top: segment.y,
                width: segment.width,
                height: 2,
                backgroundColor: '#3B82F6',
                transform: [{ rotate: `${segment.rotation}deg` }],
                transformOrigin: 'left center',
              }}
            />
          ))}
          
          {points.map((point, index) => (
            <View
              key={index}
              style={{
                position: 'absolute',
                left: point.x - 4,
                top: point.y - 4,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#3B82F6',
              }}
            />
          ))}
        </View>
      </View>
      
      <View style={{ marginLeft: 36, marginTop: 8, height: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: padding }}>
          {labels.map((label, index) => (
            <Text key={index} style={{ fontSize: 10, color: '#6B7280' }}>
              {label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

export default function HistoryScreen({ onBack }) {
  const [activeTab, setActiveTab] = useState('pm25');
  const [historyData, setHistoryData] = useState(initialMockData);

  const tabs = [
    { key: 'pm25', label: 'PM2.5' },
    { key: 'co2', label: 'CO\u2082' },
    { key: 'temperature', label: '温度' },
    { key: 'humidity', label: '湿度' },
  ];

  const getMaxValue = () => {
    switch (activeTab) {
      case 'pm25': return 100;
      case 'co2': return 1000;
      case 'temperature': return 40;
      case 'humidity': return 100;
      default: return 100;
    }
  };

  const getUnit = () => {
    switch (activeTab) {
      case 'pm25': return '\u03BCg/m\u00B3';
      case 'co2': return 'ppm';
      case 'temperature': return '\u2103';
      case 'humidity': return '%';
      default: return '';
    }
  };

  const chartData = useMemo(() => {
    if (historyData.length === 0) return [];
    return historyData.map(item => ({ value: item[activeTab] }));
  }, [historyData, activeTab]);

  const chartLabels = useMemo(() => {
    if (historyData.length === 0) return [];
    return historyData.filter((_, index) => index % 2 === 0).map(item => item.timeStr);
  }, [historyData]);

  const handleClearHistory = () => {
    setHistoryData([]);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>历史数据趋势</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabButtonText, activeTab === tab.key && styles.tabButtonTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.chartContainer}>
        {historyData.length > 0 ? (
          <>
            <Text style={styles.chartTitle}>
              {tabs.find(t => t.key === activeTab)?.label}
            </Text>
            <View style={styles.chartWrapper}>
              <SimpleLineChart 
                data={chartData} 
                maxValue={getMaxValue()} 
                labels={chartLabels} 
              />
            </View>
            <Text style={styles.chartUnit}>单位: {getUnit()}</Text>
          </>
        ) : (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyChartText}>暂无数据</Text>
          </View>
        )}
      </View>

      <View style={styles.recordSection}>
        <Text style={styles.recordTitle}>最近记录</Text>
        <ScrollView style={styles.recordList}>
          {historyData.length > 0 ? (
            historyData.slice().reverse().slice(0, 10).map((item, index) => {
              const getRecordText = () => {
                const label = tabs.find(t => t.key === activeTab)?.label;
                const value = item[activeTab];
                const unit = getUnit();
                return `${item.timeStr} ${label}:${value}${unit}`;
              };
              
              return (
                <View key={index} style={styles.recordItem}>
                  <Text style={styles.recordText}>
                    {getRecordText()}
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyRecord}>
              <Text style={styles.emptyRecordText}>暂无记录</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleClearHistory}
          style={styles.clearButton}
          activeOpacity={0.7}
        >
          <Text style={styles.clearButtonText}>清空历史记录</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  headerPlaceholder: {
    width: 32,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: COLORS.background,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  tabButtonTextActive: {
    color: 'white',
  },
  chartContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  chartWrapper: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  chartUnit: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'right',
  },
  emptyChart: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyChartText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  recordSection: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 80,
  },
  recordTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  recordList: {
    flex: 1,
  },
  recordItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  recordText: {
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  emptyRecord: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyRecordText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
  },
  clearButton: {
    backgroundColor: COLORS.error,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
