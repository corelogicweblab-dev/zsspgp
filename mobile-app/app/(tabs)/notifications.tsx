import { FlatList, Text, View, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

const NOTIFICATIONS = [
  { id: "1", title: "Complaint Update", message: "Your complaint CMP-20260515-A1B2C3 is under review.", time: "1h ago", read: false },
  { id: "2", title: "New Announcement", message: "Disaster Preparedness Week starts May 20.", time: "3h ago", read: true },
  { id: "3", title: "System", message: "Welcome to ZSSPGP Mobile.", time: "1d ago", read: true },
];

export default function NotificationsScreen() {
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={NOTIFICATIONS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={[styles.card, !item.read && styles.unread]}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.message}</Text>
          <Text style={styles.meta}>{item.time}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  list: { padding: 16 },
  card: { backgroundColor: theme.card, borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: theme.border },
  unread: { borderLeftWidth: 4, borderLeftColor: theme.primary },
  title: { fontSize: 16, fontWeight: "600", color: theme.text },
  body: { fontSize: 14, color: theme.muted, marginTop: 4 },
  meta: { fontSize: 12, color: theme.muted, marginTop: 8 },
});
