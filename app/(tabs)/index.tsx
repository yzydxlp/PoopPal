import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../../constants/colors';
import { useRecordStore } from '../../store/recordStore';
import {
  calendarData,
  moodConfig,
  tips
} from '../../constants/appData';
import { haptics } from '../../utils/haptics';

interface MarkedDates {
  [date: string]: {
    marked?: boolean;
    selected?: boolean;
    selectedColor?: string;
    dots?: Array<{
      key: string;
      color: string;
    }>;
  };
}

export default function Index({ }) {
  const { records, selectedDate, setSelectedDate, deleteRecord } = useRecordStore();
  const getSelectedDateRecords = () => {
    return records[selectedDate] || [];
  };
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [visibleWelcomeBanner, setVisibleWelcomeBanner] = useState(true);
  const [animation] = useState(new Animated.Value(1)); // 初始值用于缩放动画
  const handleWelcomeBannerClose = () => {
    haptics.light(); // 添加轻触反馈
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setVisibleWelcomeBanner(false));
  };
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 5000); // 每5秒切换一次

    return () => clearInterval(timer);
  }, []);
  const today = new Date().toISOString().split('T')[0];
  const hasRecordToday = records[today]?.length > 0;
  const getMarkedDates = () => {
    const today = new Date().toISOString().split('T')[0];
    const markedDates: MarkedDates = {};

    Object.keys(records).forEach(date => {
      if (records[date] && records[date].length > 0) {
        markedDates[date] = {
          marked: true,
          dots: records[date].map(record => ({
            key: record.mood,
            color: moodConfig[record.mood].color
          }))
        };
      }
    });

    if (selectedDate !== today && records[today]?.length > 0) {
      markedDates[today] = {
        ...markedDates[today],
        marked: true
      };
    }

    return {
      ...markedDates,
      [selectedDate]: {
        ...markedDates[selectedDate],
        selected: true,
        selectedColor: COLORS.primary
      }
    };
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
      <Image
          source={require('../../assets/images/girl-shit.jpg')}
          style={styles.headerImage}
          resizeMode="cover"
        />
        {visibleWelcomeBanner && <Animated.View
          style={[
            styles.welcomeBanner,
            {
              opacity: animation,
              transform: [{
                scale: animation, // 通过状态值实现缩放
              }]
            }
          ]}
        >
          <LinearGradient
            colors={[COLORS.primaryLight, COLORS.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.innerBanner}
          >
            <Text style={styles.welcomeTitle}>👏欢迎回来🎉</Text>
            <Text style={styles.welcomeSubtitle}>你是来拉屎的吧？😯</Text>
            <Ionicons
              name="paw-sharp"
              size={80}
              style={styles.welcomeDecoration}
            />
            <TouchableOpacity onPress={handleWelcomeBannerClose} style={styles.welcomeCloseIcon}>
              <Ionicons
                name="close-sharp"
                color="white"
                size={20}
              />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
        }
        <View style={styles.calendarContainer}>
        <Calendar
            markedDates={getMarkedDates()}
            theme={calendarData.theme}
            onDayPress={(day: { dateString: string }) => {
              if (day.dateString <= today) {
                haptics.selection(); // 添加选择反馈
                setSelectedDate(day.dateString);
              } else {
                haptics.warning(); // 添加警告反馈
                alert('不可以预定拉屎哦💩');
              }
            }}
            maxDate={today}
          />
        </View>

        {!hasRecordToday && <View style={styles.infoPanel}>
          <Ionicons name="information-circle" size={24} color="white" style={styles.infoIcon} />
          <Text style={styles.infoPanelText}>You haven't recorded anything today yet.</Text>
        </View>}


        <View style={styles.sectionHeader}>
          <MaterialIcons name="event-note" size={24} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        <View style={styles.card}>
          {getSelectedDateRecords().length > 0 ? (
            getSelectedDateRecords().map((record, index) => (
              <View
                key={record.id}  // 使用唯一id作为key
                style={[
                  styles.historyRecord,
                  index === getSelectedDateRecords().length - 1 && styles.historyRecordLast
                ]}
              >
                <View style={styles.historyIcon}>
                  <Text style={styles.moodIcon}>
                    {moodConfig[record.mood as keyof typeof moodConfig].icon}
                  </Text>
                </View>
                <View style={styles.historyDetails}>
                  <Text style={styles.historyDate}>
                    {new Date(record.timestamp).toLocaleDateString()}
                  </Text>
                  <Text style={styles.historyTime}>
                    {getTimeSlotLabel(record.timestamp)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteRecord(selectedDate, record.id)}
                >
                  <Ionicons name="trash-outline" size={20} color={COLORS.textTertiary} />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noRecordText}>当天暂无记录</Text>
          )}
        </View>

        <View style={[styles.tipOfDay, { backgroundColor: COLORS.accentGreen }]}>
          <View style={styles.tipTitle}>
            <Ionicons name="bulb-outline" size={24} color="white" style={styles.tipTitleIcon} />
            <Text style={styles.tipTitleText}>每日小贴士</Text>
          </View>
          <Animated.Text style={styles.tipText}>
            {tips[currentTipIndex]}
          </Animated.Text>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 80 }}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgMain,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerImage: {
    width: Dimensions.get('window').width - 32,
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  welcomeBanner: {
    borderRadius: 16,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  innerBanner: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  welcomeDecoration: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    opacity: 0.2,
  },
  welcomeCloseIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    opacity: 0.8,
  },
  calendarContainer: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  infoPanel: {
    backgroundColor: COLORS.accentBlue,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 16,
  },
  infoPanelText: {
    color: 'white',
    flex: 1,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  streakIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  streakDetails: {
    flex: 1,
  },
  streakTitle: {
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  streakSubtitle: {
    color: COLORS.textTertiary,
    fontSize: 14,
  },
  moodIcon: {
    fontSize: 20,
  },
  noRecordText: {
    color: COLORS.textTertiary,
    textAlign: 'center',
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginLeft: 8,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  historyRecord: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  historyRecordLast: {  // 新增最后一个元素的样式
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  historyDetails: {
    flex: 1,
  },
  historyDate: {
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  historyTime: {
    color: COLORS.textTertiary,
    fontSize: 14,
  },
  tipOfDay: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  tipTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    fontWeight: '700',
    marginBottom: 8,
  },
  tipTitleIcon: {
    marginRight: 8,
  },
  tipTitleText: {
    fontWeight: '700',
    color: 'white',
  },
  tipText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});


const getTimeSlotLabel = (timestamp: string) => {
  const hour = new Date(timestamp).getHours();
  const timeSlot = Math.floor(hour / 4);
  const start = timeSlot * 4;
  const end = (timeSlot + 1) * 4;
  return `${start.toString().padStart(2, '0')}:00-${end.toString().padStart(2, '0')}:00`;
};

