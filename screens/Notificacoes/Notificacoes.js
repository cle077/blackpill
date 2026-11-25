import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Modal,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import typography from "../../theme/typography";
import radius from "../../theme/radius";

export default function Notificacoes({ onVoltar }) {
  const [notificacoesMedicamentos, setNotificacoesMedicamentos] =
    useState(true);

  const [avisarNoHorario, setAvisarNoHorario] =
    useState(true);

  const [avisarAntes, setAvisarAntes] =
    useState(false);

  const [som, setSom] =
    useState(true);

  const [vibracao, setVibracao] =
    useState(true);

  const [antecedencia, setAntecedencia] =
    useState("10 minutos");

  
  const [mostrarAntecedencia, setMostrarAntecedencia] =
    useState(false);

  const opcoesAntecedencia = [
    "5 minutos",
    "10 minutos",
    "15 minutos",
    "30 minutos",
    "1 hora",
  ];

  function selecionarAntecedencia(opcao) {
    setAntecedencia(opcao);
    setMostrarAntecedencia(false);
  }

  return (
    <View style={styles.container}>

      {/* HEADER IGUAL AO DA CONFIGURAÇÕES */}
      <View style={styles.header}>

        <TouchableOpacity
          style={styles.botaoVoltar}
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
          Notificações
        </Text>

      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
        keyboardShouldPersistTaps="handled"
      >

        {/* GERAL */}
        <Text style={styles.sectionLabel}>
          CONFIGURAÇÕES
        </Text>

        <View style={styles.card}>

          {/* NOTIFICAÇÕES DE MEDICAMENTOS */}
          <View style={styles.configuracao}>

            <View style={styles.iconCircle}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={colors.primary}
              />
            </View>

            <View style={styles.textos}>
              <Text style={styles.titulo}>
                Notificações de medicamentos
              </Text>

              <Text style={styles.descricao}>
                Receba avisos sobre seus horários de medicamentos.
              </Text>
            </View>

            <Switch
              value={notificacoesMedicamentos}
              onValueChange={(valor) => {
                setNotificacoesMedicamentos(valor);

                if (!valor) {
                  setMostrarAntecedencia(false);
                }
              }}
              trackColor={{
                false: colors.switchTrack,
                true: colors.switchTrackActive,
              }}
              thumbColor={
                notificacoesMedicamentos
                  ? colors.reminder
                  : "#FFFFFF"
              }
            />

          </View>

          <View style={styles.divisor} />

          {/* AVISAR NO HORÁRIO */}
          <View
            style={[
              styles.configuracao,
              !notificacoesMedicamentos &&
                styles.configuracaoDesativada,
            ]}
          >

            <View style={styles.iconCircle}>
              <Ionicons
                name="alarm-outline"
                size={22}
                color={colors.primary}
              />
            </View>

            <View style={styles.textos}>
              <Text style={styles.titulo}>
                Avisar no horário
              </Text>

              <Text style={styles.descricao}>
                Notificar quando chegar a hora do medicamento.
              </Text>
            </View>

            <Switch
              value={avisarNoHorario}
              onValueChange={setAvisarNoHorario}
              disabled={!notificacoesMedicamentos}
              trackColor={{
                false: colors.switchTrack,
                true: colors.switchTrackActive,
              }}
              thumbColor={
                avisarNoHorario
                  ? colors.reminder
                  : "#FFFFFF"
              }
            />

          </View>

          <View style={styles.divisor} />

          {/* AVISAR ANTES */}
          <View
            style={[
              styles.configuracao,
              !notificacoesMedicamentos &&
                styles.configuracaoDesativada,
            ]}
          >

            <View style={styles.iconCircle}>
              <Ionicons
                name="time-outline"
                size={22}
                color={colors.primary}
              />
            </View>

            <View style={styles.textos}>
              <Text style={styles.titulo}>
                Avisar antes
              </Text>

              <Text style={styles.descricao}>
                Receba um aviso antes do horário programado.
              </Text>
            </View>

            <Switch
              value={avisarAntes}
              onValueChange={setAvisarAntes}
              disabled={!notificacoesMedicamentos}
              trackColor={{
                false: colors.switchTrack,
                true: colors.switchTrackActive,
              }}
              thumbColor={
                avisarAntes
                  ? colors.reminder
                  : "#FFFFFF"
              }
            />

          </View>

          {/* ANTECEDÊNCIA */}
          {avisarAntes && notificacoesMedicamentos && (
            <>
              <View style={styles.divisor} />

              <View style={styles.antecedenciaContainer}>

                <Text style={styles.label}>
                  Tempo de antecedência
                </Text>

                <TouchableOpacity
                  style={styles.campo}
                  onPress={() =>
                    setMostrarAntecedencia(true)
                  }
                  activeOpacity={0.7}
                >

                  <Text style={styles.valor}>
                    {antecedencia}
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color={colors.textSecondary}
                  />

                </TouchableOpacity>

              </View>
            </>
          )}

          <View style={styles.divisor} />

          {/* SOM */}
          <View
            style={[
              styles.configuracao,
              !notificacoesMedicamentos &&
                styles.configuracaoDesativada,
            ]}
          >

            <View style={styles.iconCircle}>
              <Ionicons
                name="volume-medium-outline"
                size={22}
                color={colors.primary}
              />
            </View>

            <View style={styles.textos}>
              <Text style={styles.titulo}>
                Som
              </Text>

              <Text style={styles.descricao}>
                Reproduzir som na notificação.
              </Text>
            </View>

            <Switch
              value={som}
              onValueChange={setSom}
              disabled={!notificacoesMedicamentos}
              trackColor={{
                false: colors.switchTrack,
                true: colors.switchTrackActive,
              }}
              thumbColor={
                som
                  ? colors.reminder
                  : "#FFFFFF"
              }
            />

          </View>

          <View style={styles.divisor} />

          {/* VIBRAÇÃO */}
          <View
            style={[
              styles.configuracao,
              !notificacoesMedicamentos &&
                styles.configuracaoDesativada,
            ]}
          >

            <View style={styles.iconCircle}>
              <Ionicons
                name="phone-portrait-outline"
                size={22}
                color={colors.primary}
              />
            </View>

            <View style={styles.textos}>
              <Text style={styles.titulo}>
                Vibração
              </Text>

              <Text style={styles.descricao}>
                Vibrar ao receber aviso.
              </Text>
            </View>

            <Switch
              value={vibracao}
              onValueChange={setVibracao}
              disabled={!notificacoesMedicamentos}
              trackColor={{
                false: colors.switchTrack,
                true: colors.switchTrackActive,
              }}
              thumbColor={
                vibracao
                  ? colors.reminder
                  : "#FFFFFF"
              }
            />

          </View>

        </View>

        <View style={styles.espacoInferior} />

      </ScrollView>

      {/* MODAL DE ANTECEDÊNCIA */}
      <Modal
        visible={mostrarAntecedencia}
        transparent={true}
        animationType="fade"
        onRequestClose={() =>
          setMostrarAntecedencia(false)
        }
      >
        <View style={styles.modalFundo}>

          <View style={styles.modalContainer}>

            <Text style={styles.modalTitulo}>
              Tempo de antecedência
            </Text>

            {opcoesAntecedencia.map((opcao) => (
              <TouchableOpacity
                key={opcao}
                style={styles.opcao}
                onPress={() =>
                  selecionarAntecedencia(opcao)
                }
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.textoOpcao,
                    antecedencia === opcao &&
                      styles.opcaoSelecionada,
                  ]}
                >
                  {opcao}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={() =>
                setMostrarAntecedencia(false)
              }
              activeOpacity={0.7}
            >
              <Text style={styles.textoCancelar}>
                Cancelar
              </Text>
            </TouchableOpacity>

          </View>

        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  /* CONTAINER */

  container: {
    flex: 1,
    backgroundColor: colors.authBackground,
  },

  /* HEADER IGUAL AO DA CONFIGURAÇÕES */

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

  botaoVoltar: {
    position: "absolute",
    left: spacing.lg,

    width: 48,
    height: 48,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 1,
  },

  headerTitle: {
    fontSize: typography.size.xl,
    lineHeight: typography.size.xl + 8,
    fontWeight: "800",
    color: colors.text,
  },

  /* SCROLL */

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing["3xl"],
  },

  /* TÍTULO DA SEÇÃO */

  sectionLabel: {
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm + 5,
    fontWeight: "700",
    color: colors.textSecondary,

    marginTop: spacing.xl,
    marginBottom: spacing.sm,

    letterSpacing: 0.6,
  },

  /* CARD */

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    overflow: "hidden",
  },

  /* CONFIGURAÇÃO */

  configuracao: {
    minHeight: 88,

    flexDirection: "row",
    alignItems: "center",

    paddingVertical: spacing.md,
  },

  configuracaoDesativada: {
    opacity: 0.5,
  },

  /* ÍCONE */

  iconCircle: {
    width: 44,
    height: 44,

    borderRadius: 22,

    backgroundColor: colors.primaryLight,

    alignItems: "center",
    justifyContent: "center",

    marginRight: spacing.md,
  },

  /* TEXTOS */

  textos: {
    flex: 1,
    paddingRight: spacing.sm,
  },

  titulo: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md + 6,

    fontWeight: "600",

    color: colors.text,

    marginBottom: spacing.xs,
  },

  descricao: {
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm + 5,

    color: colors.textSecondary,
  },

  /* DIVISOR */

  divisor: {
    height: 1,
    backgroundColor: colors.border,
  },

  /* ANTECEDÊNCIA */

  antecedenciaContainer: {
    paddingVertical: spacing.md,
  },

  label: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md + 6,

    fontWeight: "600",
    color: colors.text,

    marginBottom: spacing.sm,
  },

  campo: {
    width: "100%",
    minHeight: 52,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: radius.md,

    paddingHorizontal: spacing.md,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: colors.card,
  },

  valor: {
    fontSize: typography.size.md,
    color: colors.text,
  },

  /* MODAL */

  modalFundo: {
    flex: 1,

    backgroundColor: "rgba(0, 0, 0, 0.35)",

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: spacing.lg,
  },

  modalContainer: {
    width: "100%",

    backgroundColor: colors.card,

    borderRadius: radius.lg,

    padding: spacing.lg,

    elevation: 8,

    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  modalTitulo: {
    fontSize: typography.size.lg,
    lineHeight: typography.size.lg + 6,

    fontWeight: "700",

    color: colors.text,

    marginBottom: spacing.sm,
  },

  opcao: {
    minHeight: 52,

    justifyContent: "center",

    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  textoOpcao: {
    fontSize: typography.size.md,
    color: colors.text,
  },

  opcaoSelecionada: {
    color: colors.reminder,
    fontWeight: "700",
  },

  botaoCancelar: {
    height: 45,

    justifyContent: "center",
    alignItems: "center",

    marginTop: spacing.sm,
  },

  textoCancelar: {
    fontSize: typography.size.sm,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  espacoInferior: {
    height: spacing.xl,
  },

});