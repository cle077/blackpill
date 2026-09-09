import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Switch,
  Modal,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import api from "../../services/api";
import { dataParaApi } from "../../services/lembretes";

import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import typography from "../../theme/typography";
import radius from "../../theme/radius";

import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Calendar,
  Check,
} from "lucide-react-native";

const GREEN = colors.reminder;
const TEXT = colors.reminderText;

type Props = {
  onVoltar: () => void;
  onSalvar: () => void;
};

const diasSemana = ["S", "T", "Q", "Q", "S", "S", "D"];

export default function NovoLembrete({
  onVoltar,
  onSalvar,
}: Props) {
  const [notificacao, setNotificacao] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [medicamento, setMedicamento] = useState("");

  const [horario, setHorario] = useState("");
  const [mostrarHorario, setMostrarHorario] = useState(false);

  const [frequencia, setFrequencia] = useState("");
  const [mostrarFrequencia, setMostrarFrequencia] =
    useState(false);

  const [diasSelecionados, setDiasSelecionados] =
    useState<number[]>([]);

  const [dataSelecionada, setDataSelecionada] =
    useState<Date | null>(null);
  const [data, setData] = useState("");
  const [mostrarData, setMostrarData] = useState(false);

  const formularioValido =
    medicamento.trim() !== "" &&
    horario !== "" &&
    frequencia !== "" &&
    (
      frequencia === "Todos os dias" ||
      (
        frequencia === "Dias específicos" &&
        diasSelecionados.length > 0
      ) ||
      (
        frequencia === "Uma vez" &&
        dataSelecionada !== null
      )
    );

  function selecionarHorario() {
    setMostrarHorario(true);
  }

  function alterarHorario(
    event: any,
    date?: Date
  ) {
    setMostrarHorario(false);

    if (!date) {
      return;
    }

    const horas = date
      .getHours()
      .toString()
      .padStart(2, "0");

    const minutos = date
      .getMinutes()
      .toString()
      .padStart(2, "0");

    setHorario(`${horas}:${minutos}`);
  }

  function selecionarFrequencia(
    opcao: string
  ) {
    setFrequencia(opcao);

    if (opcao === "Todos os dias") {
      setDiasSelecionados([]);
      setData("");
      setDataSelecionada(null);
    }

    if (opcao === "Dias específicos") {
      setData("");
      setDataSelecionada(null);
    }

    if (opcao === "Uma vez") {
      setDiasSelecionados([]);
    }

    setMostrarFrequencia(false);
  }

  function alternarDia(index: number) {
    const jaSelecionado =
      diasSelecionados.includes(index);

    if (jaSelecionado) {
      setDiasSelecionados(
        diasSelecionados.filter(
          (dia) => dia !== index
        )
      );
    } else {
      setDiasSelecionados([
        ...diasSelecionados,
        index,
      ]);
    }
  }

  function selecionarData() {
    setMostrarData(true);
  }

  function alterarData(
    event: any,
    date?: Date
  ) {
    setMostrarData(false);

    if (!date) {
      return;
    }

    setDataSelecionada(date);

    const dia = date
      .getDate()
      .toString()
      .padStart(2, "0");

    const mes = (date.getMonth() + 1)
      .toString()
      .padStart(2, "0");

    const ano = date.getFullYear();

    setData(`${dia}/${mes}/${ano}`);
  }

  function obterDataHorario() {
    const agora = new Date();

    if (!horario) {
      return agora;
    }

    const partes = horario.split(":");

    if (partes.length !== 2) {
      return agora;
    }

    agora.setHours(Number(partes[0]));
    agora.setMinutes(Number(partes[1]));
    agora.setSeconds(0);

    return agora;
  }

  async function salvarLembrete() {
    if (!formularioValido || salvando) return;
    setSalvando(true);
    try {
      await api.post("/lembretes", {
        medicamento: medicamento.trim(),
        horario,
        frequencia,
        dias_semana: diasSelecionados,
        data_unica: frequencia === "Uma vez" ? dataParaApi(dataSelecionada) : null,
        notificacao,
      });
      Alert.alert("Lembrete criado", "O lembrete foi salvo com sucesso.", [
        { text: "OK", onPress: onSalvar },
      ]);
    } catch (error: any) {
      Alert.alert("Não foi possível salvar", error?.response?.data?.message || "Confira a conexão com o servidor e tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.card}
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={onVoltar}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <ArrowLeft
              size={28}
              color={TEXT}
              strokeWidth={2.5}
            />
          </TouchableOpacity>

          <Text style={styles.tituloHeader}>
            Novo lembrete
          </Text>

          <View style={styles.espacoHeader} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.conteudo}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>
            Medicamento
          </Text>

          <TextInput
            style={styles.campo}
            placeholder="Digite o nome do medicamento"
            placeholderTextColor={colors.textSecondary}
            value={medicamento}
            onChangeText={setMedicamento}
            autoCapitalize="words"
            accessibilityLabel="Nome do medicamento"
          />

          <Text style={styles.label}>
            Horário
          </Text>

          <TouchableOpacity
            style={styles.campo}
            onPress={selecionarHorario}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={
              horario
                ? `Horário selecionado: ${horario}`
                : "Selecionar horário"
            }
          >
            <Text
              style={
                horario
                  ? styles.horarioSelecionado
                  : styles.horario
              }
            >
              {horario || "-- : --"}
            </Text>

            <Clock
              size={26}
              color={GREEN}
              strokeWidth={2}
            />
          </TouchableOpacity>

          {mostrarHorario && (
            <DateTimePicker
              value={obterDataHorario()}
              mode="time"
              is24Hour={true}
              display={
                Platform.OS === "ios"
                  ? "spinner"
                  : "default"
              }
              onChange={alterarHorario}
            />
          )}

          <Text style={styles.label}>
            Frequência
          </Text>

          <TouchableOpacity
            style={styles.campo}
            onPress={() =>
              setMostrarFrequencia(true)
            }
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Selecionar frequência"
          >
            <Text
              style={
                frequencia
                  ? styles.valor
                  : styles.placeholder
              }
            >
              {frequencia ||
                "Selecione a frequência"}
            </Text>

            {frequencia ? (
              <Check
                size={25}
                color={GREEN}
                strokeWidth={2.5}
              />
            ) : (
              <ChevronRight
                size={25}
                color={TEXT}
                strokeWidth={2}
              />
            )}
          </TouchableOpacity>

          {frequencia === "Dias específicos" && (
            <View style={styles.diasContainer}>
              <Text style={styles.subtitulo}>
                Selecione os dias
              </Text>

              <View style={styles.diasSemana}>
                {diasSemana.map(
                  (dia, index) => {
                    const selecionado =
                      diasSelecionados.includes(
                        index
                      );

                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dia,
                          selecionado &&
                            styles.diaSelecionado,
                        ]}
                        onPress={() =>
                          alternarDia(index)
                        }
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel={`Dia ${dia}`}
                        accessibilityState={{
                          selected: selecionado,
                        }}
                      >
                        <Text
                          style={
                            selecionado
                              ? styles.textoDiaSelecionado
                              : styles.textoDia
                          }
                        >
                          {dia}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.botaoConfirmar,
                  diasSelecionados.length === 0 &&
                    styles.botaoConfirmarDesabilitado,
                ]}
                disabled={
                  diasSelecionados.length === 0
                }
                onPress={() => {
                  setFrequencia(
                    "Dias específicos"
                  );
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.textoConfirmar}>
                  Confirmar
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {frequencia === "Uma vez" && (
            <>
              <Text style={styles.label}>
                Data
              </Text>

              <TouchableOpacity
                style={styles.campo}
                onPress={selecionarData}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={
                  data
                    ? `Data selecionada: ${data}`
                    : "Selecionar data"
                }
              >
                <Text
                  style={
                    data
                      ? styles.valor
                      : styles.placeholder
                  }
                >
                  {data || "Selecione a data"}
                </Text>

                <Calendar
                  size={26}
                  color={GREEN}
                  strokeWidth={2}
                />
              </TouchableOpacity>

              {mostrarData && (
                <DateTimePicker
                  value={
                    dataSelecionada ||
                    new Date()
                  }
                  mode="date"
                  display={
                    Platform.OS === "ios"
                      ? "spinner"
                      : "default"
                  }
                  minimumDate={new Date()}
                  onChange={alterarData}
                />
              )}
            </>
          )}

          <Text style={styles.label}>
            Notificação
          </Text>

          <View style={styles.notificacaoContainer}>
            <Text style={styles.notificacaoTexto}>
              Receber lembrete
            </Text>

            <Switch
              value={notificacao}
              onValueChange={setNotificacao}
              trackColor={{
                false: colors.switchTrack,
                true: colors.switchTrackActive,
              }}
              thumbColor={
                notificacao
                  ? GREEN
                  : colors.card
              }
              accessibilityLabel="Receber lembrete"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.botaoSalvar,
              formularioValido
                ? styles.botaoAtivo
                : styles.botaoDesabilitado,
            ]}
            onPress={salvarLembrete}
            disabled={!formularioValido || salvando}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Salvar lembrete"
            accessibilityState={{
              disabled: !formularioValido || salvando,
            }}
          >
            {salvando ? <ActivityIndicator color={colors.card} /> : (
              <Text style={styles.textoSalvar}>Salvar lembrete</Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        <Modal
          visible={mostrarFrequencia}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setMostrarFrequencia(false)
          }
        >
          <View style={styles.modalFundo}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitulo}>
                Frequência
              </Text>

              <TouchableOpacity
                style={styles.opcaoFrequencia}
                onPress={() =>
                  selecionarFrequencia(
                    "Todos os dias"
                  )
                }
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.radio,
                    frequencia ===
                      "Todos os dias" &&
                      styles.radioSelecionado,
                  ]}
                >
                  {frequencia ===
                    "Todos os dias" && (
                    <View
                      style={
                        styles.radioInterno
                      }
                    />
                  )}
                </View>

                <Text style={styles.textoOpcao}>
                  Todos os dias
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.opcaoFrequencia}
                onPress={() =>
                  selecionarFrequencia(
                    "Dias específicos"
                  )
                }
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.radio,
                    frequencia ===
                      "Dias específicos" &&
                      styles.radioSelecionado,
                  ]}
                >
                  {frequencia ===
                    "Dias específicos" && (
                    <View
                      style={
                        styles.radioInterno
                      }
                    />
                  )}
                </View>

                <Text style={styles.textoOpcao}>
                  Dias específicos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.opcaoFrequencia}
                onPress={() =>
                  selecionarFrequencia(
                    "Uma vez"
                  )
                }
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.radio,
                    frequencia === "Uma vez" &&
                      styles.radioSelecionado,
                  ]}
                >
                  {frequencia === "Uma vez" && (
                    <View
                      style={
                        styles.radioInterno
                      }
                    />
                  )}
                </View>

                <Text style={styles.textoOpcao}>
                  Uma vez
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoModalConfirmar}
                onPress={() =>
                  setMostrarFrequencia(false)
                }
                activeOpacity={0.8}
              >
                <Text
                  style={
                    styles.textoModalConfirmar
                  }
                >
                  Confirmar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={() =>
                  setMostrarFrequencia(false)
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.card,
  },

  container: {
    flex: 1,
    backgroundColor: colors.card,
  },

  header: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  botaoVoltar: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },

  tituloHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: typography.size.xl,
    lineHeight: typography.size.xl + 8,
    fontWeight: "700",
    color: TEXT,
  },

  espacoHeader: {
    width: 48,
  },

  scroll: {
    flex: 1,
  },

  conteudo: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing["3xl"],
  },

  label: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md + 6,
    fontWeight: "600",
    color: TEXT,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },

  campo: {
    width: "100%",
    minHeight: 62,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
  },

  placeholder: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md + 6,
    color: colors.textSecondary,
    flex: 1,
  },

  valor: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md + 6,
    color: TEXT,
    flex: 1,
  },

  horario: {
    flex: 1,
    textAlign: "center",
    fontSize: typography.size.lg,
    lineHeight: typography.size.lg + 6,
    color: colors.textSecondary,
    marginLeft: spacing.lg,
  },

  horarioSelecionado: {
    flex: 1,
    textAlign: "center",
    fontSize: typography.size.lg,
    lineHeight: typography.size.lg + 6,
    color: TEXT,
    marginLeft: spacing.lg,
  },

  diasContainer: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
  },

  subtitulo: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md + 6,
    fontWeight: "600",
    color: TEXT,
    marginBottom: spacing.md,
  },

  diasSemana: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dia: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.card,
  },

  diaSelecionado: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },

  textoDia: {
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm + 5,
    fontWeight: "600",
    color: TEXT,
  },

  textoDiaSelecionado: {
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm + 5,
    fontWeight: "700",
    color: colors.card,
  },

  botaoConfirmar: {
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
  },

  botaoConfirmarDesabilitado: {
    backgroundColor: colors.border,
  },

  textoConfirmar: {
    color: colors.card,
    fontSize: typography.size.md,
    lineHeight: typography.size.md + 6,
    fontWeight: "700",
  },

  notificacaoContainer: {
    width: "100%",
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  notificacaoTexto: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md + 6,
    color: TEXT,
  },

  botaoSalvar: {
    width: "100%",
    minHeight: 58,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing["2xl"],
  },

  botaoDesabilitado: {
    backgroundColor: colors.border,
  },

  botaoAtivo: {
    backgroundColor: GREEN,
  },

  textoSalvar: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md + 6,
    fontWeight: "700",
    color: colors.card,
  },

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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
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
    fontSize: typography.size.xl,
    lineHeight: typography.size.xl + 8,
    fontWeight: "700",
    color: TEXT,
    marginBottom: spacing.sm,
  },

  opcaoFrequencia: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },

  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },

  radioSelecionado: {
    borderColor: GREEN,
  },

  radioInterno: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: GREEN,
  },

  textoOpcao: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md + 6,
    color: TEXT,
  },

  botaoModalConfirmar: {
    minHeight: 50,
    backgroundColor: GREEN,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.md,
  },

  textoModalConfirmar: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md + 6,
    fontWeight: "700",
    color: colors.card,
  },

  botaoCancelar: {
    minHeight: 46,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xs,
  },

  textoCancelar: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md + 6,
    fontWeight: "600",
    color: colors.textSecondary,
  },
});
