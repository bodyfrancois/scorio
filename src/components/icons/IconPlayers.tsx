import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function IconPlayers({ size = 22, color = 'black' }: { size?: number; color?: string }) {
  return <Ionicons name="people-outline" size={size} color={color} />;
}
