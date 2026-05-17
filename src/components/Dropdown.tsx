import { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { makeSharedStyles } from '../theme/styles';
import { getGameConfig } from '../games/registry';

// ─── DropdownSelect: number-based options (dates, rounds…) ───────────────────

type DropdownSelectProps = {
  value: number | null;
  options: { label: string; value: number }[];
  placeholder: string;
  onChange: (v: number | null) => void;
};

export function DropdownSelect({ value, options, placeholder, onChange }: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();
  const s = useMemo(() => makeSharedStyles(colors), [colors]);
  const label = options.find((o) => o.value === value)?.label ?? null;

  return (
    <>
      <Pressable
        style={[s.ddInput, open && s.ddInputOpen]}
        onPress={() => setOpen((o) => !o)}
      >
        <Text style={[s.ddPlaceholder, label !== null && { color: colors.text, fontWeight: '500' }]}>
          {label ?? placeholder}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
      </Pressable>
      {open && (
        <View style={s.ddList}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable style={s.ddOption} onPress={() => { onChange(null); setOpen(false); }}>
              <Text style={[s.ddOptionText, value === null && s.ddOptionTextActive]}>{placeholder}</Text>
              {value === null && <Ionicons name="checkmark" size={16} color={colors.primary} />}
            </Pressable>
            {options.map((opt) => {
              const active = value === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  style={[s.ddOption, active && s.ddOptionActive]}
                  onPress={() => { onChange(opt.value); setOpen(false); }}
                >
                  <Text style={[s.ddOptionText, active && s.ddOptionTextActive]}>{opt.label}</Text>
                  {active && <Ionicons name="checkmark" size={16} color={colors.primary} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </>
  );
}

// ─── DropdownGame: game name options with images ──────────────────────────────

type DropdownGameProps = {
  value: string | null;
  options: string[];
  placeholder: string;
  onChange: (v: string | null) => void;
};

export function DropdownGame({ value, options, placeholder, onChange }: DropdownGameProps) {
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();
  const s = useMemo(() => makeSharedStyles(colors), [colors]);

  return (
    <>
      <Pressable
        style={[s.ddInput, open && s.ddInputOpen]}
        onPress={() => setOpen((o) => !o)}
      >
        {value !== null ? (
          <View style={s.ddValueRow}>
            {getGameConfig(value)?.image && (
              <Image source={getGameConfig(value)!.image} style={s.ddLogoSmall} />
            )}
            <Text style={s.ddValueText}>{value}</Text>
          </View>
        ) : (
          <Text style={s.ddPlaceholder}>{placeholder}</Text>
        )}
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
      </Pressable>
      {open && (
        <View style={s.ddList}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable style={s.ddOption} onPress={() => { onChange(null); setOpen(false); }}>
              <Text style={[s.ddOptionText, value === null && s.ddOptionTextActive]}>{placeholder}</Text>
              {value === null && <Ionicons name="checkmark" size={16} color={colors.primary} />}
            </Pressable>
            {options.map((opt) => {
              const config = getGameConfig(opt);
              const active = value === opt;
              return (
                <Pressable
                  key={opt}
                  style={[s.ddOption, active && s.ddOptionActive]}
                  onPress={() => { onChange(opt); setOpen(false); }}
                >
                  <View style={s.ddValueRow}>
                    {config?.image && <Image source={config.image} style={s.ddLogoSmall} />}
                    <Text style={[s.ddOptionText, active && s.ddOptionTextActive]}>{opt}</Text>
                  </View>
                  {active && <Ionicons name="checkmark" size={16} color={colors.primary} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </>
  );
}
