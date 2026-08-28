import React from 'react';
import { ScrollView, StyleSheet, Text, View, Linking, TouchableOpacity } from 'react-native';
import { Code2, ShieldCheck, FileText, Mail, Info, ChevronRight, HardDrive, Smartphone, Zap, Palette, Upload, Download, Eye, FolderOpen } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/lib/theme';

const PRIVACY_URL = 'https://iftechstudio.blogspot.com/p/privacy-policy-html-editor-viewer.html';
const TERMS_URL = 'https://iftechstudio.blogspot.com/p/terms-conditions-html-editor-viewer.html';
const CONTACT_URL = 'https://iftechstudio.blogspot.com/p/contact-us.html';

const FEATURES = [
  { icon: Code2, title: 'Code Editor', desc: 'Full HTML editor with monospace font and line numbers' },
  { icon: Eye, title: 'Live Preview', desc: 'Instantly render your HTML in an in-app browser' },
  { icon: FolderOpen, title: 'File Management', desc: 'Create, rename, delete, and organize your HTML files' },
  { icon: Upload, title: 'Import Files', desc: 'Import HTML files from your device storage' },
  { icon: Download, title: 'Export & Share', desc: 'Export or share your HTML files anytime' },
  { icon: Smartphone, title: 'Responsive Testing', desc: 'Preview in mobile, tablet, and desktop viewport sizes' },
  { icon: HardDrive, title: 'Local Storage', desc: 'All files are saved on your device. No cloud, no tracking' },
  { icon: Palette, title: 'Templates', desc: 'Start from pre-built templates to save time' },
];

const LINKS = [
  { icon: ShieldCheck, title: 'Privacy Policy', url: PRIVACY_URL, color: Colors.success },
  { icon: FileText, title: 'Terms & Conditions', url: TERMS_URL, color: Colors.primary[600] },
  { icon: Mail, title: 'Contact Us', url: CONTACT_URL, color: Colors.accent },
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
        <Text style={styles.appVersion}>Version 1.3.0</Text>
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
        <Text style={styles.sectionTitle}>Legal & Contact</Text>
        {LINKS.map((link, i) => {
          const IconComp = link.icon;
          return (
            <TouchableOpacity key={i} style={styles.linkCard} onPress={() => openLink(link.url)} activeOpacity={0.7}>
              <View style={styles.linkIconBox}>
                <IconComp size={22} color={link.color} strokeWidth={2} />
              </View>
              <Text style={styles.linkTitle}>{link.title}</Text>
              <ChevronRight size={20} color={Colors.dark[400]} strokeWidth={2} />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutRow}>
          <Info size={18} color={Colors.dark[400]} strokeWidth={2} />
          <Text style={styles.aboutLabel}>Built with Expo & React Native</Text>
        </View>
        <View style={styles.aboutRow}>
          <Smartphone size={18} color={Colors.dark[400]} strokeWidth={2} />
          <Text style={styles.aboutLabel}>Works on Android and iOS</Text>
        </View>
        <View style={styles.aboutRow}>
          <Zap size={18} color={Colors.dark[400]} strokeWidth={2} />
          <Text style={styles.aboutLabel}>No internet connection required</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>HTML Viewer & Editor{'\n'}Version 1.3.0 (Build 4){'\n'}© 2026 IF Tech Studio{'\n'}All rights reserved</Text>
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
  linkCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.dark[100], gap: Spacing.md },
  linkIconBox: { width: 44, height: 44, borderRadius: BorderRadius.md, backgroundColor: Colors.dark[50], justifyContent: 'center', alignItems: 'center' },
  linkTitle: { flex: 1, fontFamily: 'Inter-SemiBold', fontSize: FontSizes.md, color: Colors.dark[800] },
  aboutRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  aboutLabel: { fontFamily: 'Inter-Regular', fontSize: FontSizes.md, color: Colors.dark[600] },
  footer: { alignItems: 'center', paddingTop: Spacing.xl },
  footerText: { fontFamily: 'Inter-Regular', fontSize: FontSizes.sm, color: Colors.dark[400], textAlign: 'center', lineHeight: 20 },
});
