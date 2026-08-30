import React from 'react';
import Svg, { Circle, Path, G } from 'react-native-svg';

/**
 * Disque de la pièce, sans étoile — face du mini-jeu « Pile ou Face ».
 * Rendu fidèle à `coin.svg`. Le mot de la face est superposé par l'appelant.
 */
export default function CoinDisc({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 670 670" fill="none">
      <G>
        <Circle cx="335" cy="335" r="335" fill="#f3b02d" />
        <Circle cx="335" cy="335" r="315.39" fill="#fbd453" />
        <Path
          d="M614.44,335c0,154.33-125.11,279.44-279.44,279.44S66.35,499.82,56.25,354.68c-.46-6.5-.69-13.06-.69-19.68,0-154.33,125.11-279.44,279.44-279.44,58.6,0,113,18.04,157.92,48.86,73.39,50.36,121.52,134.85,121.52,230.58Z"
          fill="#f3b02d"
        />
        <Path
          d="M492.92,104.42C187.37,29.45,86.72,247.61,56.25,354.68c-.46-6.5-.69-13.06-.69-19.68,0-154.33,125.11-279.44,279.44-279.44,58.6,0,113,18.04,157.92,48.86Z"
          fill="#c97511"
          fillOpacity={0.7}
        />
      </G>
    </Svg>
  );
}
