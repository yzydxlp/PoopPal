import COLORS from './colors';
// 定义心情类型
export enum MoodType {
    HAPPY = 'happy',
    NORMAL = 'normal',
    SAD = 'sad'
}

// 定义单次记录的接口
interface RecordItem {
    timestamp: string; // ISO 格式的时间字符串
    mood: MoodType;
}

// 定义日期标记的接口
interface DayRecord {
    records: RecordItem[];
    dots: {
        key: string;
        color: string;
    }[];
    marked: boolean;
}

// 心情对应的颜色和图标
export const moodConfig = {
    [MoodType.HAPPY]: {
        color: '#4CAF50',
        icon: '😊'
    },
    [MoodType.NORMAL]: {
        color: '#FFC107',
        icon: '😐'
    },
    [MoodType.SAD]: {
        color: '#F44336',
        icon: '😢'
    }
};
// 日历相关数据
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
export const calendarData = {
    markedDates: {
        '2025-03-15': {
            records: [
                {
                    timestamp: '2025-03-15T08:30:45Z',
                    mood: MoodType.HAPPY
                },
                {
                    timestamp: '2025-03-15T16:20:10Z',
                    mood: MoodType.NORMAL
                }
            ],
            dots: [
                { key: 'happy', color: moodConfig[MoodType.HAPPY].color },
                { key: 'normal', color: moodConfig[MoodType.NORMAL].color }
            ],
            marked: true
        },
        '2025-03-16': {
            records: [
                {
                    timestamp: '2025-03-16T07:15:22Z',
                    mood: MoodType.SAD
                }
            ],
            dots: [
                { key: 'sad', color: moodConfig[MoodType.SAD].color }
            ],
            marked: true
        },
        '2025-03-17': {
            records: [
                {
                    timestamp: '2025-03-17T07:15:22Z',
                    mood: MoodType.SAD
                }
            ],
            dots: [
                { key: 'sad', color: moodConfig[MoodType.SAD].color }
            ],
            marked: true
        }
    },
    theme: {
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
    }
};
// 欢迎横幅数据
export const welcomeBannerData = {
    title: '👏欢迎回来🎉',
    subtitle: '你今天过得怎么样呀？😯',
    iconName: 'paw-sharp',
    iconSize: 80,
};

// 信息面板数据
export const infoPanelData = {
    text: "You haven't recorded anything today yet.",
    iconName: "information-circle",
    iconSize: 24,
};

// 连续打卡数据
export const streakData = {
    days: 5,
    title: '5 Day Streak! 🎉',
    subtitle: "You're doing great! Keep it up!",
    iconName: 'local-fire-department',
    iconSize: 24,
    backgroundColor: COLORS.accentYellow,
};
// 历史记录数据
export const historyData = [
    {
        date: 'Yesterday',
        time: '8:15 AM',
        iconName: 'check-circle',
    },
    {
        date: 'March 11, 2025',
        time: '7:45 AM',
        iconName: 'check-circle',
    },
    {
        date: 'March 10, 2025',
        time: '9:30 AM',
        iconName: 'check-circle',
    },
];

// 每日提示数据
export const tipData = {
    title: 'Tip of the Day',
    content: 'Stay hydrated! Drinking enough water helps maintain regular bowel movements.',
    iconName: 'bulb-outline',
    iconSize: 24,
    backgroundColor: COLORS.accentGreen,
};

// 模态框数据
export const modalData = {
    addRecord: {
        title: 'Hello World',
    },
};