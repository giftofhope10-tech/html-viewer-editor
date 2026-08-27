import * as FileSystem from 'expo-file-system/legacy';
import { HtmlFile } from '@/types/html-file';

const STORAGE_DIR = `${FileSystem.documentDirectory}html_files/`;
const META_FILE = `${STORAGE_DIR}meta.json`;

interface MetaData {
  files: HtmlFile[];
}

async function ensureDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(STORAGE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(STORAGE_DIR, { intermediates: true });
  }
}

export async function loadAllFiles(): Promise<HtmlFile[]> {
  try {
    await ensureDir();
    const info = await FileSystem.getInfoAsync(META_FILE);
    if (!info.exists) return [];
    const raw = await FileSystem.readAsStringAsync(META_FILE, { encoding: FileSystem.EncodingType.UTF8 });
    const data: MetaData = JSON.parse(raw);
    return data.files || [];
  } catch {
    return [];
  }
}

export async function loadFileContent(id: string): Promise<string> {
  try {
    const info = await FileSystem.getInfoAsync(`${STORAGE_DIR}${id}.html`);
    if (!info.exists) return '';
    return await FileSystem.readAsStringAsync(`${STORAGE_DIR}${id}.html`, { encoding: FileSystem.EncodingType.UTF8 });
  } catch {
    return '';
  }
}

export async function saveFile(id: string, content: string): Promise<void> {
  try {
    await ensureDir();
    await FileSystem.writeAsStringAsync(`${STORAGE_DIR}${id}.html`, content, { encoding: FileSystem.EncodingType.UTF8 });
  } catch (e) {
    console.error('saveFile error', e);
  }
}

export async function createFile(name: string, content: string): Promise<HtmlFile> {
  const id = `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const now = Date.now();
  const file: HtmlFile = {
    id,
    name: name.endsWith('.html') ? name : `${name}.html`,
    content,
    createdAt: now,
    updatedAt: now,
  };
  await ensureDir();
  await FileSystem.writeAsStringAsync(`${STORAGE_DIR}${id}.html`, content, { encoding: FileSystem.EncodingType.UTF8 });
  const files = await loadAllFiles();
  files.unshift(file);
  await persistMeta(files);
  return file;
}

export async function updateFileMeta(id: string, patch: Partial<HtmlFile>): Promise<HtmlFile[]> {
  const files = await loadAllFiles();
  const idx = files.findIndex((f) => f.id === id);
  if (idx >= 0) {
    files[idx] = { ...files[idx], ...patch, updatedAt: Date.now() };
    await persistMeta(files);
  }
  return files;
}

export async function deleteFile(id: string): Promise<HtmlFile[]> {
  try {
    const path = `${STORAGE_DIR}${id}.html`;
    const info = await FileSystem.getInfoAsync(path);
    if (info.exists) {
      await FileSystem.deleteAsync(path, { idempotent: true });
    }
  } catch (e) {
    console.error('deleteFile content error', e);
  }
  const files = await loadAllFiles();
  const filtered = files.filter((f) => f.id !== id);
  await persistMeta(filtered);
  return filtered;
}

export async function renameFile(id: string, newName: string): Promise<HtmlFile[]> {
  return updateFileMeta(id, { name: newName.endsWith('.html') ? newName : `${newName}.html` });
}

async function persistMeta(files: HtmlFile[]): Promise<void> {
  await ensureDir();
  await FileSystem.writeAsStringAsync(META_FILE, JSON.stringify({ files }), { encoding: FileSystem.EncodingType.UTF8 });
}

export async function getFileUri(id: string): Promise<string> {
  return `${STORAGE_DIR}${id}.html`;
}

export async function importFile(name: string, content: string): Promise<HtmlFile> {
  const cleanName = name.endsWith('.html') || name.endsWith('.htm') ? name : `${name}.html`;
  return createFile(cleanName, content);
}

export async function exportFile(id: string, name: string): Promise<string> {
  const content = await loadFileContent(id);
  const cacheDir = `${FileSystem.cacheDirectory}${name}`;
  await FileSystem.writeAsStringAsync(cacheDir, content, { encoding: FileSystem.EncodingType.UTF8 });
  return cacheDir;
}
