import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { FileText } from 'lucide-react-native';
import { Colors, FontSizes, Spacing } from '@/lib/theme';

export default function TermsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <FileText size={36} color={Colors.primary[600]} />
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.updated}>Last updated August 27, 2026</Text>
      </View>

      <Text style={styles.heading}>Use of the app</Text>
      <Text style={styles.body}>You may use HTML Viewer & Editor to create, edit, preview, import, and share HTML files for personal or professional work.</Text>

      <Text style={styles.heading}>Your content</Text>
      <Text style={styles.body}>You are responsible for the HTML, scripts, links, and other content you create or import. Only open files from sources you trust, especially when they contain scripts or external links.</Text>

      <Text style={styles.heading}>No warranty</Text>
      <Text style={styles.body}>The app is provided as-is. Keep backups of important files before deleting, replacing, or sharing them.</Text>

      <Text style={styles.heading}>Changes</Text>
      <Text style={styles.body}>These terms may be updated when the app gains new capabilities. Continued use of the app after an update means you accept the revised terms.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark[50] },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  hero: { alignItems: 'center', paddingVertical: Spacing.lg },
  title: { fontFamily: 'Inter-Bold', fontSize: FontSizes.xxl, color: Colors.dark[900], marginTop: Spacing.sm, textAlign: 'center' },
  updated: { fontFamily: 'Inter-Regular', fontSize: FontSizes.sm, color: Colors.dark[400], marginTop: 4 },
  heading: { fontFamily: 'Inter-Bold', fontSize: FontSizes.lg, color: Colors.dark[900], marginTop: Spacing.lg, marginBottom: Spacing.sm },
  body: { fontFamily: 'Inter-Regular', fontSize: FontSizes.md, lineHeight: 24, color: Colors.dark[600] },
});
