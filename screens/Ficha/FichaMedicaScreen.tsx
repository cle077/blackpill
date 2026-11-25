import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";

import PageHeader from "../../components/PageHeader";
import colors from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { radius } from "../../theme/radius";
import api from '../../services/api';




type Ficha = {
  nome: string;
  dataNascimento: string;
  sexo: string;
  peso: string;
  altura: string;
  condicoes: string;
  alergias: string;
  observacoes: string;
};

const EMPTY: Ficha = {
  nome: "",
  dataNascimento: "",
  sexo: "",
  peso: "",
  altura: "",
  condicoes: "",
  alergias: "",
  observacoes: "",
};

// ---------- conversões tela api ----------

const SEXO_PARA_API: Record<string, string> = {
  Masculino: "M",
  Feminino: "F",
  Outro: "O",
};
const SEXO_PARA_TELA: Record<string, string> = {
  M: "Masculino",
  F: "Feminino",
  O: "Outro",
};

function numeroDaString(valor: string): number {
  const limpo = valor.replace(/[^\d.,]/g, "").replace(",", ".");
  return parseFloat(limpo);
}

function brParaIso(dataBr: string): string {
  const [d, m, y] = dataBr.split("/");
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function isoParaBr(dataIso: string): string {
  
  const [y, m, d] = dataIso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;

}

function dataValida(data: string): boolean {
  const match = data.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;

  const [, diaStr, mesStr, anoStr] = match;
  const dia = Number(diaStr);
  const mes = Number(mesStr);
  const ano = Number(anoStr);

  if (mes < 1 || mes > 12) return false;

  const diasNoMes = new Date(ano, mes, 0).getDate();
  if (dia < 1 || dia > diasNoMes) return false;

  const dataInformada = new Date(ano, mes - 1, dia);
  if (dataInformada > new Date()) return false;

  return true;
}

function fichaParaPayload(f: Ficha) {
  return {
    altura: numeroDaString(f.altura),
    peso: numeroDaString(f.peso),
    sexo: SEXO_PARA_API[f.sexo] ?? f.sexo,
    data_nascimento: brParaIso(f.dataNascimento),
    alergias: f.alergias,
    obs: f.observacoes,
    cond_saude: f.condicoes,
  };
}

function payloadParaFicha(p: any, extras: Partial<Ficha> = {}): Ficha {
  return {
    nome: extras.nome ?? "",
    dataNascimento: isoParaBr(p.data_nascimento),
    sexo: SEXO_PARA_TELA[p.sexo] ?? p.sexo,
    peso: `${p.peso} Kg`,
    altura: `${String(p.altura).replace(".", ",")} m`,
    condicoes: p.cond_saude ?? "",
    alergias: p.alergias ?? "",
    observacoes: p.obs ?? "",
  };
}

// ---------- componente de campo  --------

type FieldProps = {
  label: string;
  value: string;
  editing: boolean;
  multiline?: boolean;
  onChangeText: (value: string) => void;
};

function Field({ label, value, editing, multiline, onChangeText }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {editing ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          style={[styles.input, multiline && styles.textArea]}
          placeholder={multiline ? "Digite aqui..." : ""}
          placeholderTextColor={colors.placeholder}
        />
      ) : (
        <>
          <Text style={styles.value} numberOfLines={multiline ? 2 : 1}>
            {value || "—"}
          </Text>
          <Text style={styles.chevron}>›</Text>
        </>
      )}
    </View>
  );
}

const SEXO_OPCOES = ["Masculino", "Feminino", "Outro"];

