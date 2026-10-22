import React, { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import api from "../../services/api";

import colors from "../../theme/colors";
import radius from "../../theme/radius";
import spacing from "../../theme/spacing";

import ScreenHeader from "../../components/ScreenHeader";
import MedicationSummary from "../../components/MedicationSummary";
import NoteCard from "../../components/NoteCard";
import PrimaryButton from "../../components/PrimaryButton";

export default function BulaScreen({
  medicamento,
  onVoltar,
  onAdicionarCronograma,
}) {
  const [bula, setBula] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [secoesAbertas, setSecoesAbertas] = useState({});

  const carregarBula = useCallback(async () => {
    const id = medicamento?.cd_remedio;

    if (!id) {
      setBula(null);
      setErro("Não foi possível identificar o medicamento.");
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const response = await api.get(
        `/api/remedios/${id}/bula`
      );

      // Aceita a resposta direta da API ou uma resposta envelopada.
      const dados =
        response.data?.bula ||
        response.data?.data ||
        response.data;

      if (!dados || typeof dados !== "object") {
        setBula(null);
        setErro("A resposta do servidor não contém os dados da bula.");
        return;
      }

      console.log("Dados recebidos da bula:", dados);

      setBula(dados);
    } catch (error) {
      console.error(
        "Erro ao carregar a bula:",
        error.response?.data || error.message
      );

      setBula(null);

      setErro(
        error.response?.data?.message ||
          "Não foi possível carregar a bula deste medicamento."
      );
    } finally {
      setCarregando(false);
    }
  }, [medicamento?.cd_remedio]);

  useEffect(() => {
    setSecoesAbertas({});
    carregarBula();
  }, [carregarBula]);

  const alternarSecao = (chave) => {
    setSecoesAbertas((anterior) => ({
      ...anterior,
      [chave]: !anterior[chave],
    }));
  };

  const nomeMedicamento =
    medicamento?.nome || "Medicamento";

  const concentracao = medicamento?.concentracao
    ? ` ${medicamento.concentracao}`
    : "";

  const formaFarmaceutica =
    bula?.forma_farmaceutica ||
    medicamento?.forma_farmaceutica ||
    medicamento?.forma ||
    "Não informada";

  const secoes = [
    {
      chave: "indicacao",
      titulo: "Indicações",
      conteudo: bula?.indicacao,
    },
    {
      chave: "contIndicacao",
      titulo: "Informações complementares",
      conteudo: bula?.cont_indicacao,
    },
    {
      chave: "composicao",
      titulo: "Composição",
      conteudo: bula?.composicao,
    },
    {
      chave: "posologia",
      titulo: "Como usar (Posologia)",
      conteudo: bula?.posologia,
    },
    {
      chave: "reacaoAdversa",
      titulo: "Reações adversas",
      conteudo: bula?.reacao_adversa,
    },
    {
      chave: "advertencia",
      titulo: "Advertências e cuidados",
      conteudo: bula?.advertencia,
    },
    {
      chave: "superdose",
      titulo: "Superdose",
      conteudo: bula?.superdose,
    },
    {
      chave: "interacoes",
      titulo: "Interações medicamentosas",
      conteudo: bula?.intera_medi,
    },
    {
      chave: "numeroBula",
      titulo: "Número da bula vigente",
      conteudo: bula?.numb_exp_bula_vigen,
    },
    {
      chave: "bulaResumida",
      titulo: "Bula resumida",
      conteudo: bula?.bula_resumida,
    },
  ];

  if (carregando) {
    return (
      <View style={styles.screen}>
        <ScreenHeader
          title="Bula do medicamento"
          onBack={onVoltar}
        />

        <View style={styles.estadoContainer}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.estadoTexto}>
            Carregando bula...
          </Text>
        </View>
      </View>
    );
  }

  if (erro || !bula) {
    return (
      <View style={styles.screen}>
        <ScreenHeader
          title="Bula do medicamento"
          onBack={onVoltar}
        />

        <View style={styles.estadoContainer}>
          <Text style={styles.erroTitulo}>
            Bula indisponível
          </Text>

          <Text style={styles.estadoTexto}>
            {erro ||
              "Não há uma bula cadastrada para este medicamento."}
          </Text>

          <View style={styles.botaoErro}>
            <PrimaryButton
              label="Tentar novamente"
              onPress={carregarBula}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Bula do medicamento"
        onBack={onVoltar}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topCard}>
          <MedicationSummary
            name={`${nomeMedicamento}${concentracao}`}
            form={formaFarmaceutica}
          />
        </View>

        <Text style={styles.intro}>
          Consulte as informações disponíveis na bula deste
          medicamento. Em caso de dúvidas, procure um
          profissional de saúde.
        </Text>

        <View style={styles.secoes}>
          {secoes.map((secao) => {
            const aberta = !!secoesAbertas[secao.chave];

            const conteudo =
              typeof secao.conteudo === "string"
                ? secao.conteudo.trim()
                : secao.conteudo != null
                  ? String(secao.conteudo).trim()
                  : "";

            return (
              <View
                key={secao.chave}
                style={styles.accordion}
              >
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => alternarSecao(secao.chave)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: aberta }}
                >
                  <Text style={styles.tituloSecao}>
                    {secao.titulo}
                  </Text>

                  <Text style={styles.seta}>
                    {aberta ? "−" : "+"}
                  </Text>
                </TouchableOpacity>

                {aberta && (
                  <View style={styles.accordionContent}>
                    <Text style={styles.textoSecao}>
                      {conteudo ||
                        "Esta informação não está disponível no cadastro da bula."}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.noteWrap}>
          <NoteCard
            title="Importante"
            text="Consulte a bula e siga as orientações do profissional de saúde. Não altere nem interrompa seu tratamento por conta própria."
          />
        </View>

        {onAdicionarCronograma && (
          <View style={styles.actions}>
            <PrimaryButton
              label="Adicionar ao cronograma"
              onPress={() =>
                onAdicionarCronograma(medicamento)
              }
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },

  topCard: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },

  intro: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: spacing.md,
  },

  secoes: {
    gap: spacing.sm,
  },

  accordion: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D9E2E8",
  },

  accordionHeader: {
    minHeight: 60,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  tituloSecao: {
    flex: 1,
    paddingRight: spacing.sm,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: colors.text,
  },

  seta: {
    fontSize: 28,
    fontWeight: "400",
    color: colors.primary,
  },

  accordionContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#D9E2E8",
  },

  textoSecao: {
    fontSize: 16,
    lineHeight: 25,
    color: colors.text,
  },

  noteWrap: {
    marginTop: spacing.lg,
  },

  actions: {
    marginTop: spacing.lg,
  },

  estadoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },

  estadoTexto: {
    marginTop: spacing.md,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    textAlign: "center",
  },

  erroTitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },

  botaoErro: {
    width: "100%",
    marginTop: spacing.lg,
  },
});
