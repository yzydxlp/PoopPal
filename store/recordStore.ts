import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodType } from '../constants/appData';

interface Record {
  id: string;
  timestamp: string;
  mood: MoodType;
}

interface RecordState {
  records: { [date: string]: Record[] };
  selectedDate: string;
  addRecord: (record: Record) => void;
  setSelectedDate: (date: string) => void;
  deleteRecord: (date: string, recordId: string) => void;
}

export const useRecordStore = create(
  persist<RecordState>(
    (set) => ({
      records: {},
      selectedDate: new Date().toISOString().split('T')[0],
      addRecord: (record) => set((state) => {
        const date = record.timestamp.split('T')[0];
        const newRecord = {
          ...record,
          id: Date.now().toString()
        };
        return {
          records: {
            ...state.records,
            [date]: [...(state.records[date] || []), newRecord]
          }
        };
      }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      deleteRecord: (date, recordId) => set((state) => ({
        records: {
          ...state.records,
          [date]: state.records[date].filter(record => record.id !== recordId)
        }
      })),
    }),
    {
      name: 'pooppal-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);