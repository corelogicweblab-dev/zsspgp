import { View, Text, StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { Link } from "expo-router";
import { theme } from "@/constants/theme";
import { MOCK_ANNOUNCEMENTS, MOCK_ALERTS } from "@/lib/mock-data";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Image source={require("@/assets/images/zamboangasibugaylogo.png")} style={styles.logo} />
        <Text style={styles.heroTitle}>ZSSPGP</Text>
        <Text style={styles.heroSub}>Smart Provincial Governance</Text>
      </View>
      <View style={styles.actions}>
        <Link href="/complaint-new" asChild>
          <Pressable style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>File a Complaint</Text>
          </Pressable>
        </Link>
        <Link href="/(tabs)/complaints" asChild>
          <Pressable style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Track Complaints</Text>
          </Pressable>
        </Link>
      </View>
      <Text style={styles.sectionTitle}>Emergency Alerts</Text>
      {MOCK_ALERTS.slice(0, 2).map((a) => (
        <View key={a.id} style={[styles.card, a.severity === "critical" && styles.cardCritical]}>
          <Text style={styles.cardTitle}>{a.title}</Text>
          <Text style={styles.cardBody}>{a.message}</Text>
          <Text style={styles.cardMeta}>{a.time}</Text>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Announcements</Text>
      {MOCK_ANNOUNCEMENTS.map((a) => (
        <View key={a.id} style={styles.card}>
          <Text style={styles.cardTitle}>{a.title}</Text>
          <Text style={styles.cardBody}>{a.content}</Text>
          <Text style={styles.cardMeta}>{a.date}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 16, paddingBottom: 32 },
  hero: { alignItems: "center", paddingVertical: 24, backgroundColor: theme.primary, borderRadius: 16, marginBottom: 20 },
  logo: { width: 80, height: 80, borderRadius: 40 },
  heroTitle: { fontSize: 24, fontWeight: "800", color: "#fff", marginTop: 12 },
  heroSub: { fontSize: 13, color: "#bfdbfe", marginTop: 4 },
  actions: { gap: 10, marginBottom: 24 },
  primaryBtn: { backgroundColor: theme.primary, padding: 16, borderRadius: 12, alignItems: "center" },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  secondaryBtn: { backgroundColor: theme.card, padding: 16, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: theme.border },
  secondaryBtnText: { color: theme.primary, fontWeight: "600", fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: theme.text, marginBottom: 12 },
  card: { backgroundColor: theme.card, borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: theme.border },
  cardCritical: { borderColor: theme.danger, borderLeftWidth: 4 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: theme.text },
  cardBody: { fontSize: 14, color: theme.muted, marginTop: 6 },
  cardMeta: { fontSize: 12, color: theme.muted, marginTop: 8 },
});
