import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Link } from "expo-router";
import { theme } from "@/constants/theme";
import { MOCK_COMPLAINTS } from "@/lib/mock-data";

const statusColors: Record<string, string> = {
  pending: theme.warning,
  under_review: theme.primary,
  resolved: theme.success,
};

export default function ComplaintsScreen() {
  return (
    <View style={styles.container}>
      <Link href="/complaint-new" asChild>
        <Pressable style={styles.fab}>
          <Text style={styles.fabText}>+ New Complaint</Text>
        </Pressable>
      </Link>
      <FlatList
        data={MOCK_COMPLAINTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={[styles.badge, { backgroundColor: statusColors[item.status] + "22" }]}>
                <Text style={[styles.badgeText, { color: statusColors[item.status] }]}>
                  {item.status.replace("_", " ")}
                </Text>
              </View>
            </View>
            <Text style={styles.ref}>{item.ref}</Text>
            <Text style={styles.cat}>{item.category}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  list: { padding: 16, paddingTop: 56 },
  fab: { position: "absolute", top: 12, right: 16, left: 16, zIndex: 10, backgroundColor: theme.primary, padding: 14, borderRadius: 12, alignItems: "center" },
  fabText: { color: "#fff", fontWeight: "700" },
  card: { backgroundColor: theme.card, borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: theme.border },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: 16, fontWeight: "600", flex: 1, color: theme.text },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: "600", textTransform: "capitalize" },
  ref: { fontSize: 12, color: theme.muted, marginTop: 8 },
  cat: { fontSize: 13, color: theme.primary, marginTop: 4 },
});
