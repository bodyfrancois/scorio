import React from 'react';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

/** Palette des quartiers, parcourue en boucle quel que soit le nombre d'entrées. */
export const WHEEL_COLORS = [
  '#7C48CA', '#0A9396', '#EF4444', '#F59E0B',
  '#10B981', '#3B82F6', '#EC4899', '#8B5CF6',
];

const VIEW = 200;
const CENTER = VIEW / 2;
const RADIUS = CENTER - 4;

function polar(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) };
}

/** Quartier `[start, end]` en degrés, sous forme de secteur plein. */
function sectorPath(start: number, end: number): string {
  const from = polar(start, RADIUS);
  const to = polar(end, RADIUS);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${from.x} ${from.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${to.x} ${to.y} Z`;
}

/**
 * Roue statique : la rotation est appliquée par l'appelant sur le conteneur.
 * Le quartier 0 démarre à 12 h, ce qui aligne le résultat sur le curseur.
 */
export default function SpinWheel({ entries, size }: { entries: string[]; size: number }) {
  const step = 360 / entries.length;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${VIEW} ${VIEW}`}>
      {entries.map((entry, index) => {
        const start = index * step;
        const middle = start + step / 2;
        const label = polar(middle, RADIUS * 0.62);

        return (
          <G key={`${entry}-${index}`}>
            <Path d={sectorPath(start, start + step)} fill={WHEEL_COLORS[index % WHEEL_COLORS.length]} />
            {/*
              Libellé laissé à l'horizontale : une rotation radiale rendrait
              illisibles, tête en bas, tous les quartiers de la moitié basse.
            */}
            <SvgText
              x={label.x}
              y={label.y}
              fill="#FFFFFF"
              fontSize={entries.length > 8 ? 9 : 11}
              fontWeight="700"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {entry.length > 12 ? `${entry.slice(0, 11)}…` : entry}
            </SvgText>
          </G>
        );
      })}
      <Circle cx={CENTER} cy={CENTER} r="14" fill="#FFFFFF" />
      <Circle cx={CENTER} cy={CENTER} r="14" stroke="rgba(0,0,0,0.12)" strokeWidth="1" fill="none" />
    </Svg>
  );
}
