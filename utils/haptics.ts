import { Vibration } from 'react-native';

export const haptics = {
  // 轻触反馈，用于普通按钮点击
  light: () => Vibration.vibrate(10),
  
  // 选择反馈，用于切换状态、选择选项
  selection: () => Vibration.vibrate(25),
  
  // 确认反馈，用于确认操作、提交表单
  success: () => Vibration.vibrate(30),
  
  // 警告反馈，用于错误提示、警告操作
  warning: () => Vibration.vibrate([0, 30, 50, 30]),
};