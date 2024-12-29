import { Stack } from 'expo-router/stack';
import { ModalProvider } from '@/context/ModalContext';
import Header from '@/components/Headers';
import { useState } from 'react';

export default function Layout() {
  const [isNote, setIsNote] = useState(false);

  const handleNotePress = () => {
    setIsNote(true);  
  };

  return (
    <ModalProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="ManageCategories" 
          options={{ 
            header: () => <Header onNotePress={handleNotePress} />,

          }} />
      </Stack>
    </ModalProvider>
  );
}
