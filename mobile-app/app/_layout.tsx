import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { theme } from "@/constants/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.primary },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "700" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Official Login", presentation: "modal" }} />
        <Stack.Screen name="complaint-new" options={{ title: "File Complaint" }} />
      </Stack>
    </>
  );
}
