import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, ScrollView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { RefreshCw, Eye, Code2, FileText, Monitor, Smartphone, Tablet, ZoomIn, ZoomOut } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/lib/theme';

type ViewportMode = 'responsive' | 'mobile' | 'tablet' | 'desktop';

const VIEWPORT_SIZES: Record<Exclude<ViewportMode, 'responsive'>, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
};

export default function PreviewScreen() {
  const { activeFile } = useApp();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewport, setViewport] = useState<ViewportMode>('responsive');
  const [zoom, setZoom] = useState(1);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((k) => k + 1);
    }, [])
  );

  const htmlData = useMemo(() => {
    if (!activeFile) return '';
    return activeFile.content;
  }, [activeFile, refreshKey]);

  const handleRefresh = () => setRefreshKey((k) => k + 1);
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));

  if (!activeFile) {
    return (
      <SafeAreaView style={styles.noFileContainer} edges={['top', 'bottom']}>
        <Eye size={64} color={Colors.dark[200]} strokeWidth={1.5} />
        <Text style={styles.noFileTitle}>Nothing to Preview</Text>
        <Text style={styles.noFileText}>Open or create an HTML file to see it rendered here</Text>
        <TouchableOpacity style={styles.goFilesBtn} onPress={() => router.push('/')}>
          <FileText size={18} color={Colors.white} strokeWidth={2} />
          <Text style={styles.goFilesBtnText}>Go to Files</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const viewportWidth = viewport === 'responsive' ? undefined : VIEWPORT_SIZES[viewport];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.fileName} numberOfLines={1}>{activeFile.name}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.viewportBtn, viewport === 'responsive' && styles.viewportBtnActive]} onPress={() => setViewport('responsive')}>
            <Smartphone size={15} color={viewport === 'responsive' ? Colors.primary[600] : Colors.dark[400]} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.viewportBtn, viewport === 'mobile' && styles.viewportBtnActive]} onPress={() => setViewport('mobile')}>
            <Smartphone size={15} color={viewport === 'mobile' ? Colors.primary[600] : Colors.dark[400]} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.viewportBtn, viewport === 'tablet' && styles.viewportBtnActive]} onPress={() => setViewport('tablet')}>
            <Tablet size={15} color={viewport === 'tablet' ? Colors.primary[600] : Colors.dark[400]} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.viewportBtn, viewport === 'desktop' && styles.viewportBtnActive]} onPress={() => setViewport('desktop')}>
            <Monitor size={15} color={viewport === 'desktop' ? Colors.primary[600] : Colors.dark[400]} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          <TouchableOpacity style={styles.toolBtn} onPress={handleZoomOut}>
            <ZoomOut size={16} color={Colors.dark[600]} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text>
          <TouchableOpacity style={styles.toolBtn} onPress={handleZoomIn}>
            <ZoomIn size={16} color={Colors.dark[600]} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <View style={styles.toolbarRight}>
          <TouchableOpacity style={styles.toolBtn} onPress={handleRefresh}>
            <RefreshCw size={16} color={Colors.dark[600]} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn} onPress={() => router.push('/editor')}>
            <Code2 size={16} color={Colors.dark[600]} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.previewArea}>
        <View style={[styles.webviewWrapper, viewportWidth ? { width: viewportWidth, maxWidth: '100%', alignSelf: 'center' } : {}]}>
          <WebView
            key={refreshKey}
            source={{ html: htmlData, baseUrl: 'about:blank' }}
            style={[styles.webview, { transform: [{ scale: zoom }] }]}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            scalesPageToFit
          />
        </View>
      </View>

      <SafeAreaView style={styles.bottomSafeArea} edges={['bottom']}>
        <View style={styles.bottomBar}>
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomText}>{viewport === 'responsive' ? 'Responsive' : `${viewport} (${VIEWPORT_SIZES[viewport as Exclude<ViewportMode, 'responsive'>]}px)`}</Text>
          </View>
          <Text style={styles.bottomSize}>{formatSize(activeFile.content)}</Text>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

function formatSize(html: string): string {
  const bytes = new Blob([html]).size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark[50] } as ViewStyle,
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.dark[100] } as ViewStyle,
  headerLeft: { flex: 1 } as ViewStyle,
  fileName: { fontFamily: 'Inter-Medium', fontSize: FontSizes.sm, color: Colors.dark[700] } as ViewStyle,
  headerActions: { flexDirection: 'row', gap: 4 } as ViewStyle,
  viewportBtn: { padding: Spacing.sm, borderRadius: BorderRadius.sm, backgroundColor: Colors.dark[50] } as ViewStyle,
  viewportBtnActive: { backgroundColor: Colors.primary[50] } as ViewStyle,
  toolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.dark[100] } as ViewStyle,
  toolbarLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm } as ViewStyle,
  toolbarRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm } as ViewStyle,
  toolBtn: { padding: Spacing.sm, borderRadius: BorderRadius.sm } as ViewStyle,
  zoomText: { fontFamily: 'JetBrainsMono-Regular', fontSize: 12, color: Colors.dark[500], minWidth: 45, textAlign: 'center' } as ViewStyle,
  previewArea: { flex: 1, backgroundColor: Colors.dark[100] } as ViewStyle,
  webviewWrapper: { flex: 1, backgroundColor: Colors.white } as ViewStyle,
  webview: { flex: 1, backgroundColor: Colors.white } as ViewStyle,
  bottomSafeArea: { backgroundColor: Colors.white } as ViewStyle,
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.dark[100] } as ViewStyle,
  bottomInfo: {} as ViewStyle,
  bottomText: { fontFamily: 'Inter-Regular', fontSize: FontSizes.sm, color: Colors.dark[500] } as ViewStyle,
  bottomSize: { fontFamily: 'JetBrainsMono-Regular', fontSize: 11, color: Colors.dark[400] } as ViewStyle,
  noFileContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.dark[50], paddingHorizontal: Spacing.xl } as ViewStyle,
  noFileTitle: { fontFamily: 'Inter-SemiBold', fontSize: FontSizes.xl, color: Colors.dark[700], marginTop: Spacing.lg, marginBottom: Spacing.sm } as ViewStyle,
  noFileText: { fontFamily: 'Inter-Regular', fontSize: FontSizes.md, color: Colors.dark[400], textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 22 } as ViewStyle,
  goFilesBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.primary[600], paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.md } as ViewStyle,
  goFilesBtnText: { fontFamily: 'Inter-SemiBold', fontSize: FontSizes.md, color: Colors.white } as ViewStyle,
});
