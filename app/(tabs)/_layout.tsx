import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'; // 使用图标库
import COLORS from '../../constants/colors';
import AddRecordModal from '../../components/AddRecordModal';
import { useRecordStore } from '../../store/recordStore';


export default function TabLayout() {
  const { selectedDate, addRecord } = useRecordStore();
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Tabs screenOptions={{
        headerTintColor: COLORS.primary,
        headerStyle: {
          backgroundColor: COLORS.bgMain,
        },
        tabBarStyle: styles.tabBar,
        headerShadowVisible: false,
        tabBarLabelStyle: {
          display: 'none',
        },
        tabBarItemStyle: {
          flex: 1, // 让每个 tab 项目均等分配空间
          justifyContent: 'center', // 垂直居中
          alignItems: 'center', // 水平居中
          paddingVertical: 10,
        },
      }}>
        <Tabs.Screen name="index" options={{
          title: 'PoopPal',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color='white' size={24}
              style={focused ? styles.focusedIcon : null}
            />
          ),
        }} />
        <Tabs.Screen name="analysis" options={{
          title: '💩数据分析',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'reader' : 'reader-outline'} color='white' size={24}
              style={focused ? styles.focusedIcon : null}
            />
          ),
          headerRight: () => (
            <Text style={{
              color: COLORS.textSecondary,
              marginRight: 16,
              fontSize: 14,
            }}>
              了解你的排便习惯
            </Text>
          ),
        }} />
      </Tabs>
      <AddRecordModal
        selectedDate={selectedDate}
        onSubmit={(mood, timestamp) => {
          addRecord({
            timestamp,
            mood,
            id: Date.now().toString() // 使用时间戳作为唯一ID
          });
          setModalVisible(false);
        }}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.touchable}
          activeOpacity={0.7}
          onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="plus-circle" size={70} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  focusedIcon: {
    // 添加发光效果
    textShadowColor: 'rgba(255, 255, 255, 0.7)', // 光亮色
    textShadowOffset: { width: 0, height: 0 }, // 偏移
    textShadowRadius: 10, // 发光半径
  },
  touchable: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,  // 确保按钮在最上层
  },
  tabBar: {
    backgroundColor: COLORS.primary, // 更改为与背景色不一样的颜色
    borderTopWidth: 0,
    width: '80%',  // 设置为屏幕宽度的80%
    minWidth: 270,
    marginHorizontal: '10%', // 添加边距确保其居中
    borderRadius: 16,  // 圆角
    height: 56,
    position: 'absolute',
    bottom: 8, // 移动到底部
    alignSelf: 'center', // 水平居中
    justifyContent: 'center', // 确保内容垂直居中
    color: 'white'
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 15,  // 将加号抬高一点
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,  // 提升阴影效果
    backgroundColor: COLORS.bgMain, // 底部按钮背景颜色，与整体保持一致
    borderRadius: 35, // 圆形效果
    overflow: 'hidden', // 确保按钮是圆的
  },
});
