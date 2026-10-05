import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const pad = (n, len = 2) => String(n).padStart(len, '0');

function formatStopwatch(ms) {
  const cs = Math.floor(ms / 10) % 100;
  const totalSec = Math.floor(ms / 1000);
  const s = totalSec % 60;
  const m = Math.floor(totalSec / 60) % 60;
  const h = Math.floor(totalSec / 3600);
  const base = h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  return { base, cs: pad(cs) };
}

const DARK = {
  bg: '#0B0B12',
  card: '#15151F',
  border: '#23232F',
  gold: '#F5C451',
  red: '#E0574B',
  muted: '#6E6E85',
  text: '#F2F2F7',
  ghost: '#23232F',
  mode: 'dark',
};

const LIGHT = {
  bg: '#F4F4F7',
  card: '#FFFFFF',
  border: '#E2E2EA',
  gold: '#C9971B',
  red: '#D6453A',
  muted: '#8A8A9C',
  text: '#15151F',
  ghost: '#ECECF2',
  mode: 'light',
};

export default function App() {
  const scheme = useColorScheme();
  const t = scheme === 'light' ? LIGHT : DARK;
  const styles = useMemo(() => makeStyles(t), [t]);

  const [now, setNow] = useState(new Date());
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const startRef = useRef(0);
  const baseRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      setElapsed(baseRef.current + (Date.now() - startRef.current));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  const toggle = () => {
    if (running) {
      baseRef.current = elapsed;
      setRunning(false);
    } else {
      startRef.current = Date.now();
      setRunning(true);
    }
  };

  const reset = () => {
    setRunning(false);
    baseRef.current = 0;
    setElapsed(0);
  };

  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const sw = formatStopwatch(elapsed);
  const canReset = elapsed > 0 || running;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <StatusBar style={t.mode === 'dark' ? 'light' : 'dark'} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.dot} />
          <Text style={styles.brand}>3:33</Text>
          <View style={styles.dot} />
        </View>

        {/* Hero clock */}
        <View style={styles.hero}>
          <Text style={styles.date}>{dateStr}</Text>
          <View style={styles.clockRow}>
            <Text style={styles.clock}>{hh}</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.clock}>{mm}</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.secs}>{ss}</Text>
          </View>
        </View>

        {/* Stopwatch */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>STOPWATCH</Text>

          <View style={styles.swRow}>
            <Text style={[styles.swTime, running && styles.swActive]}>{sw.base}</Text>
            <Text style={[styles.swMs, running && styles.swActive]}>.{sw.cs}</Text>
          </View>

          <View style={styles.btns}>
            <Pressable
              onPress={toggle}
              style={({ pressed }) => [
                styles.btn,
                styles.btnMain,
                running && styles.btnStop,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.btnMainText}>{running ? 'Stop' : 'Start'}</Text>
            </Pressable>

            <Pressable
              onPress={reset}
              disabled={!canReset}
              style={({ pressed }) => [
                styles.btn,
                styles.btnGhost,
                !canReset && styles.btnDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.btnGhostText}>Reset</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function makeStyles(t) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: t.bg,
      paddingHorizontal: 24,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      paddingTop: 18,
      paddingBottom: 8,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: t.gold,
    },
    brand: {
      fontSize: 18,
      fontWeight: '800',
      letterSpacing: 8,
      color: t.gold,
      marginLeft: 8,
    },
    hero: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    date: {
      fontSize: 13,
      letterSpacing: 3,
      textTransform: 'uppercase',
      color: t.muted,
      marginBottom: 18,
    },
    clockRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    clock: {
      fontSize: 76,
      fontWeight: '200',
      color: t.text,
      fontVariant: ['tabular-nums'],
      letterSpacing: 1,
    },
    colon: {
      fontSize: 76,
      fontWeight: '100',
      color: t.muted,
      marginHorizontal: 2,
    },
    secs: {
      fontSize: 76,
      fontWeight: '300',
      color: t.gold,
      fontVariant: ['tabular-nums'],
    },
    card: {
      backgroundColor: t.card,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: t.border,
      paddingVertical: 26,
      paddingHorizontal: 24,
      marginBottom: 120,
    },
    cardLabel: {
      fontSize: 11,
      letterSpacing: 5,
      color: t.muted,
      textAlign: 'center',
      marginBottom: 12,
    },
    swRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'center',
      marginBottom: 24,
    },
    swTime: {
      fontSize: 52,
      fontWeight: '300',
      color: t.text,
      fontVariant: ['tabular-nums'],
    },
    swMs: {
      fontSize: 30,
      fontWeight: '300',
      color: t.muted,
      fontVariant: ['tabular-nums'],
    },
    swActive: {
      color: t.gold,
    },
    btns: {
      flexDirection: 'row',
      gap: 12,
    },
    btn: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnMain: {
      backgroundColor: t.gold,
    },
    btnStop: {
      backgroundColor: t.red,
    },
    btnGhost: {
      backgroundColor: t.ghost,
    },
    btnDisabled: {
      opacity: 0.4,
    },
    pressed: {
      opacity: 0.7,
    },
    btnMainText: {
      fontSize: 17,
      fontWeight: '700',
      color: t.mode === 'dark' ? '#0B0B12' : '#FFFFFF',
    },
    btnGhostText: {
      fontSize: 17,
      fontWeight: '600',
      color: t.text,
    },
  });
}
