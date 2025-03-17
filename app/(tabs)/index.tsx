import React,{useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  Animated,
  Easing
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../../constants/colors';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight;
export default function Index({  })  {
    const [visibleWelcomeBanner, setVisibleWelcomeBanner] = useState(true);
    const [animation] = useState(new Animated.Value(1)); // 初始值用于缩放动画
    const [selectedDate, setSelectedDate] = useState('');
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const markedDates = {
        '2025-03-01': { marked: true, dotColor: COLORS.primary },
        '2025-03-02': { marked: true, dotColor: COLORS.primary },
        '2025-03-03': { marked: true, dotColor: COLORS.primary },
        '2025-03-05': { marked: true, dotColor: COLORS.primary },
        '2025-03-06': { marked: true, dotColor: COLORS.primary },
        '2025-03-08': { marked: true, dotColor: COLORS.primary },
        '2025-03-09': { marked: true, dotColor: COLORS.primary },
        '2025-03-10': { marked: true, dotColor: COLORS.primary },
        '2025-03-11': { marked: true, dotColor: COLORS.primary },
        '2025-03-12': { marked: true, dotColor: COLORS.primary },
        [today]: { selected: true, selectedColor: COLORS.primary, marked: false }
      };

    const handleWelcomeBannerClose = () => {
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start(() => setVisibleWelcomeBanner(false)); // 动画结束后将卡片隐藏
      };

      return (
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.content}>
          {visibleWelcomeBanner&& <Animated.View
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
                 <Text style={styles.welcomeSubtitle}>你今天过得怎么样呀？😯</Text>
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
           markedDates={markedDates}
           theme={{
             calendarBackground: COLORS.bgCard,
             textSectionTitleColor: COLORS.textTertiary,
             selectedDayBackgroundColor: COLORS.primary,
             selectedDayTextColor: COLORS.textLight,
             todayTextColor: COLORS.primary,
             dayTextColor: COLORS.textSecondary,
             textDisabledColor: COLORS.textTertiary,
             dotColor: COLORS.primary,
             selectedDotColor: COLORS.textLight,
             arrowColor: COLORS.primary,
             monthTextColor: COLORS.textPrimary,
             indicatorColor: COLORS.primary,
             textDayFontWeight: '600',
             textMonthFontWeight: '700',
             textDayHeaderFontWeight: '600',
           }}
           onDayPress={(day:any) => setSelectedDate(day.dateString)}
         />
       </View>
            <View style={styles.infoPanel}>
              <Ionicons name="information-circle" size={24} color="white" style={styles.infoIcon} />
              <Text style={styles.infoPanelText}>You haven't recorded anything today yet.</Text>
            </View>

            <View style={styles.streakCard}>
              <View style={[styles.streakIcon, { backgroundColor: COLORS.accentYellow }]}>
                <MaterialIcons name="local-fire-department" size={24} color="white" />
              </View>
              <View style={styles.streakDetails}>
                <Text style={styles.streakTitle}>5 Day Streak! 🎉</Text>
                <Text style={styles.streakSubtitle}>You're doing great! Keep it up!</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <MaterialIcons name="event-note" size={24} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Recent Activity</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.historyRecord}>
                <View style={styles.historyIcon}>
                  <MaterialIcons name="check-circle" size={20} color={COLORS.primaryDark} />
                </View>
                <View style={styles.historyDetails}>
                  <Text style={styles.historyDate}>Yesterday</Text>
                  <Text style={styles.historyTime}>8:15 AM</Text>
                </View>
              </View>

              <View style={styles.historyRecord}>
                <View style={styles.historyIcon}>
                  <MaterialIcons name="check-circle" size={20} color={COLORS.primaryDark} />
                </View>
                <View style={styles.historyDetails}>
                  <Text style={styles.historyDate}>March 11, 2025</Text>
                  <Text style={styles.historyTime}>7:45 AM</Text>
                </View>
              </View>

              <View style={[styles.historyRecord, {borderBottomWidth: 0}]}>
                <View style={styles.historyIcon}>
                  <MaterialIcons name="check-circle" size={20} color={COLORS.primaryDark} />
                </View>
                <View style={styles.historyDetails}>
                  <Text style={styles.historyDate}>March 10, 2025</Text>
                  <Text style={styles.historyTime}>9:30 AM</Text>
                </View>
              </View>
            </View>

            <View style={[styles.tipOfDay, { backgroundColor: COLORS.accentGreen }]}>
              <View style={styles.tipTitle}>
                <Ionicons name="bulb-outline" size={24} color="white" style={styles.tipTitleIcon} />
                <Text style={styles.tipTitleText}>Tip of the Day</Text>
              </View>
              <Text style={styles.tipText}>Stay hydrated! Drinking enough water helps maintain regular bowel movements.</Text>
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
  welcomeCloseIcon:{
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
  },
});

