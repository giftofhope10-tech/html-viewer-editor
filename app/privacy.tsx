import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { Colors, FontSizes, Spacing } from '@/lib/theme';

export default function PrivacyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <ShieldCheck size={36} color={Colors.success} />
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.updated}>Last updated August 27, 2026</Text>
      </View>

      <Text style={styles.heading}>Your files stay yours</Text>
      <Text style={styles.body}>HTML Viewer & Editor stores the HTML files you create on your device. The app does not require an account and does not send your files to any server.</Text>

      <Text style={styles.heading}>Information we store</Text>
      <Text style={styles.body}>The app stores your file names, HTML content, creation dates, and editor preferences locally so they remain available when you reopen the app.</Text>

      <Text style={styles.heading}>Sharing and imports</Text>
      <Text style={styles.body}>Files are shared only when you choose the Share or Export action. Imported files are read from the document you select and copied into your local file list.</Text>

      <Text style={styles.heading}>No tracking</Text>
      <Text style={styles.body}>This app does not collect analytics, track your activity, or use advertising SDKs. What you create stays on your device.</Text>

      <Text style={styles.heading}>Contact</Text>
      <Text style={styles.body}>For questions about this policy, contact the app owner through the support address shown in the About section.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark[50] },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  hero: { alignItems: 'center', paddingVertical: Spacing.lg },
  title: { fontFamily: 'Inter-Bold', fontSize: FontSizes.xxl, color: Colors.dark[900], marginTop: Spacing.sm },
  updated: { fontFamily: 'Inter-Regular', fontSize: FontSizes.sm, color: Colors.dark[400], marginTop: 4 },
  heading: { fontFamily: 'Inter-Bold', fontSize: FontSizes.lg, color: Colors.dark[900], marginTop: Spacing.lg, marginBottom: Spacing.sm },
  body: { fontFamily: 'Inter-Regular', fontSize: FontSizes.md, lineHeight: 24, color: Colors.dark[600] },
});
