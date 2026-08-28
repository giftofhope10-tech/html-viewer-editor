import { Platform } from 'react-native';
import { HtmlFile } from '@/types/html-file';

const IS_WEB = Platform.OS === 'web';
const STORAGE_KEY = 'html_editor_files';

function genId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeName(name: string): string {
  return name.endsWith('.html') ? name : `${name}.html`;
}

/* ----------------------------- Web (localStorage) ----------------------------- */

function webLoadAll(): HtmlFile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : data.files || [];
  } catch {
    return [];
  }
}

function webPersist(files: HtmlFile[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

/* --------------------------- Native (expo-file-system) --------------------------- */

async function nativeImport(): Promise<typeof import('expo-file-system/legacy')> {
  return await import('expo-file-system/legacy');
}

async function nativeLoadAll(): Promise<HtmlFile[]> {
  try {
    const FileSystem = await nativeImport();
    const dir = `${FileSystem.documentDirectory}html_files/`;
    const metaFile = `${dir}meta.json`;
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) return [];
    const info = await FileSystem.getInfoAsync(metaFile);
    if (!info.exists) return [];
    const raw = await FileSystem.readAsStringAsync(metaFile, { encoding: FileSystem.EncodingType.UTF8 });
    const data = JSON.parse(raw);
    return data.files || [];
  } catch {
    return [];
  }
}

async function nativePersist(files: HtmlFile[]): Promise<void> {
  const FileSystem = await nativeImport();
  const dir = `${FileSystem.documentDirectory}html_files/`;
  const metaFile = `${dir}meta.json`;
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  await FileSystem.writeAsStringAsync(metaFile, JSON.stringify({ files }), { encoding: FileSystem.EncodingType.UTF8 });
}

async function nativeWriteContent(id: string, content: string): Promise<void> {
  const FileSystem = await nativeImport();
  const dir = `${FileSystem.documentDirectory}html_files/`;
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  await FileSystem.writeAsStringAsync(`${dir}${id}.html`, content, { encoding: FileSystem.EncodingType.UTF8 });
}

async function nativeDeleteContent(id: string): Promise<void> {
  try {
    const FileSystem = await nativeImport();
    const path = `${FileSystem.documentDirectory}html_files/${id}.html`;
    const info = await FileSystem.getInfoAsync(path);
    if (info.exists) {
      await FileSystem.deleteAsync(path, { idempotent: true });
    }
  } catch {
    // content file may not exist; safe to ignore
  }
}

/* ------------------------------- Public API ------------------------------- */

export async function loadAllFiles(): Promise<HtmlFile[]> {
  if (IS_WEB) return webLoadAll();
  return nativeLoadAll();
}

export async function loadFileContent(id: string): Promise<string> {
  if (IS_WEB) {
    const files = webLoadAll();
    return files.find((f) => f.id === id)?.content ?? '';
  }
  try {
    const FileSystem = await nativeImport();
    const path = `${FileSystem.documentDirectory}html_files/${id}.html`;
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) return '';
    return await FileSystem.readAsStringAsync(path, { encoding: FileSystem.EncodingType.UTF8 });
  } catch {
    return '';
  }
}

export async function saveFile(id: string, content: string): Promise<void> {
  if (IS_WEB) {
    const files = webLoadAll();
    const idx = files.findIndex((f) => f.id === id);
    if (idx >= 0) {
      files[idx] = { ...files[idx], content, updatedAt: Date.now() };
      webPersist(files);
    }
    return;
  }
  await nativeWriteContent(id, content);
}

export async function createFile(name: string, content: string): Promise<HtmlFile> {
  const id = genId();
  const now = Date.now();
  const file: HtmlFile = {
    id,
    name: normalizeName(name),
    content,
    createdAt: now,
    updatedAt: now,
  };

  if (IS_WEB) {
    const files = webLoadAll();
    files.unshift(file);
    webPersist(files);
    return file;
  }

  await nativeWriteContent(id, content);
  const files = await nativeLoadAll();
  files.unshift(file);
  await nativePersist(files);
  return file;
}

export async function updateFileMeta(id: string, patch: Partial<HtmlFile>): Promise<HtmlFile[]> {
  const files = await loadAllFiles();
  const idx = files.findIndex((f) => f.id === id);
  if (idx >= 0) {
    files[idx] = { ...files[idx], ...patch, updatedAt: Date.now() };
    if (IS_WEB) {
      webPersist(files);
    } else {
      await nativePersist(files);
    }
  }
  return files;
}

export async function deleteFile(id: string): Promise<HtmlFile[]> {
  if (IS_WEB) {
    const files = webLoadAll().filter((f) => f.id !== id);
    webPersist(files);
    return files;
  }
  await nativeDeleteContent(id);
  const files = await nativeLoadAll();
  const filtered = files.filter((f) => f.id !== id);
  await nativePersist(filtered);
  return filtered;
}

export async function renameFile(id: string, newName: string): Promise<HtmlFile[]> {
  return updateFileMeta(id, { name: normalizeName(newName) });
}

export async function getFileUri(id: string): Promise<string> {
  if (IS_WEB) return '';
  const FileSystem = await nativeImport();
  return `${FileSystem.documentDirectory}html_files/${id}.html`;
}

export async function importFile(name: string, content: string): Promise<HtmlFile> {
  const cleanName = name.endsWith('.html') || name.endsWith('.htm') ? name : `${name}.html`;
  return createFile(cleanName, content);
}

export async function exportFile(id: string, name: string): Promise<string> {
  const content = await loadFileContent(id);
  if (IS_WEB) {
    const blob = new Blob([content], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }
  const FileSystem = await nativeImport();
  const cacheDir = `${FileSystem.cacheDirectory}${name}`;
  await FileSystem.writeAsStringAsync(cacheDir, content, { encoding: FileSystem.EncodingType.UTF8 });
  return cacheDir;
}
