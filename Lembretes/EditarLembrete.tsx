import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  Modal,
  Platform,
  ActivityIndicator,
} from "react-native";
import api from "../../services/api";
import { dataParaApi, Lembrete } from "../../services/lembretes";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import typography from "../../theme/typography";
import radius from "../../theme/radius";

import {
  ArrowLeft,
  Clock,
  ChevronRight,
  Check,
  CalendarDays,
} from "lucide-react-native";

const GREEN = colors.reminder;
const TEXT = colors.reminderText;
const RED = colors.reminderDanger;

type Props = {
  lembrete: Lembrete;
  onVoltar?: () => void;
  onSalvar?: () => void;
  onExcluir?: () => void;
};

export default function EditarLembrete({
  lembrete,
  onVoltar,
  onSalvar,
  onExcluir,
}: Props) {
  const [medicamento, setMedicamento] = useState(lembrete.medicamento);

  const [horario, setHorario] =
    useState(lembrete.horario);

  const [horarioDate, setHorarioDate] =
    useState(() => {
      const date = new Date();

      const [hora, minuto] = lembrete.horario.split(":").map(Number);
      date.setHours(hora);
      date.setMinutes(minuto);
      date.setSeconds(0);
      date.setMilliseconds(0);

      return date;
    });

  const [mostrarHorario, setMostrarHorario] =
    useState(false);

  const [frequencia, setFrequencia] =
    useState(lembrete.frequencia);

  const [mostrarFrequencia, setMostrarFrequencia] =
    useState(false);

  const [diasSelecionados, setDiasSelecionados] =
    useState<number[]>(lembrete.dias_semana || []);

  const [data, setData] = useState(() => lembrete.data_unica ? lembrete.data_unica.split("-").reverse().join("/") : "");

  const [dataDate, setDataDate] =
    useState<Date | null>(() => lembrete.data_unica ? new Date(`${lembrete.data_unica}T12:00:00`) : null);

  const [mostrarData, setMostrarData] =
    useState(false);

  const [notificacao, setNotificacao] =
    useState(lembrete.notificacao);
  const [salvando, setSalvando] = useState(false);

  const opcoesFrequencia: Lembrete["frequencia"][] = [
    "Todos os dias",
    "Dias específicos",
    "Uma vez",
  ];

  const dias = [
    "S",
    "T",
    "Q",
    "Q",
    "S",
    "S",
    "D",
  ];

  function alterarHorario(
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) {
    setMostrarHorario(false);

    if (
      event.type === "dismissed" ||
      !selectedDate
    ) {
      return;
    }

    setHorarioDate(selectedDate);

    const horas = selectedDate
      .getHours()
      .toString()
      .padStart(2, "0");

    const minutos = selectedDate
      .getMinutes()
      .toString()
      .padStart(2, "0");

    setHorario(`${horas}:${minutos}`);
  }

  function selecionarFrequencia(
    opcao: Lembrete["frequencia"]
  ) {
    setFrequencia(opcao);
    setMostrarFrequencia(false);

    if (opcao === "Dias específicos") {
      setData("");
      setDataDate(null);
    }

    if (opcao === "Uma vez") {
      setDiasSelecionados([]);
    }

    if (opcao === "Todos os dias") {
      setDiasSelecionados([]);
      setData("");
      setDataDate(null);
    }
  }

  function alternarDia(index: number) {
    setDiasSelecionados((diasAtuais) => {
      if (diasAtuais.includes(index)) {
        return diasAtuais.filter(
          (dia) => dia !== index
        );
      }

      return [...diasAtuais, index];
    });
  }

  function alterarData(
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) {
    setMostrarData(false);

    if (
      event.type === "dismissed" ||
      !selectedDate
    ) {
      return;
    }

    setDataDate(selectedDate);

    const dia = selectedDate
      .getDate()
      .toString()
      .padStart(2, "0");

    const mes = (
      selectedDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0");

    const ano = selectedDate.getFullYear();

    setData(`${dia}/${mes}/${ano}`);
  }

  async function salvarAlteracoes() {
    if (!medicamento.trim()) {
      Alert.alert(
        "Atenção",
        "Digite o nome do medicamento."
      );

      return;
    }

    if (
      frequencia === "Dias específicos" &&
      diasSelecionados.length === 0
    ) {
      Alert.alert(
        "Atenção",
        "Selecione pelo menos um dia."
      );

      return;
    }

    if (
      frequencia === "Uma vez" &&
      !dataDate
    ) {
      Alert.alert(
        "Atenção",
        "Selecione uma data."
      );

      return;
    }

    setSalvando(true);
    try {
      await api.put(`/lembretes/${lembrete.id_lembrete}`, {
        medicamento: medicamento.trim(), horario, frequencia,
        dias_semana: diasSelecionados,
        data_unica: frequencia === "Uma vez" ? dataParaApi(dataDate) : null,
        notificacao,
      });
      Alert.alert("Lembrete atualizado", "As alterações foram salvas.", [
        { text: "OK", onPress: onSalvar },
      ]);
    } catch (error: any) {
      Alert.alert("Não foi possível salvar", error?.response?.data?.message || "Confira a conexão com o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  function excluirLembrete() {
    Alert.alert(
      "Excluir lembrete",
      "Tem certeza que deseja excluir este lembrete?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/lembretes/${lembrete.id_lembrete}`);
              onExcluir?.();
            } catch (error: any) {
              Alert.alert("Não foi possível excluir", error?.response?.data?.message || "Confira a conexão com o servidor.");
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={onVoltar}
            activeOpacity={0.7}
          >
            <ArrowLeft
              size={28}
              color={TEXT}
              strokeWidth={2.5}
            />
          </TouchableOpacity>

          <Text style={styles.tituloHeader}>
            Editar lembrete
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
            style={styles.campoTexto}
            value={medicamento}
            onChangeText={setMedicamento}
            placeholder="Digite o nome do medicamento"
            placeholderTextColor="#999999"
          />

          <Text style={styles.label}>
            Horário
          </Text>

          <TouchableOpacity
            style={styles.campo}
            onPress={() =>
              setMostrarHorario(true)
            }
            activeOpacity={0.7}
          >
            <Text style={styles.horario}>
              {horario}
            </Text>

            <Clock
              size={25}
              color={GREEN}
              strokeWidth={2}
            />
          </TouchableOpacity>

          {mostrarHorario && (
            <DateTimePicker
              value={horarioDate}
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
          >
            <Text style={styles.valor}>
              {frequencia}
            </Text>

            <ChevronRight
              size={25}
              color={GREEN}
              strokeWidth={2}
            />
          </TouchableOpacity>

          {frequencia ===
            "Dias específicos" && (
            <View style={styles.diasContainer}>
              <Text style={styles.subtitulo}>
                Selecione os dias
              </Text>

              <View style={styles.diasLinha}>
                {dias.map((dia, index) => {
                  const selecionado =
                    diasSelecionados.includes(
                      index
                    );

                  return (
                    <TouchableOpacity
                      key={`${dia}-${index}`}
                      style={[
                        styles.dia,
                        selecionado &&
                          styles.diaSelecionado,
                      ]}
                      onPress={() =>
                        alternarDia(index)
                      }
                      activeOpacity={0.7}
                    >
                      {selecionado ? (
                        <Check
                          size={18}
                          color="#FFFFFF"
                          strokeWidth={3}
                        />
                      ) : (
                        <Text
                          style={styles.textoDia}
                        >
                          {dia}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {frequencia === "Uma vez" && (
            <View>
              <Text style={styles.label}>
                Data
              </Text>

              <TouchableOpacity
                style={styles.campo}
                onPress={() =>
                  setMostrarData(true)
                }
                activeOpacity={0.7}
              >
                <Text
                  style={
                    data
                      ? styles.valor
                      : styles.placeholder
                  }
                >
                  {data ||
                    "Selecione a data"}
                </Text>

                <CalendarDays
                  size={23}
                  color={GREEN}
                  strokeWidth={2}
                />
              </TouchableOpacity>

              {mostrarData && (
                <DateTimePicker
                  value={
                    dataDate || new Date()
                  }
                  mode="date"
                  display={
                    Platform.OS === "ios"
                      ? "spinner"
                      : "default"
                  }
                  onChange={alterarData}
                />
              )}
            </View>
          )}

          <Text style={styles.label}>
            Notificação
          </Text>

          <View
            style={styles.notificacaoContainer}
          >
            <Text
              style={styles.notificacaoTexto}
            >
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
                  : "#FFFFFF"
              }
            />
          </View>

          <TouchableOpacity
            style={styles.botaoSalvar}
            onPress={salvarAlteracoes}
            disabled={salvando}
            activeOpacity={0.8}
          >
            {salvando ? <ActivityIndicator color="#FFFFFF" /> : (
              <Text style={styles.textoSalvar}>Salvar alterações</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoExcluir}
            onPress={excluirLembrete}
            activeOpacity={0.7}
          >
            <Text style={styles.textoExcluir}>
              Excluir lembrete
            </Text>
          </TouchableOpacity>

        </ScrollView>

        <Modal
          visible={mostrarFrequencia}
          transparent={true}
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

              {opcoesFrequencia.map(
                (opcao) => {
                  const selecionada =
                    frequencia === opcao;

                  return (
                    <TouchableOpacity
                      key={opcao}
                      style={
                        styles.opcaoFrequencia
                      }
                      onPress={() =>
                        selecionarFrequencia(
                          opcao
                        )
                      }
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.textoOpcao,
                          selecionada &&
                            styles.opcaoSelecionada,
                        ]}
                      >
                        {opcao}
                      </Text>

                      {selecionada && (
                        <Check
                          size={21}
                          color={GREEN}
                          strokeWidth={3}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }
              )}

              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={() =>
                  setMostrarFrequencia(false)
                }
                activeOpacity={0.7}
              >
                <Text
                  style={styles.textoCancelar}
                >
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
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    height: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 3,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },

  botaoVoltar: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  tituloHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: typography.size.xl,
    fontWeight: "700",
    color: colors.text,
  },

  espacoHeader: {
    width: 42,
  },

  scroll: {
    flex: 1,
  },

  conteudo: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing["4xl"],
  },

  label: {
    fontSize: typography.size.md,
    fontWeight: "600",
    color: TEXT,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  campoTexto: {
    width: "100%",
    height: 62,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.size.md,
    color: colors.text,
    backgroundColor: colors.card,
  },

  campo: {
    width: "100%",
    height: 62,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
  },

  horario: {
    flex: 1,
    textAlign: "center",
    fontSize: typography.size.lg,
    color: TEXT,
    marginLeft: spacing.xl,
  },

  valor: {
    flex: 1,
    fontSize: typography.size.md,
    color: TEXT,
  },

  placeholder: {
    flex: 1,
    fontSize: typography.size.md,
    color: "#555555",
  },

  diasContainer: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.border,
  },

  subtitulo: {
    fontSize: typography.size.md,
    color: TEXT,
    marginBottom: spacing.md,
  },

  diasLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dia: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    fontWeight: "600",
    color: TEXT,
  },

  notificacaoContainer: {
    width: "100%",
    minHeight: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xs,
  },

  notificacaoTexto: {
    fontSize: typography.size.md,
    color: TEXT,
  },

  botaoSalvar: {
    width: "100%",
    height: 58,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GREEN,
    marginTop: spacing.xl,
  },

  textoSalvar: {
    fontSize: typography.size.md,
    fontWeight: "700",
    color: colors.card,
  },

  botaoExcluir: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },

  textoExcluir: {
    fontSize: typography.size.md,
    fontWeight: "600",
    color: RED,
  },

  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
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
    fontSize: typography.size.xl,
    fontWeight: "700",
    color: TEXT,
    marginBottom: spacing.sm,
  },

  opcaoFrequencia: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  textoOpcao: {
    fontSize: typography.size.md,
    color: TEXT,
  },

  opcaoSelecionada: {
    color: GREEN,
    fontWeight: "700",
  },

  botaoCancelar: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xs,
  },

  textoCancelar: {
    fontSize: typography.size.md,
    fontWeight: "600",
    color: colors.textSecondary,
  },
});
