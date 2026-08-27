import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { HtmlFile } from '@/types/html-file';
import * as storage from '@/lib/storage';

interface AppContextType {
  files: HtmlFile[];
  activeFile: HtmlFile | null;
  loadFiles: () => Promise<void>;
  createFile: (name: string, content: string) => Promise<HtmlFile>;
  deleteFile: (id: string) => Promise<void>;
  renameFile: (id: string, name: string) => Promise<void>;
  setActiveFile: (file: HtmlFile | null) => void;
  updateActiveContent: (content: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<HtmlFile[]>([]);
  const [activeFile, setActiveFileState] = useState<HtmlFile | null>(null);

  const loadFiles = useCallback(async () => {
    const loaded = await storage.loadAllFiles();
    setFiles(loaded);
  }, []);

  const createFile = useCallback(async (name: string, content: string) => {
    const file = await storage.createFile(name, content);
    setFiles((prev) => [file, ...prev]);
    setActiveFileState(file);
    return file;
  }, []);

  const deleteFile = useCallback(async (id: string) => {
    const updated = await storage.deleteFile(id);
    setFiles(updated);
    setActiveFileState((prev) => (prev?.id === id ? null : prev));
  }, []);

  const renameFile = useCallback(async (id: string, name: string) => {
    const updated = await storage.renameFile(id, name);
    setFiles(updated);
    setActiveFileState((prev) => (prev?.id === id ? updated.find((f) => f.id === id) || prev : prev));
  }, []);

  const setActiveFile = useCallback((file: HtmlFile | null) => {
    setActiveFileState(file);
  }, []);

  const updateActiveContent = useCallback(async (content: string) => {
    if (!activeFile) return;
    await storage.saveFile(activeFile.id, content);
    const updated = await storage.updateFileMeta(activeFile.id, { content });
    setFiles(updated);
    setActiveFileState(updated.find((f) => f.id === activeFile.id) || activeFile);
  }, [activeFile]);

  return (
    <AppContext.Provider
      value={{
        files,
        activeFile,
        loadFiles,
        createFile,
        deleteFile,
        renameFile,
        setActiveFile,
        updateActiveContent,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
