import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ThemedStatusBarProps {
  /**
   * Override the automatic bar style determination
   */
  barStyle?: 'default' | 'light-content' | 'dark-content';
  /**
   * Override the automatic background color (Android only)
   */
  backgroundColor?: string;
  /**
   * Whether the status bar should be translucent (Android only)
   */
  translucent?: boolean;
  /**
   * Whether status bar transitions should be animated
   */
  animated?: boolean;
}

export const ThemedStatusBar: React.FC<ThemedStatusBarProps> = ({
  barStyle: overrideBarStyle,
  backgroundColor: overrideBackgroundColor,
  translucent = Platform.OS === 'android',
  animated = true,
}) => {
  const { isDark, theme } = useTheme();

  // Determine the appropriate bar style based on theme
  // In dark mode: light content (white icons/text)
  // In light mode: dark content (dark icons/text)
  const automaticBarStyle = isDark ? 'light-content' : 'dark-content';
  const barStyle = overrideBarStyle || automaticBarStyle;
  
  // For Android, set background color to match the app's surface color
  // This ensures consistency with the app's header areas
  const automaticBackgroundColor = Platform.OS === 'android' ? theme.surface : undefined;
  const backgroundColor = overrideBackgroundColor || automaticBackgroundColor;

  return (
    <StatusBar 
      barStyle={barStyle}
      backgroundColor={backgroundColor}
      translucent={translucent}
      animated={animated}
    />
  );
};
