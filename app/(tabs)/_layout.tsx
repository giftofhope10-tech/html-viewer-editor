import { Tabs } from 'expo-router';
import { FileText, Code, FolderOpen, Info } from 'lucide-react-native';
import { Colors } from '@/lib/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary[600],
        tabBarInactiveTintColor: Colors.dark[400],
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 11,
          paddingBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.dark[100],
          height: 60,
          paddingTop: 6,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Files',
          tabBarIcon: ({ size, color }) => <FolderOpen size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="editor"
        options={{
          title: 'Editor',
          tabBarIcon: ({ size, color }) => <Code size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="preview"
        options={{
          title: 'Preview',
          tabBarIcon: ({ size, color }) => <FileText size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ size, color }) => <Info size={size} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}
