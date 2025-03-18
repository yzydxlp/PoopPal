import React,{useState} from 'react';
import { Text, View, StyleSheet, ScrollView,TouchableOpacity } from 'react-native';
import { useRecordStore } from '../../store/recordStore';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { MoodType } from '../../constants/appData';
import { haptics } from '../../utils/haptics';

export default function CalendarScreen() {
  const { records } = useRecordStore();
  const [showWeekly, setShowWeekly] = useState(false);

  const calculateStats = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // 根据选择过滤记录
    const filteredRecords = Object.values(records)
      .flat()
      .filter(record => !showWeekly || new Date(record.timestamp) >= startOfWeek);

    const totalRecords = filteredRecords.length;
    const weeklyRecords = Object.values(records)
      .flat()
      .filter(record => new Date(record.timestamp) >= startOfWeek).length;

    const moodCounts = filteredRecords.reduce((acc, record) => {
      acc[record.mood] = (acc[record.mood] || 0) + 1;
      return acc;
    }, {} as Record<MoodType, number>);

    const timeDistribution = filteredRecords.reduce((acc, record) => {
      const hour = new Date(record.timestamp).getHours();
      const timeSlot = Math.floor(hour / 4);
      acc[timeSlot] = (acc[timeSlot] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // 找出最常见的时间段
    let maxSlot = 0;
    let maxCount = 0;
    Object.entries(timeDistribution).forEach(([slot, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxSlot = Number(slot);
      }
    });

    return {
      totalRecords,
      weeklyRecords,
      moodCounts,
      timeDistribution,
      preferredTimeSlot: maxSlot,
    };
  };

  const stats = calculateStats();
  
  const getTimeSlotLabel = (slot: number) => {
    const start = slot * 4;
    const end = (slot + 1) * 4;
    return `${start.toString().padStart(2, '0')}:00-${end.toString().padStart(2, '0')}:00`;
  };

  const getPreferredTimeAnalysis = () => {
    const slot = stats.preferredTimeSlot;
    const timeRange = getTimeSlotLabel(slot);
    return `根据您的记录，您最常在 ${timeRange} 期间排便。这是一个${slot === 1 || slot === 2 ? '很好的' : '正常的'}习惯。`;
  };

  const handleToggleWeekly = (isWeekly: boolean) => {
    haptics.selection(); // 使用选择反馈
    setShowWeekly(isWeekly);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <TouchableOpacity 
            style={[styles.statItem, !showWeekly && styles.statItemActive]} 
            onPress={() => handleToggleWeekly(false)}
          >
            <Ionicons name="calendar" size={24} color={!showWeekly ? COLORS.primary : COLORS.textSecondary} />
            <Text style={[styles.statNumber, !showWeekly ? {color: COLORS.primary} : {color: COLORS.textSecondary}]}>
              {stats.totalRecords}
            </Text>
            <Text style={styles.statLabel}>总记录次数</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statItem, showWeekly && styles.statItemActive]} 
            onPress={() => handleToggleWeekly(true)}
          >
            <Ionicons name="today" size={24} color={showWeekly ? COLORS.accentGreen : COLORS.textSecondary} />
            <Text style={[styles.statNumber, showWeekly ? {color: COLORS.accentGreen} : {color: COLORS.textSecondary}]}>
              {stats.weeklyRecords}
            </Text>
            <Text style={styles.statLabel}>本周记录</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.moodStats}>
          <Text style={styles.moodStatsTitle}>💩情况分布</Text>
          {Object.entries(stats.moodCounts).map(([mood, count]) => (
            <View key={mood} style={styles.moodStatItem}>
              <Text style={styles.moodIcon}>
                {mood === MoodType.HAPPY ? '😊' : mood === MoodType.NORMAL ? '😐' : '😢'}
              </Text>
              <View style={styles.moodStatBar}>
                <View 
                  style={[
                    styles.moodStatFill, 
                    { 
                      width: `${(count / stats.totalRecords) * 100}%`,
                      backgroundColor: mood === MoodType.HAPPY ? COLORS.accentGreen : 
                                     mood === MoodType.NORMAL ? COLORS.primary :
                                     COLORS.accentPink  // 改用 accentPink 替代 accentRed
                    }
                  ]} 
                />
              </View>
              <Text style={styles.moodStatCount}>{count}次</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.statsCard, styles.timeStatsCard]}>
        <Text style={styles.timeStatsTitle}>⏰ 时间分布</Text>
        {Object.entries(stats.timeDistribution).map(([slot, count]) => (
          <View key={slot} style={styles.timeStatItem}>
            <Text style={styles.timeLabel}>{`${Number(slot) * 4}:00 - ${Number(slot) * 4 + 4}:00`}</Text>
            <View style={styles.moodStatBar}>
              <View 
                style={[
                  styles.moodStatFill, 
                  { 
                    width: `${(count / stats.totalRecords) * 100}%`,
                    backgroundColor: COLORS.primary
                  }
                ]} 
              />
            </View>
            <Text style={styles.moodStatCount}>{count}次</Text>
          </View>
        ))}
      </View>

      <View style={styles.analysisCard}>
        <Text style={styles.analysisTitle}>📊 个性化分析</Text>
        <Text style={styles.analysisText}>{getPreferredTimeAnalysis()}</Text>
        <Text style={styles.analysisTip}>
          建议：保持规律的排便习惯有助于肠道健康。如果可能的话，建议在早餐后15-30分钟尝试排便，这是最理想的时间。
        </Text>
      </View>

      {/* 添加底部安全区域 */}
      <View style={styles.bottomSafeArea} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgMain,
  },
  statsCard: {
    margin: 16,
    padding: 20,
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  timeStatsCard: {
    marginTop: 0,  // 覆盖原有的 marginTop
    paddingTop: 20,  // 调整内边距
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  
  statItem: {
    alignItems: 'center',
    flex: 1,
    opacity: 0.7,
    paddingVertical: 8,
  },

  statItemActive: {
    opacity: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },

  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  moodStats: {
    marginTop: 16,
  },
  moodStatsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  moodStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodIcon: {
    fontSize: 20,
    width: 30,
  },
  moodStatBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.borderLight,
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  moodStatFill: {
    height: '100%',
    borderRadius: 4,
  },
  moodStatCount: {
    width: 50,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  timeStats: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  timeStatsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  timeStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeLabel: {
    width: 100,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 8,  // 添加右边距
  },
  analysisCard: {
    margin: 16,
    padding: 20,
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  analysisText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 24,
    marginBottom: 12,
  },
  analysisTip: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    backgroundColor: COLORS.primaryLight,
    padding: 12,
    borderRadius: 8,
  },
  bottomSafeArea: {
    height: 80, // 导航栏高度 + 额外安全距离
  },
});