function SexoField({
  value,
  editing,
  onChange,
}: {
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  if (!editing) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>Sexo</Text>
        <Text style={styles.value}>{value || "—"}</Text>
        <Text style={styles.chevron}>›</Text>
      </View>
    );
  }

  return (
    <View style={styles.field}>
      <Text style={styles.label}>Sexo</Text>
      <TouchableOpacity style={styles.input} onPress={() => setOpen((o) => !o)}>
        <Text style={{ color: value ? colors.text : colors.placeholder }}>
          {value || "Selecione"}
        </Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          {SEXO_OPCOES.map((opcao) => (
            <TouchableOpacity
              key={opcao}
              style={styles.dropdownItem}
              onPress={() => {
                onChange(opcao);
                setOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{opcao}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}




type Props = {
  onVoltar: () => void;
};

export default function FichaMedicaScreen({ onVoltar }: Props) {
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [editing, setEditing] = useState(false);
  const [existeFicha, setExisteFicha] = useState(false);
  const [ficha, setFicha] = useState<Ficha>(EMPTY);
  const [draft, setDraft] = useState<Ficha>(EMPTY);

  useEffect(() => {
    carregarFicha();
  }, []);

async function carregarFicha() {
    setLoading(true);
    try {
      const [respUsuario, respFicha] = await Promise.allSettled([
        api.get("/api/auth/me"),
        api.get("/api/ficha"),
      ]);

      const nome =
        respUsuario.status === "fulfilled" ? respUsuario.value.data.nome : "";

      if (respFicha.status === "fulfilled") {
        setFicha(payloadParaFicha(respFicha.value.data, { nome }));
        setExisteFicha(true);
      } else if (respFicha.reason?.response?.status === 404) {
        // usuário ainda não tem ficha cadastrada, começa em branco (mas já com o nome)
        setFicha({ ...EMPTY, nome });
        setExisteFicha(false);
      } else {
        Alert.alert("Erro", "Não foi possível carregar a ficha médica.");
      }
    } finally {
      setLoading(false);
    }
}

  function update(key: keyof Ficha, value: string) {
    setDraft((old) => ({
      ...old,
      [key]: value,
    }));
  }

async function toggleEditing() {
    if (!editing) {
      setDraft(ficha);
      setEditing(true);
      return;
    }

    if (!dataValida(draft.dataNascimento)) {
      Alert.alert("Data inválida", "Informe a data de nascimento no formato dd/mm/aaaa.");
      return;
    }

    setSalvando(true);
    try {
      const payload = fichaParaPayload(draft);
      const metodo = existeFicha ? "put" : "post";
      await api[metodo]("/api/ficha", payload);

      setFicha(draft);
      setExisteFicha(true);
      setEditing(false);
    } catch (error: any) {
      const mensagem =
        error.response?.data?.message || "Não foi possível salvar a ficha médica.";
      Alert.alert("Erro ao salvar", mensagem);
    } finally {
      setSalvando(false);
    }
}

// ------------------ tela real ------------------------

if (loading) {
    return (
      <View style={styles.container}>
        <PageHeader title="Ficha médica" onBack={onVoltar} />
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <PageHeader
        title="Ficha médica"
        onBack={onVoltar}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Field
            label="Nome"
            value={editing ? draft.nome : ficha.nome}
            editing={editing}
            onChangeText={(value) => update("nome", value)}
          />

          <Field
            label="Data de nascimento"
            value={
              editing
                ? draft.dataNascimento
                : ficha.dataNascimento
            }
            editing={editing}
            onChangeText={(value) =>
              update("dataNascimento", value)
            }
          />

          <SexoField
            value={editing ? draft.sexo : ficha.sexo}
            editing={editing}
            onChange={(value) => update("sexo", value)}
          />

          <Field
            label="Peso"
            value={editing ? draft.peso : ficha.peso}
            editing={editing}
            onChangeText={(value) => update("peso", value)}
          />

          <Field
            label="Altura"
            value={editing ? draft.altura : ficha.altura}
            editing={editing}
            onChangeText={(value) => update("altura", value.replace(",", "."))}
          />
        </View>

        <View style={styles.card}>
          <Field
            label="Condições de saúde"
            value={
              editing
                ? draft.condicoes
                : ficha.condicoes
            }
            editing={editing}
            multiline
            onChangeText={(value) =>
              update("condicoes", value)
            }
          />

          <Field
            label="Alergias"
            value={
              editing
                ? draft.alergias
                : ficha.alergias
            }
            editing={editing}
            multiline
            onChangeText={(value) =>
              update("alergias", value)
            }
          />

          <Field
            label="Observações"
            value={
              editing
                ? draft.observacoes
                : ficha.observacoes
            }
            editing={editing}
            multiline
            onChangeText={(value) =>
              update("observacoes", value)
            }
          />
        </View>

        <View style={styles.actions}>
          {editing && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setDraft(ficha);
                setEditing(false);
              }}
            >
              <Text style={styles.cancelText}>
                Cancelar
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={toggleEditing}
            disabled={salvando}>
          
            <Text style={styles.saveText}>
              {salvando 
              ? "Salvando..." 
              : editing 
              ? "Salvar informações" 
              : "Editar informações"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    overflow: "hidden",
  },

  field: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  label: {
    width: 135,
    fontSize: typography.size.sm,
    fontWeight: "600",
    color: colors.text,
  },

  value: {
    flex: 1,
    paddingRight: 15,
    textAlign: "right",
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },

  chevron: {
    position: "absolute",
    right: 0,
    fontSize: 24,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  input: {
    flex: 1,
    minHeight: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 9,
    fontSize: 13,
    color: colors.text,
    textAlign: "right",
  },

  textArea: {
    minHeight: 74,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    textAlign: "left",
    textAlignVertical: "top",
  },

  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },

  cancelButton: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  saveButton: {
    flex: 1,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  saveText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.card,
  },

  dropdown: {
  marginTop: spacing.xs,
  borderRadius: radius.sm,
  backgroundColor: colors.card,
  overflow: "hidden",
  },
dropdownItem: {
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  },
dropdownItemText: {
  fontSize: typography.size.sm,
  color: colors.text,
},
});
