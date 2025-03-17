import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../constants/colors';

interface AddRecordModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddRecordModal = ({ visible, onClose }: AddRecordModalProps) => {
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
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Hello World</Text>
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
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    color: COLORS.primary,
    fontSize: 24,
  },
});

export default AddRecordModal;