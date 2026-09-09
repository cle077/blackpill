import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ArrowLeft, Bell, CalendarDays, ChevronRight, Clock, Plus, Settings } from "lucide-react-native";
import api from "../../services/api";
import { Lembrete } from "../../services/lembretes";
import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import typography from "../../theme/typography";
import radius from "../../theme/radius";

type Props = {
  onVoltar: () => void;
  onAdicionarLembrete: () => void;
  onAbrirConfiguracoes: () => void;
  onAbrirCalendario: () => void;
  onEditarLembrete: (lembrete: Lembrete) => void;
};

export default function Lembretes(props: Props) {
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const { data } = await api.get("/lembretes");
      setLembretes(data);
    } catch (error: any) {
      Alert.alert("Não foi possível carregar", error?.response?.data?.message || "Confira a conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.card} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={props.onVoltar}><ArrowLeft size={28} color={colors.reminderText} /></TouchableOpacity>
          <Text style={styles.headerTitle}>Lembretes</Text>
          <TouchableOpacity style={styles.headerButton} onPress={props.onAdicionarLembrete}><Plus size={28} color={colors.reminder} /></TouchableOpacity>
        </View>

        {carregando ? (
          <View style={styles.center}><ActivityIndicator size="large" color={colors.reminder} /></View>
        ) : lembretes.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.bellCircle}><Bell size={92} color={colors.reminder} strokeWidth={1.8} /></View>
            <Text style={styles.emptyTitle}>Nenhum lembrete cadastrado</Text>
            <Text style={styles.emptyText}>Adicione um medicamento para receber avisos nos horários escolhidos.</Text>
            <TouchableOpacity style={styles.addButton} onPress={props.onAdicionarLembrete}><Plus size={25} color={colors.card} /><Text style={styles.addText}>Adicionar lembrete</Text></TouchableOpacity>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            <Text style={styles.count}>{lembretes.length} {lembretes.length === 1 ? "lembrete cadastrado" : "lembretes cadastrados"}</Text>
            {lembretes.map((item) => (
              <TouchableOpacity key={item.id_lembrete} style={styles.reminderCard} onPress={() => props.onEditarLembrete(item)}>
                <View style={styles.timeBox}><Clock size={21} color={colors.reminderDark} /><Text style={styles.time}>{item.horario}</Text></View>
                <View style={styles.cardText}><Text style={styles.medicine}>{item.medicamento}</Text><Text style={styles.frequency}>{item.frequencia}</Text></View>
                <ChevronRight size={24} color={colors.reminderText} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.options}>
          <TouchableOpacity style={styles.option} onPress={props.onAbrirConfiguracoes}><Settings size={25} color={colors.reminderDark} /><Text style={styles.optionText}>Configurações</Text><ChevronRight size={22} color={colors.reminderText} /></TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={props.onAbrirCalendario}><CalendarDays size={25} color={colors.reminderDark} /><Text style={styles.optionText}>Calendário de tratamento</Text><ChevronRight size={22} color={colors.reminderText} /></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.card }, container: { flex: 1, backgroundColor: colors.card },
  header: { minHeight: 76, flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerButton: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: typography.size.xl, fontWeight: "700", color: colors.reminderText },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xl },
  bellCircle: { width: 180, height: 180, borderRadius: 90, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  emptyTitle: { marginTop: spacing.lg, textAlign: "center", fontSize: typography.size.xl + 2, fontWeight: "700", color: colors.reminderText },
  emptyText: { marginTop: spacing.md, textAlign: "center", fontSize: typography.size.md, lineHeight: typography.size.md + 8, color: colors.textSecondary },
  addButton: { marginTop: spacing.lg, minHeight: 56, paddingHorizontal: spacing.xl, borderRadius: radius.md, backgroundColor: colors.reminder, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  addText: { color: colors.card, fontSize: typography.size.md, fontWeight: "700" },
  list: { padding: spacing.lg, gap: spacing.sm }, count: { color: colors.textSecondary, marginBottom: spacing.sm },
  reminderCard: { minHeight: 78, padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, flexDirection: "row", alignItems: "center", backgroundColor: colors.card },
  timeBox: { minWidth: 76, alignItems: "center", gap: 3 }, time: { color: colors.reminderDark, fontWeight: "700", fontSize: typography.size.md },
  cardText: { flex: 1, paddingHorizontal: spacing.sm }, medicine: { color: colors.reminderText, fontWeight: "700", fontSize: typography.size.md + 1 }, frequency: { color: colors.textSecondary, marginTop: 4, fontSize: typography.size.sm },
  options: { padding: spacing.lg, gap: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  option: { minHeight: 54, paddingHorizontal: spacing.md, borderRadius: radius.md, backgroundColor: colors.primaryLight, flexDirection: "row", alignItems: "center", gap: spacing.sm }, optionText: { flex: 1, color: colors.reminderText, fontWeight: "600" },
});
