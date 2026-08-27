import React from 'react';
import { ScrollView, StyleSheet, Text, View, Linking, TouchableOpacity } from 'react-native';
import { Code2, Eye, FolderOpen, Mail, HardDrive, Smartphone, Zap, Palette, Upload, Download } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/lib/theme';

const FEATURES = [
  { icon: Code2, title: 'Code Editor', desc: 'Full HTML editor with monospace font and line numbers' },
  { icon: Eye, title: 'Live Preview', desc: 'Instantly render your HTML in an in-app browser' },
  { icon: FolderOpen, title: 'File Management', desc: 'Create, rename, delete, and organize HTML files' },
  { icon: Upload, title: 'Import Files', desc: 'Import HTML files from your device storage' },
  { icon: Download, title: 'Export & Share', desc: 'Export or share your HTML files anytime' },
  { icon: Smartphone, title: 'Responsive Testing', desc: 'Preview in mobile, tablet, and desktop viewport sizes' },
  { icon: HardDrive, title: 'Local Storage', desc: 'All files are saved on your device. No cloud, no tracking' },
  { icon: Palette, title: 'Templates', desc: 'Start from pre-built templates to save time' },
];

export default function AboutScreen() {
  const openLink = (url: string) => Linking.openURL(url).catch(() => {});

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroSection}>
        <View style={styles.logoBox}>
          <Code2 size={40} color={Colors.white} strokeWidth={2} />
        </View>
        <Text style={styles.appName}>HTML Viewer & Editor</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
        <Text style={styles.appTagline}>Write, preview, and manage HTML files right on your device</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        {FEATURES.map((feature, i) => {
          const IconComp = feature.icon;
          return (
            <View key={i} style={styles.featureItem}>
              <View style={styles.featureIconBox}>
                <IconComp size={22} color={Colors.primary[600]} strokeWidth={2} />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Built With</Text>
        <View style={styles.aboutRow}><Zap size={18} color={Colors.dark[400]} strokeWidth={2} /><Text style={styles.aboutLabel}>Expo & React Native</Text></View>
        <View style={styles.aboutRow}><Smartphone size={18} color={Colors.dark[400]} strokeWidth={2} /><Text style={styles.aboutLabel}>Works on Android and iOS</Text></View>
        <View style={styles.aboutRow}><HardDrive size={18} color={Colors.dark[400]} strokeWidth={2} /><Text style={styles.aboutLabel}>No internet connection required</Text></View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <TouchableOpacity style={styles.contactBtn} onPress={() => openLink('mailto:support@example.com')} activeOpacity={0.7}>
          <Mail size={18} color={Colors.primary[600]} strokeWidth={2} />
          <Text style={styles.contactBtnText}>support@example.com</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>HTML Viewer & Editor{'\n'}Version 1.0.0{'\n'}(c) 2026 All rights reserved</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark[50] },
  content: { paddingBottom: Spacing.xxl },
  heroSection: { alignItems: 'center', paddingVertical: Spacing.xxl, paddingHorizontal: Spacing.lg, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.dark[100] },
  logoBox: { width: 72, height: 72, borderRadius: BorderRadius.xl, backgroundColor: Colors.primary[600], justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md, shadowColor: Colors.primary[900], shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 6 },
  appName: { fontFamily: 'Inter-Bold', fontSize: FontSizes.xxl, color: Colors.dark[900], marginBottom: 4 },
  appVersion: { fontFamily: 'JetBrainsMono-Regular', fontSize: FontSizes.sm, color: Colors.dark[400], marginBottom: Spacing.md },
  appTagline: { fontFamily: 'Inter-Regular', fontSize: FontSizes.md, color: Colors.dark[500], textAlign: 'center', lineHeight: 22 },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl },
  sectionTitle: { fontFamily: 'Inter-Bold', fontSize: FontSizes.lg, color: Colors.dark[800], marginBottom: Spacing.md },
  featureItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.md },
  featureIconBox: { width: 44, height: 44, borderRadius: BorderRadius.md, backgroundColor: Colors.primary[50], justifyContent: 'center', alignItems: 'center' },
  featureInfo: { flex: 1, marginLeft: Spacing.md },
  featureTitle: { fontFamily: 'Inter-SemiBold', fontSize: FontSizes.md, color: Colors.dark[800], marginBottom: 2 },
  featureDesc: { fontFamily: 'Inter-Regular', fontSize: FontSizes.sm, color: Colors.dark[500], lineHeight: 20 },
  aboutRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  aboutLabel: { fontFamily: 'Inter-Regular', fontSize: FontSizes.md, color: Colors.dark[600] },
  contactBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.white, borderRadius: BorderRadius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.dark[100] },
  contactBtnText: { fontFamily: 'Inter-Medium', fontSize: FontSizes.md, color: Colors.primary[600] },
  footer: { alignItems: 'center', paddingTop: Spacing.xl },
  footerText: { fontFamily: 'Inter-Regular', fontSize: FontSizes.sm, color: Colors.dark[400], textAlign: 'center', lineHeight: 20 },
});
