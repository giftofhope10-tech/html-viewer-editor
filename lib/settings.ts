import { Platform } from 'react-native';

export type ThemeMode = 'light' | 'dark';

const IS_WEB = Platform.OS === 'web';
const SETTINGS_KEY = 'html_editor_settings';

export async function loadThemeMode(): Promise<ThemeMode> {
  if (IS_WEB) {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return 'light';
      const data: { themeMode?: ThemeMode } = JSON.parse(raw);
      return data.themeMode === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }
  try {
    const FileSystem = await import('expo-file-system/legacy');
    const settingsFile = `${FileSystem.documentDirectory}html_files/settings.json`;
    const info = await FileSystem.getInfoAsync(settingsFile);
    if (!info.exists) return 'light';
    const raw = await FileSystem.readAsStringAsync(settingsFile);
    const data: { themeMode?: ThemeMode } = JSON.parse(raw);
    return data.themeMode === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export async function saveThemeMode(themeMode: ThemeMode): Promise<void> {
  if (IS_WEB) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ themeMode }));
    return;
  }
  const FileSystem = await import('expo-file-system/legacy');
  const directory = `${FileSystem.documentDirectory}html_files/`;
  const directoryInfo = await FileSystem.getInfoAsync(directory);
  if (!directoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  }
  await FileSystem.writeAsStringAsync(
    `${directory}settings.json`,
    JSON.stringify({ themeMode })
  );
}
