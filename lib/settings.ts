import * as FileSystem from 'expo-file-system/legacy';

export type ThemeMode = 'light' | 'dark';

const SETTINGS_FILE = `${FileSystem.documentDirectory}html_files/settings.json`;

export async function loadThemeMode(): Promise<ThemeMode> {
  try {
    const info = await FileSystem.getInfoAsync(SETTINGS_FILE);
    if (!info.exists) return 'light';
    const raw = await FileSystem.readAsStringAsync(SETTINGS_FILE);
    const data: { themeMode?: ThemeMode } = JSON.parse(raw);
    return data.themeMode === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export async function saveThemeMode(themeMode: ThemeMode): Promise<void> {
  const directory = `${FileSystem.documentDirectory}html_files/`;
  const directoryInfo = await FileSystem.getInfoAsync(directory);
  if (!directoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  }
  await FileSystem.writeAsStringAsync(SETTINGS_FILE, JSON.stringify({ themeMode }));
}
