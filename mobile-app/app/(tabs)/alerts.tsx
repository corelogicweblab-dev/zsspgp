import { FlatList, Text, View, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";
import { MOCK_ALERTS } from "@/lib/mock-data";

export default function AlertsScreen() {
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={MOCK_ALERTS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={[styles.card, item.severity === "critical" && styles.critical]}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.message}</Text>
          <Text style={styles.meta}>{item.time} • {item.severity.toUpperCase()}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  list: { padding: 16 },
  card: { backgroundColor: theme.card, borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: theme.border },
  critical: { borderLeftWidth: 4, borderLeftColor: theme.danger },
  title: { fontSize: 16, fontWeight: "700", color: theme.text },
  body: { fontSize: 14, color: theme.muted, marginTop: 6 },
  meta: { fontSize: 12, color: theme.muted, marginTop: 10 },
});
