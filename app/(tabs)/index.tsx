import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { FileText, Plus, Trash2, Edit2, Search, Clock, FileCode, Upload, Download, FilePlus, LayoutTemplate, User, Newspaper, X, Check } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { useApp } from '@/context/AppContext';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/lib/theme';
import { TEMPLATES } from '@/lib/templates';
import { HtmlFile, Template } from '@/types/html-file';
import * as storage from '@/lib/storage';

const TEMPLATE_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  FilePlus,
  LayoutTemplate,
  User,
  Newspaper,
};

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function FilesScreen() {
  const { files, loadFiles, createFile, deleteFile, renameFile, setActiveFile } = useApp();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [renameTarget, setRenameTarget] = useState<HtmlFile | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadFiles();
    }, [loadFiles])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFiles();
    setRefreshing(false);
  };

  const openFile = (file: HtmlFile) => {
    setActiveFile(file);
    router.push('/editor');
  };

  const handleDelete = (file: HtmlFile) => {
    Alert.alert(
      'Delete File',
      `Are you sure you want to delete "${file.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteFile(file.id) },
      ]
    );
  };

  const handleCreateFromTemplate = async (template: Template) => {
    try {
      const name = template.id === 'blank' ? `Untitled-${files.length + 1}` : template.name;
      const createdFile = await createFile(name, template.content);
      setActiveFile(createdFile);
      setShowCreate(false);
      await new Promise((resolve) => setTimeout(resolve, 50));
      router.replace('/editor');
    } catch {
      Alert.alert('Error', 'Could not create file. Please try again.');
    }
  };

  const handleRename = async () => {
    if (renameTarget && renameValue.trim()) {
      await renameFile(renameTarget.id, renameValue.trim());
    }
    setShowRename(false);
    setRenameTarget(null);
    setRenameValue('');
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'text/html', copyToCacheDirectory: true, multiple: false });
      if (result.canceled || !result.assets || result.assets.length === 0) return;
      const asset = result.assets[0];
      const content = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.UTF8 });
      const name = asset.name || 'imported.html';
      await storage.importFile(name, content);
      await loadFiles();
      Alert.alert('Imported', `"${name}" has been imported successfully.`);
    } catch {
      Alert.alert('Import Failed', 'Could not import the selected file.');
    }
  };

  const handleExport = async (file: HtmlFile) => {
    try {
      const path = await storage.exportFile(file.id, file.name);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path, { mimeType: 'text/html', dialogTitle: `Export ${file.name}` });
      } else {
        Alert.alert('Exported', `File saved to: ${path}`);
      }
    } catch {
      Alert.alert('Export Failed', 'Could not export the file.');
    }
  };

  const filteredFiles = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  const renderItem = ({ item }: { item: HtmlFile }) => (
    <TouchableOpacity style={styles.fileCard} onPress={() => openFile(item)} activeOpacity={0.7}>
      <View style={styles.fileIconBox}>
        <FileCode size={24} color={Colors.primary[600]} strokeWidth={2} />
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.fileMeta}>
          <Clock size={12} color={Colors.dark[400]} strokeWidth={2} />
          <Text style={styles.fileDate}>{formatDate(item.updatedAt)}</Text>
        </View>
      </View>
      <View style={styles.fileActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleExport(item)}>
          <Download size={18} color={Colors.dark[400]} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => { setRenameTarget(item); setRenameValue(item.name.replace(/\.html$/, '')); setShowRename(true); }}>
          <Edit2 size={18} color={Colors.dark[400]} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item)}>
          <Trash2 size={18} color={Colors.error} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>My Files</Text>
            <Text style={styles.subtitle}>{files.length} {files.length === 1 ? 'file' : 'files'}</Text>
          </View>
          <TouchableOpacity style={styles.importBtn} onPress={handleImport} activeOpacity={0.7}>
            <Upload size={18} color={Colors.primary[600]} strokeWidth={2} />
            <Text style={styles.importBtnText}>Import</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Search size={18} color={Colors.dark[400]} strokeWidth={2} />
        <TextInput style={styles.searchInput} placeholder="Search files..." placeholderTextColor={Colors.dark[400]} value={search} onChangeText={setSearch} />
      </View>

      {filteredFiles.length === 0 ? (
        <View style={styles.emptyState}>
          <FileText size={64} color={Colors.dark[200]} strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>No files yet</Text>
          <Text style={styles.emptyText}>{search ? 'No files match your search' : 'Create your first HTML file to get started'}</Text>
          {!search && (
            <TouchableOpacity style={styles.createBtn} onPress={() => setShowCreate(true)}>
              <Plus size={20} color={Colors.white} strokeWidth={2.5} />
              <Text style={styles.createBtnText}>New File</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList data={filteredFiles} keyExtractor={(item) => item.id} renderItem={renderItem} contentContainerStyle={styles.list} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} />
      )}

      {files.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={() => setShowCreate(true)} activeOpacity={0.85}>
          <Plus size={26} color={Colors.white} strokeWidth={2.5} />
        </TouchableOpacity>
      )}

      <Modal visible={showCreate} transparent animationType="fade" onRequestClose={() => setShowCreate(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose a Template</Text>
              <TouchableOpacity onPress={() => setShowCreate(false)}>
                <X size={22} color={Colors.dark[400]} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            {TEMPLATES.map((template) => {
              const IconComp = TEMPLATE_ICONS[template.icon] || FilePlus;
              return (
                <TouchableOpacity key={template.id} style={styles.templateItem} onPress={() => void handleCreateFromTemplate(template)} activeOpacity={0.7}>
                  <View style={styles.templateIconBox}>
                    <IconComp size={22} color={Colors.primary[600]} strokeWidth={2} />
                  </View>
                  <View style={styles.templateInfo}>
                    <Text style={styles.templateName}>{template.name}</Text>
                    <Text style={styles.templateDesc}>{template.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

      <Modal visible={showRename} transparent animationType="fade" onRequestClose={() => setShowRename(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rename File</Text>
              <TouchableOpacity onPress={() => setShowRename(false)}>
                <X size={22} color={Colors.dark[400]} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <TextInput style={styles.textInput} value={renameValue} onChangeText={setRenameValue} placeholder="Enter file name" placeholderTextColor={Colors.dark[400]} autoFocus />
            <TouchableOpacity style={styles.saveBtn} onPress={handleRename}>
              <Check size={20} color={Colors.white} strokeWidth={2.5} />
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark[50] } as ViewStyle,
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.md } as ViewStyle,
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } as ViewStyle,
  title: { fontFamily: 'Inter-Bold', fontSize: FontSizes.xxxl, color: Colors.dark[900], marginBottom: 4 } as ViewStyle,
  subtitle: { fontFamily: 'Inter-Regular', fontSize: FontSizes.md, color: Colors.dark[400] } as ViewStyle,
  importBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.primary[50], paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md } as ViewStyle,
  importBtnText: { fontFamily: 'Inter-SemiBold', fontSize: FontSizes.sm, color: Colors.primary[600] } as ViewStyle,
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, marginHorizontal: Spacing.lg, marginBottom: Spacing.md, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.dark[100] } as ViewStyle,
  searchInput: { flex: 1, fontFamily: 'Inter-Regular', fontSize: FontSizes.md, color: Colors.dark[800], paddingVertical: Spacing.sm + 2, marginLeft: Spacing.sm } as ViewStyle,
  list: { paddingHorizontal: Spacing.lg, paddingBottom: 100 } as ViewStyle,
  fileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.dark[100] } as ViewStyle,
  fileIconBox: { width: 48, height: 48, borderRadius: BorderRadius.md, backgroundColor: Colors.primary[50], justifyContent: 'center', alignItems: 'center' } as ViewStyle,
  fileInfo: { flex: 1, marginLeft: Spacing.md } as ViewStyle,
  fileName: { fontFamily: 'Inter-SemiBold', fontSize: FontSizes.md, color: Colors.dark[800], marginBottom: 4 } as ViewStyle,
  fileMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 } as ViewStyle,
  fileDate: { fontFamily: 'Inter-Regular', fontSize: FontSizes.sm, color: Colors.dark[400] } as ViewStyle,
  fileActions: { flexDirection: 'row', gap: Spacing.xs } as ViewStyle,
  actionBtn: { padding: Spacing.sm, borderRadius: BorderRadius.sm } as ViewStyle,
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl } as ViewStyle,
  emptyTitle: { fontFamily: 'Inter-SemiBold', fontSize: FontSizes.xl, color: Colors.dark[700], marginTop: Spacing.lg, marginBottom: Spacing.sm } as ViewStyle,
  emptyText: { fontFamily: 'Inter-Regular', fontSize: FontSizes.md, color: Colors.dark[400], textAlign: 'center', marginBottom: Spacing.xl } as ViewStyle,
  createBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.primary[600], paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.md } as ViewStyle,
  createBtnText: { fontFamily: 'Inter-SemiBold', fontSize: FontSizes.md, color: Colors.white } as ViewStyle,
  fab: { position: 'absolute', bottom: Spacing.xl, right: Spacing.xl, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary[600], justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary[900], shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 } as ViewStyle,
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: Spacing.lg } as ViewStyle,
  modalContent: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.lg, width: '100%', maxWidth: 400 } as ViewStyle,
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg } as ViewStyle,
  modalTitle: { fontFamily: 'Inter-Bold', fontSize: FontSizes.lg, color: Colors.dark[900] } as ViewStyle,
  templateItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.dark[50] } as ViewStyle,
  templateIconBox: { width: 44, height: 44, borderRadius: BorderRadius.md, backgroundColor: Colors.primary[50], justifyContent: 'center', alignItems: 'center' } as ViewStyle,
  templateInfo: { flex: 1, marginLeft: Spacing.md } as ViewStyle,
  templateName: { fontFamily: 'Inter-SemiBold', fontSize: FontSizes.md, color: Colors.dark[800], marginBottom: 2 } as ViewStyle,
  templateDesc: { fontFamily: 'Inter-Regular', fontSize: FontSizes.sm, color: Colors.dark[400] } as ViewStyle,
  textInput: { fontFamily: 'Inter-Regular', fontSize: FontSizes.md, color: Colors.dark[800], borderWidth: 1, borderColor: Colors.dark[200], borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, marginBottom: Spacing.lg } as ViewStyle,
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary[600], paddingVertical: Spacing.md, borderRadius: BorderRadius.md } as ViewStyle,
  saveBtnText: { fontFamily: 'Inter-SemiBold', fontSize: FontSizes.md, color: Colors.white } as ViewStyle,
});
