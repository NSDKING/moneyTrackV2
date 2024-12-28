import { Stack } from 'expo-router/stack';
import { ModalProvider } from '@/context/ModalContext';

export default function Layout() {
  return (
    <ModalProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ModalProvider>
  );
}
