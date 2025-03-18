import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import COLORS from '../constants/colors';
import { MoodType, moodConfig } from '../constants/appData';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { haptics } from '../utils/haptics';

interface AddRecordModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: string;
  onSubmit: (mood: MoodType, time: string) => void;
}

const AddRecordModal = ({ visible, onClose, selectedDate, onSubmit }: AddRecordModalProps) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);

  const handleTimeSlotSelect = (slot: number) => {
    haptics.selection(); // 使用选择反馈
    setSelectedTimeSlot(slot);
  };

  // 在点击心情按钮时
  const handleSubmit = (mood: MoodType) => {
    if (selectedTimeSlot === null) {
      haptics.warning(); // 如果未选择时间，使用警告反馈
      return;
    }
    haptics.success(); // 提交成功时使用确认反馈
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(selectedTimeSlot * 4);
    selectedDateTime.setMinutes(0);
    onSubmit(mood, selectedDateTime.toISOString());
  };

  const getTimeSlotLabel = (slot: number) => {
    const start = slot * 4;
    const end = (slot + 1) * 4;
    return `${start.toString().padStart(2, '0')}:00-${end.toString().padStart(2, '0')}:00`;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <LinearGradient
          colors={[COLORS.primaryLight, COLORS.bgMain]}
          style={styles.modalContent}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.iconContainer}>
              <Ionicons name="thumbs-up" size={50} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>今天拉的怎么样？</Text>
            <Text style={styles.date}>{new Date(selectedDate).toLocaleDateString()}</Text>

            <View style={styles.timePickerContainer}>
              <Text style={styles.timePickerTitle}>选择时间段</Text>
              <View style={styles.timeSlotGrid}>
                {Array.from({ length: 6 }, (_, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.timeSlotButton,
                      selectedTimeSlot === i && styles.timeSlotButtonSelected
                    ]}
                    onPress={() => handleTimeSlotSelect(i)}  // 使用新的处理函数
                  >
                    <Text style={[
                      styles.timeSlotText,
                      selectedTimeSlot === i && styles.timeSlotTextSelected
                    ]}>
                      {getTimeSlotLabel(i)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.moodContainer}>
              {Object.entries(moodConfig).map(([mood, config]) => (
                <TouchableOpacity
                  key={mood}
                  style={styles.moodButton}
                  onPress={() => handleSubmit(mood as MoodType)}
                >
                  <Text style={styles.moodIcon}>{config.icon}</Text>
                  <Text style={styles.moodText}>
                    {mood === MoodType.HAPPY ? '开心' : mood === MoodType.NORMAL ? '一般' : '不好'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </LinearGradient>

      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  moodButton: {
    alignItems: 'center',
    padding: 16,
  },
  moodIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  moodText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  timePickerContainer: {
    width: '100%',
    marginBottom: 24,
  },
  timePickerTitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  timeSlotButton: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
    alignItems: 'center',
  },
  timeSlotButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  timeSlotText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  timeSlotTextSelected: {
    color: COLORS.bgCard, // 将 white 改为 bgCard
    fontWeight: '600',
  },
});

export default AddRecordModal;