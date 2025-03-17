import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import COLORS from '../constants/colors';
import { MoodType, moodConfig } from '../constants/appData';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddRecordModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: string;
  onSubmit: (mood: MoodType, time: string) => void;
}

const AddRecordModal = ({ visible, onClose, selectedDate, onSubmit }: AddRecordModalProps) => {
  const [time, setTime] = useState(new Date());

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleSubmit = (mood: MoodType) => {
    // 合并选中的日期和时间
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(time.getHours());
    selectedDateTime.setMinutes(time.getMinutes());
    onSubmit(mood, selectedDateTime.toISOString());
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
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>今天心情如何？</Text>
          <Text style={styles.date}>{new Date(selectedDate).toLocaleDateString()}</Text>

          <View style={styles.timePickerContainer}>
          <DateTimePicker
              value={time}
              mode="time"
              is24Hour={true}
              onChange={handleTimeChange}
            />
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
    backgroundColor: COLORS.bgMain,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
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
});

export default AddRecordModal;