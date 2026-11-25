import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { SafeAreaProvider } from "react-native-safe-area-context";

import colors from "../../theme/colors";
import radius from "../../theme/radius";
import spacing from "../../theme/spacing";
import typography from "../../theme/typography";

const TABS = [
  "Em andamento",
  "Finalizados",
  "Todos",
];

const HISTORICO = [];

export default function HistoricoScreen({ onVoltar }) {
  const [tab, setTab] = useState("Em andamento");

  const visible = HISTORICO.filter((item) => {
    if (tab === "Todos") {
      return true;
    }

    if (tab === "Finalizados") {
      return item.status === "Concluído";
    }

    return item.status !== "Concluído";
  });

  return (
    <SafeAreaProvider style={styles.container}>

      {/* HEADER — MESMO PADRÃO DA AGENDA */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onVoltar}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={colors.text}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Histórico de tratamentos
        </Text>
      </View>

      <View style={styles.content}>

        {/* ABAS */}
        <View style={styles.tabs}>
          {TABS.map((item) => {
            const active = item === tab;

            return (
              <TouchableOpacity
                key={item}
                onPress={() => setTab(item)}
                activeOpacity={0.8}
                style={[
                  styles.tab,
                  active && styles.activeTab,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    active && styles.activeTabText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* HISTÓRICO */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {visible.length === 0 ? (
            <View style={styles.empty}>

              <View style={styles.emptyIconCircle}>
                <Ionicons
                  name="file-tray-outline"
                  size={42}
                  color={colors.primary}
                />
              </View>

              <Text style={styles.emptyTitle}>
                Nenhum tratamento no histórico
              </Text>

              <Text style={styles.emptyText}>
                Quando você concluir ou tiver tratamentos
                em andamento, eles aparecerão aqui.
              </Text>

            </View>
          ) : (
            visible.map((item) => (
              <View
                key={item.id}
                style={styles.historyCard}
              >
                <View style={styles.pillCircle}>
                  <Ionicons
                    name="medkit-outline"
                    size={20}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.historyInfo}>
                  <Text style={styles.historyName}>
                    {item.nome}
                  </Text>

                  <Text style={styles.historyDose}>
                    {item.dose}
                  </Text>
                </View>

                <View style={styles.status}>
                  <Text style={styles.statusText}>
                    {item.status}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.authBackground,
  },

  header: {
    minHeight: 75,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,

    borderBottomWidth: 1,
    borderBottomColor: colors.border,

    shadowColor: colors.text,
    shadowOpacity: 0.08,
    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  headerTitle: {
    fontSize: typography.size.xl,
    lineHeight: typography.size.xl + 8,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },

  backButton: {
    position: "absolute",
    left: spacing.lg,

    width: 48,
    height: 48,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 1,
  },

  /* CONTEÚDO — MESMO PADRÃO DA AGENDA */
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },

  /* ABAS */
  tabs: {
    width: "100%",
    alignSelf: "center",

    flexDirection: "row",

    backgroundColor: colors.background,

    borderRadius: radius.md,

    shadowColor: colors.text,
    shadowOpacity: 0.08,
    shadowRadius: 4,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  tab: {
    flex: 1,

    minHeight: 44,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: radius.md,
  },

  activeTab: {
    backgroundColor: colors.primary,
  },

  tabText: {
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm + 5,
    fontWeight: "700",
    color: colors.textSecondary,
    textAlign: "center",
  },

  activeTabText: {
    color: colors.card,
  },

  /* SCROLL */
  scroll: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing["3xl"],
  },

  /* ESTADO VAZIO */
  empty: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: spacing.lg,
  },

  emptyIconCircle: {
    width: 96,
    height: 96,

    borderRadius: radius["2xl"] + 16,

    backgroundColor: colors.primaryLight,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: spacing.lg,
  },

  emptyTitle: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md + 6,

    fontWeight: "700",

    color: colors.text,

    textAlign: "center",
  },

  emptyText: {
    maxWidth: 290,

    marginTop: spacing.xs,

    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.body,

    color: colors.textSecondary,

    textAlign: "center",
  },

  /* CARDS DO HISTÓRICO */
  historyCard: {
    minHeight: 72,

    marginTop: spacing.lg,

    width: "100%",

    backgroundColor: colors.card,

    borderRadius: radius.lg,

    paddingHorizontal: spacing.lg,

    flexDirection: "row",
    alignItems: "center",
  },

  pillCircle: {
    width: 48,
    height: 48,

    borderRadius: radius["2xl"],

    backgroundColor: colors.primaryLight,

    justifyContent: "center",
    alignItems: "center",

    marginRight: spacing.md,
  },

  historyInfo: {
    flex: 1,
  },

  historyName: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md + 6,

    fontWeight: "700",

    color: colors.text,
  },

  historyDose: {
    marginTop: spacing.xs,

    fontSize: typography.size.sm,

    color: colors.textSecondary,
  },

  status: {
    minHeight: 36,

    paddingHorizontal: spacing.sm,

    borderRadius: radius.sm,

    backgroundColor: colors.primaryLight,

    justifyContent: "center",
    alignItems: "center",
  },

  statusText: {
    fontSize: typography.size.xs,

    fontWeight: "700",

    color: colors.primary,
  },
});