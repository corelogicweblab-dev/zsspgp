import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Link } from "expo-router";
import { theme } from "@/constants/theme";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("@/assets/images/zamboangasibugaylogo.png")} style={styles.avatar} />
        <Text style={styles.name}>Juan Dela Cruz</Text>
        <Text style={styles.role}>Citizen • Ipil, Zamboanga Sibugay</Text>
      </View>
      <View style={styles.menu}>
        {["Edit Profile", "Municipality Settings", "Notification Preferences", "About ZSSPGP"].map((item) => (
          <Pressable key={item} style={styles.menuItem}>
            <Text style={styles.menuText}>{item}</Text>
          </Pressable>
        ))}
        <Link href="/login" asChild>
          <Pressable style={[styles.menuItem, styles.logout]}>
            <Text style={styles.logoutText}>Sign In / Register</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: { alignItems: "center", padding: 32, backgroundColor: theme.card, borderBottomWidth: 1, borderBottomColor: theme.border },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  name: { fontSize: 22, fontWeight: "700", marginTop: 16, color: theme.text },
  role: { fontSize: 14, color: theme.muted, marginTop: 4 },
  menu: { padding: 16 },
  menuItem: { backgroundColor: theme.card, padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: theme.border },
  menuText: { fontSize: 16, color: theme.text },
  logout: { marginTop: 16, backgroundColor: theme.primary },
  logoutText: { fontSize: 16, color: "#fff", fontWeight: "600", textAlign: "center" },
});
