import React from 'react';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';

/** Roue de la fortune : six quartiers colorés et son curseur. */
export default function IconWheel({ size = 32 }: { size?: number }) {
  const sectors = [
    { d: 'M16 17V4a13 13 0 0 1 11.26 6.5Z', fill: '#EF4444' },
    { d: 'M16 17l11.26-6.5A13 13 0 0 1 27.26 23.5Z', fill: '#F59E0B' },
    { d: 'M16 17l11.26 6.5A13 13 0 0 1 16 30Z', fill: '#10B981' },
    { d: 'M16 17V30A13 13 0 0 1 4.74 23.5Z', fill: '#3B82F6' },
    { d: 'M16 17L4.74 23.5A13 13 0 0 1 4.74 10.5Z', fill: '#8B5CF6' },
    { d: 'M16 17L4.74 10.5A13 13 0 0 1 16 4Z', fill: '#EC4899' },
  ];

  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {sectors.map((sector) => (
        <Path key={sector.d} d={sector.d} fill={sector.fill} />
      ))}
      <Circle cx="16" cy="17" r="3" fill="#FFFFFF" />
      <Polygon points="16,0.5 19,6 13,6" fill="#1E293B" />
    </Svg>
  );
}
