import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { theme } from "@/constants/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/zamboangasibugaylogo.png")} style={styles.logo} />
      <Text style={styles.title}>ZSSPGP Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Pressable style={styles.btn} onPress={() => router.replace("/(tabs)")}>
        <Text style={styles.btnText}>Sign In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: theme.background },
  logo: { width: 100, height: 100, borderRadius: 50, alignSelf: "center", marginBottom: 24 },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 24, color: theme.text },
  input: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 14, marginBottom: 12, fontSize: 16 },
  btn: { backgroundColor: theme.primary, padding: 16, borderRadius: 12, marginTop: 8 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 16 },
});
