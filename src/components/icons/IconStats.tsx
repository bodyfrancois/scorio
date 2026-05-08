import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function IconStats({ size = 22, color = 'black' }: { size?: number; color?: string }) {
  return <Ionicons name="bar-chart-outline" size={size} color={color} />;
}
