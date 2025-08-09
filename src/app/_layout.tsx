import "../global.css";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../context/ThemeContext';
import { ThemedStatusBar } from '../components/ThemedStatusBar';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider> 
        <ThemedStatusBar />
        <Slot />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
