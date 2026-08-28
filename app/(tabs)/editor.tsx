import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  Play,
  Save,
  Share2,
  FileText,
  Code2,
  WrapText,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/lib/theme';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

const LINE_HEIGHT = 22;
const FONT_SIZE = 13;
const CHAR_WIDTH = FONT_SIZE * 0.6; // monospace approximation
const MIN_NO_WRAP_WIDTH = 900;

export default function EditorScreen() {
  const { activeFile, updateActiveContent } = useApp();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [savedContent, setSavedContent] = useState('');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const inputRef = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      if (activeFile) {
        setContent(activeFile.content);
        setSavedContent(activeFile.content);
      }
    }, [activeFile])
  );

  const isDirty = content !== savedContent;

  const handleSave = async () => {
    if (!activeFile) return;
    await updateActiveContent(content);
    setSavedContent(content);
  };

  const handlePreview = async () => {
    if (isDirty) {
      await handleSave();
    }
    router.push('/preview');
  };

  const handleShare = async () => {
    if (!activeFile) return;
    try {
      const cacheDir = `${FileSystem.cacheDirectory}${activeFile.id}.html`;
      await FileSystem.writeAsStringAsync(cacheDir, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(cacheDir, {
          mimeType: 'text/html',
          dialogTitle: activeFile.name,
        });
      } else {
        Alert.alert('Sharing not available on this device');
      }
    } catch {
      Alert.alert('Error', 'Could not share file');
    }
  };

  if (!activeFile) {
    return (
      <SafeAreaView style={styles.noFileContainer} edges={['top']}>
        <Code2 size={64} color={Colors.dark[200]} strokeWidth={1.5} />
        <Text style={styles.noFileTitle}>No File Open</Text>
        <Text style={styles.noFileText}>
          Select a file from the Files tab or create a new one to start editing
        </Text>
        <TouchableOpacity
          style={styles.goFilesBtn}
          onPress={() => router.push('/')}>
          <FileText size={18} color={Colors.white} strokeWidth={2} />
          <Text style={styles.goFilesBtnText}>Go to Files</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const lines = content.length > 0 ? content.split('\n') : [''];
  const lineCount = lines.length;
  const gutterWidth = 22 + String(lineCount).length * 9;
  const longestLine = lines.reduce((max, l) => Math.max(max, l.length), 0);
  const noWrapWidth = Math.max(MIN_NO_WRAP_WIDTH, longestLine * CHAR_WIDTH + 48);

  // Line numbers only stay aligned when every logical line is one visual row,
  // which is guaranteed in no-wrap mode. In wrap mode the gutter is hidden.
  const gutterVisible = showLineNumbers && !wordWrap;

  const codeSurface = (
    <View style={[styles.codeRow, !wordWrap && { width: noWrapWidth }]}>
      {gutterVisible && (
        <View style={[styles.gutter, { width: gutterWidth }]} pointerEvents="none">
          {lines.map((_, i) => (
            <Text key={i} style={styles.lineNumber}>
              {i + 1}
            </Text>
          ))}
        </View>
      )}
      <TextInput
        ref={inputRef}
        style={[styles.codeInput, !wordWrap && { width: noWrapWidth - (gutterVisible ? gutterWidth : 0) }]}
        value={content}
        onChangeText={setContent}
        multiline
        scrollEnabled={false}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        keyboardType="default"
        placeholder="Start typing HTML..."
        placeholderTextColor={Colors.dark[300]}
        underlineColorAndroid="transparent"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.fileName} numberOfLines={1}>
              {activeFile.name}
            </Text>
            {isDirty && <Text style={styles.dirtyDot}>●</Text>}
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={handleSave}
              disabled={!isDirty}>
              <Save
                size={18}
                color={isDirty ? Colors.primary[600] : Colors.dark[300]}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
              <Share2 size={18} color={Colors.dark[500]} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => setShowLineNumbers(!showLineNumbers)}
              disabled={wordWrap}>
              <Code2
                size={18}
                color={gutterVisible ? Colors.primary[600] : Colors.dark[500]}
                strokeWidth={2}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setWordWrap(!wordWrap)}>
              <WrapText
                size={18}
                color={wordWrap ? Colors.primary[600] : Colors.dark[500]}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.editorContainer}>
          {wordWrap ? (
            <ScrollView
              style={styles.verticalScroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled">
              {codeSurface}
            </ScrollView>
          ) : (
            <ScrollView
              style={styles.verticalScroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled">
              <ScrollView
                horizontal
                keyboardShouldPersistTaps="handled"
                showsHorizontalScrollIndicator>
                {codeSurface}
              </ScrollView>
            </ScrollView>
          )}
        </View>

        <SafeAreaView edges={['bottom']} style={styles.bottomSafe}>
          <View style={styles.bottomBar}>
            <View style={styles.statsBox}>
              <Text style={styles.statText}>{lineCount} lines</Text>
              <Text style={styles.statDot}>·</Text>
              <Text style={styles.statText}>{content.length} chars</Text>
              <Text style={styles.statDot}>·</Text>
              {isDirty ? (
                <Text style={styles.statUnsaved}>Unsaved</Text>
              ) : (
                <Text style={styles.statSaved}>Saved</Text>
              )}
            </View>
            <TouchableOpacity style={styles.previewBtn} onPress={handlePreview} activeOpacity={0.85}>
              <Play size={18} color={Colors.white} strokeWidth={2.5} />
              <Text style={styles.previewBtnText}>Preview</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.dark[800] } as ViewStyle,
  container: { flex: 1, backgroundColor: Colors.dark[900] } as ViewStyle,
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2, backgroundColor: Colors.dark[800], borderBottomWidth: 1, borderBottomColor: Colors.dark[700] } as ViewStyle,
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0, gap: Spacing.xs } as ViewStyle,
  fileName: { flexShrink: 1, fontFamily: 'Inter-Medium', fontSize: FontSizes.sm, color: Colors.dark[100] } as ViewStyle,
  dirtyDot: { fontSize: 10, color: Colors.warning } as ViewStyle,
  headerActions: { flexDirection: 'row', flexShrink: 0, gap: 2 } as ViewStyle,
  iconBtn: { padding: Spacing.sm, borderRadius: BorderRadius.sm } as ViewStyle,
  editorContainer: { flex: 1, backgroundColor: Colors.dark[900] } as ViewStyle,
  verticalScroll: { flex: 1 } as ViewStyle,
  scrollContent: { flexGrow: 1 } as ViewStyle,
  codeRow: { flexDirection: 'row', flexGrow: 1, alignItems: 'flex-start' } as ViewStyle,
  gutter: { backgroundColor: Colors.dark[800], paddingTop: Spacing.md, paddingRight: Spacing.sm, alignSelf: 'stretch' } as ViewStyle,
  lineNumber: { fontFamily: 'JetBrainsMono-Regular', fontSize: 12, lineHeight: LINE_HEIGHT, color: Colors.dark[500], textAlign: 'right' } as ViewStyle,
  codeInput: { flex: 1, minHeight: 320, fontFamily: 'JetBrainsMono-Regular', fontSize: FONT_SIZE, lineHeight: LINE_HEIGHT, color: Colors.dark[50], paddingTop: Spacing.md, paddingBottom: Spacing.xl, paddingHorizontal: Spacing.md, backgroundColor: Colors.dark[900], textAlignVertical: 'top' } as ViewStyle,
  bottomSafe: { backgroundColor: Colors.dark[800] } as ViewStyle,
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2, backgroundColor: Colors.dark[800], borderTopWidth: 1, borderTopColor: Colors.dark[700] } as ViewStyle,
  statsBox: { flexDirection: 'row', alignItems: 'center', flexShrink: 1, minWidth: 0, gap: Spacing.xs } as ViewStyle,
  statText: { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, color: Colors.dark[400] } as ViewStyle,
  statDot: { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, color: Colors.dark[600] } as ViewStyle,
  statUnsaved: { fontFamily: 'Inter-Medium', fontSize: 11, color: Colors.warning } as ViewStyle,
  statSaved: { fontFamily: 'Inter-Medium', fontSize: 11, color: Colors.success } as ViewStyle,
  previewBtn: { flexDirection: 'row', flexShrink: 0, alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.primary[600], paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm + 2, borderRadius: BorderRadius.md } as ViewStyle,
  previewBtnText: { fontFamily: 'Inter-SemiBold', fontSize: FontSizes.sm, color: Colors.white } as ViewStyle,
  noFileContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.dark[50], paddingHorizontal: Spacing.xl } as ViewStyle,
  noFileTitle: { fontFamily: 'Inter-SemiBold', fontSize: FontSizes.xl, color: Colors.dark[700], marginTop: Spacing.lg, marginBottom: Spacing.sm } as ViewStyle,
  noFileText: { fontFamily: 'Inter-Regular', fontSize: FontSizes.md, color: Colors.dark[400], textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 22 } as ViewStyle,
  goFilesBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.primary[600], paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.md } as ViewStyle,
  goFilesBtnText: { fontFamily: 'Inter-SemiBold', fontSize: FontSizes.md, color: Colors.white } as ViewStyle,
});
