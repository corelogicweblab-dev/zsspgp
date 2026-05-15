import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { theme } from "@/constants/theme";

const CATEGORIES = ["Roads", "Flooding", "Health", "Garbage", "Water", "Electricity", "Others"];

export default function NewComplaintScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [municipality, setMunicipality] = useState("");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Brief description" />
      <Text style={styles.label}>Category</Text>
      <View style={styles.chips}>
        {CATEGORIES.map((c) => (
          <Pressable key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.label}>Municipality</Text>
      <TextInput style={styles.input} value={municipality} onChangeText={setMunicipality} placeholder="e.g. Ipil" />
      <Text style={styles.label}>Description</Text>
      <TextInput style={[styles.input, styles.textarea]} value={description} onChangeText={setDescription} multiline numberOfLines={5} placeholder="Detailed complaint..." />
      <Pressable style={styles.btn} onPress={() => router.back()}>
        <Text style={styles.btnText}>Submit Complaint</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 16 },
  label: { fontSize: 14, fontWeight: "600", color: theme.text, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 14, fontSize: 16 },
  textarea: { minHeight: 120, textAlignVertical: "top" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border },
  chipActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  chipText: { fontSize: 13, color: theme.text },
  chipTextActive: { color: "#fff" },
  btn: { backgroundColor: theme.primary, padding: 16, borderRadius: 12, marginTop: 24 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 16 },
});
