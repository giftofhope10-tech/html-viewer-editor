import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Info, Moon, ShieldCheck, Sun, FileText } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { BorderRadius, Colors, FontSizes, Spacing } from '@/lib/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const { themeMode, setThemeMode } = useApp();
  const dark = themeMode === 'dark';
  const palette = dark ? Colors.darkTheme : Colors.lightTheme;

  return (
    <ScrollView style={[styles.container, { backgroundColor: palette.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: palette.text }]}>Settings</Text>
      <Text style={[styles.subtitle, { color: palette.muted }]}>Make the editor feel right for you</Text>

      <View style={[styles.section, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Appearance</Text>
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: dark ? Colors.dark[700] : Colors.primary[50] }]}>
            {dark ? <Moon size={20} color={Colors.primary[300]} /> : <Sun size={20} color={Colors.primary[600]} />}
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: palette.text }]}>Dark mode</Text>
            <Text style={[styles.rowDescription, { color: palette.muted }]}>Use a darker interface for comfortable night editing</Text>
          </View>
          <Switch value={dark} onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')} trackColor={{ false: Colors.dark[200], true: Colors.primary[400] }} thumbColor={Colors.white} />
        </View>
      </View>

      <Text style={[styles.groupTitle, { color: palette.muted }]}>Information</Text>
      <View style={[styles.section, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <SettingsLink icon={<ShieldCheck size={20} color={Colors.primary[600]} />} title="Privacy Policy" onPress={() => router.push('/privacy')} palette={palette} />
        <SettingsLink icon={<FileText size={20} color={Colors.primary[600]} />} title="Terms & Conditions" onPress={() => router.push('/terms')} palette={palette} />
        <SettingsLink icon={<Info size={20} color={Colors.primary[600]} />} title="About the app" onPress={() => router.push('/about')} palette={palette} last />
      </View>

      <Text style={[styles.footer, { color: palette.muted }]}>HTML Viewer & Editor · Version 1.0.0</Text>
    </ScrollView>
  );
}

type Palette = typeof Colors.lightTheme;

function SettingsLink({ icon, title, onPress, palette, last = false }: { icon: React.ReactNode; title: string; onPress: () => void; palette: Palette; last?: boolean }) {
  return (
    <TouchableOpacity style={[styles.link, !last && { borderBottomWidth: 1, borderBottomColor: palette.border }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.linkIcon}>{icon}</View>
      <Text style={[styles.rowTitle, styles.linkTitle, { color: palette.text }]}>{title}</Text>
      <ChevronRight size={19} color={palette.muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingTop: Spacing.xxl, paddingBottom: Spacing.xxl },
  title: { fontFamily: 'Inter-Bold', fontSize: FontSizes.xxxl, marginBottom: 4 },
  subtitle: { fontFamily: 'Inter-Regular', fontSize: FontSizes.md, marginBottom: Spacing.xl },
  section: { borderRadius: BorderRadius.lg, borderWidth: 1, paddingHorizontal: Spacing.md, marginBottom: Spacing.xl },
  sectionTitle: { fontFamily: 'Inter-Bold', fontSize: FontSizes.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, gap: Spacing.md },
  iconBox: { width: 42, height: 42, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  rowTitle: { fontFamily: 'Inter-SemiBold', fontSize: FontSizes.md },
  rowDescription: { fontFamily: 'Inter-Regular', fontSize: FontSizes.sm, lineHeight: 19, marginTop: 3 },
  groupTitle: { fontFamily: 'Inter-SemiBold', fontSize: FontSizes.sm, textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.sm },
  link: { flexDirection: 'row', alignItems: 'center', minHeight: 58, gap: Spacing.md },
  linkIcon: { width: 32, alignItems: 'center' },
  linkTitle: { flex: 1 },
  footer: { fontFamily: 'Inter-Regular', fontSize: FontSizes.sm, textAlign: 'center', marginTop: Spacing.md },
});
