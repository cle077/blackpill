
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import colors from "../../theme/colors";
import spacing from "../../theme/spacing";
import typography from "../../theme/typography";
import radius from "../../theme/radius";

import api from "../../services/api";

function calcularIdade(dataNascimentoIso) {
  const nascimento = new Date(dataNascimentoIso);
  const hoje = new Date();

  let idade =
    hoje.getFullYear() -
    nascimento.getFullYear();

  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (
      hoje.getMonth() === nascimento.getMonth() &&
      hoje.getDate() < nascimento.getDate()
    );

  if (aindaNaoFezAniversario) {
    idade -= 1;
  }

  return idade;
}

function isoParaBr(dataIso) {
  const [y, m, d] = dataIso
    .slice(0, 10)
    .split("-");

  return `${d}/${m}/${y}`;
}

export default function PerfilScreen({
  onAbrirFicha,
  onAbrirLembretes,
  onAbrirHistorico,
  onAbrirAjuda,
  onAbrirSobre,
  onSair,
}) {
  const [loading, setLoading] = useState(true);

  const [perfil, setPerfil] = useState({
    nome: "",
    email: "",
    idade: null,
    dataNascimento: "",
  });

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    setLoading(true);

    try {
      const [respUsuario, respFicha] =
        await Promise.allSettled([
          api.get("/api/auth/me"),
          api.get("/api/ficha"),
        ]);

      const nome =
        respUsuario.status === "fulfilled"
          ? respUsuario.value.data.nome
          : "";

      const email =
        respUsuario.status === "fulfilled"
          ? respUsuario.value.data.email
          : "";

      const dataNascimentoIso =
        respFicha.status === "fulfilled"
          ? respFicha.value.data.data_nascimento
          : null;

      const idade = dataNascimentoIso
        ? calcularIdade(dataNascimentoIso)
        : null;

      const dataNascimento = dataNascimentoIso
        ? isoParaBr(dataNascimentoIso)
        : "";

      setPerfil({
        nome,
        email,
        idade,
        dataNascimento,
      });
    } finally {
      setLoading(false);
    }
  }

  const menu = [
    {
      title: "Ficha médica",
      subtitle: "Consulte seus dados de saúde",
      icon: "medkit-outline",
      onPress: onAbrirFicha,
    },
    {
      title: "Meus Lembretes",
      subtitle:
        "Gerencie seus lembretes e notificações",
      icon: "notifications-outline",
      onPress: onAbrirLembretes,
    },
    {
      title: "Histórico de tratamento",
      subtitle:
        "Veja seus tratamentos anteriores",
      icon: "arrow-undo-outline",
      onPress: onAbrirHistorico,
    },
    {
      title: "Ajuda e suporte",
      subtitle:
        "Dúvidas frequentes e suporte",
      icon: "help-circle-outline",
      onPress: onAbrirAjuda,
    },
    {
      title: "Sobre o aplicativo",
      subtitle: "Versão 0.0.7",
      icon: "information-circle-outline",
      onPress: onAbrirSobre,
    },
  ];

  return (
    <View style={styles.container}>

      {/* CABEÇALHO */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Perfil
        </Text>
      </View>

      {/* CONTEÚDO */}

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* CARD DO PERFIL */}

        <View style={styles.profileCard}>

          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={30}
              color={colors.text}
            />
          </View>

          <View style={styles.profileInfo}>

            {loading ? (
              <ActivityIndicator
                color={colors.primary}
              />
            ) : (
              <>
                <Text style={styles.name}>
                  {perfil.nome.toUpperCase() || "—"}
                </Text>

                <Text style={styles.email}>
                  {perfil.email || "—"}
                </Text>

                <Text style={styles.age}>
                  {perfil.idade !== null
                    ? `${perfil.idade} anos${
                        perfil.dataNascimento
                          ? ` • ${perfil.dataNascimento}`
                          : ""
                      }`
                    : "Data de nascimento não informada"}
                </Text>
              </>
            )}

          </View>

        </View>

        {/* MENU */}

        <View style={styles.card}>

          {menu.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              activeOpacity={0.7}
              onPress={item.onPress}
              style={[
                styles.item,
                index !== menu.length - 1 &&
                  styles.itemBorder,
              ]}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              accessibilityHint={item.subtitle}
            >

              <View style={styles.iconCircle}>
                <Ionicons
                  name={item.icon}
                  size={23}
                  color={colors.primary}
                />
              </View>

              <View style={styles.itemText}>

                <Text style={styles.itemTitle}>
                  {item.title}
                </Text>

                <Text style={styles.itemSubtitle}>
                  {item.subtitle}
                </Text>

              </View>

              <Ionicons
                name="chevron-forward"
                size={22}
                color={colors.textSecondary}
              />

            </TouchableOpacity>
          ))}

        </View>

        {/* SAIR */}

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={onSair}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
        >
          <Text style={styles.logoutText}>
            SAIR DA CONTA
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    height: 75,

    backgroundColor:
      colors.authBackground,

    justifyContent:
      "center",

    alignItems:
      "center",

    borderBottomWidth: 1,

    borderBottomColor:
      colors.border,

    paddingHorizontal:
      spacing.lg,

    shadowColor:
      colors.text,

    shadowOpacity:
      0.08,

    shadowRadius:
      5,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  headerTitle: {
    color:
      colors.text,

    fontSize:
      typography.size.xl,

    lineHeight:
      typography.size.xl + 8,

    fontWeight:
      "800",

    textAlign:
      "center",
  },

  /* SCROLL */

  screen: {
    flex: 1,
  },

  content: {
    paddingHorizontal:
      spacing.lg,

    paddingTop:
      spacing.xl,

    paddingBottom:
      spacing["3xl"],
  },

  /* CARD DO PERFIL */

  profileCard: {
    backgroundColor:
      colors.card,

    borderRadius:
      radius.lg,

    padding:
      spacing.lg,

    flexDirection:
      "row",

    alignItems:
      "center",

    marginBottom:
      spacing.md,

    shadowColor:
      colors.text,

    shadowOpacity:
      0.05,

    shadowRadius:
      6,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 1,
  },

  avatar: {
    width: 64,
    height: 64,

    borderRadius: 32,

    backgroundColor:
      colors.primaryLight,

    alignItems:
      "center",

    justifyContent:
      "center",

    marginRight:
      spacing.md,
  },

  profileInfo: {
    flex: 1,
  },

  name: {
    fontSize:
      typography.size.md,

    lineHeight:
      typography.size.md + 6,

    fontWeight:
      "700",

    color:
      colors.text,
  },

  email: {
    fontSize:
      typography.size.sm,

    lineHeight:
      typography.size.sm + 5,

    color:
      colors.textSecondary,

    marginTop:
      spacing.xs,
  },

  age: {
    fontSize:
      typography.size.sm,

    lineHeight:
      typography.size.sm + 5,

    color:
      colors.textSecondary,

    marginTop:
      spacing.xs,
  },

  /* MENU */

  card: {
    backgroundColor:
      colors.card,

    borderRadius:
      radius.lg,

    paddingHorizontal:
      spacing.lg,

    shadowColor:
      colors.text,

    shadowOpacity:
      0.05,

    shadowRadius:
      6,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 1,
  },

  item: {
    minHeight: 76,

    flexDirection:
      "row",

    alignItems:
      "center",

    paddingVertical:
      spacing.md,
  },

  itemBorder: {
    borderBottomWidth: 1,

    borderBottomColor:
      colors.border,
  },

  iconCircle: {
    width: 48,
    height: 48,

    borderRadius: 24,

    backgroundColor:
      colors.primaryLight,

    alignItems:
      "center",

    justifyContent:
      "center",

    marginRight:
      spacing.md,
  },

  itemText: {
    flex: 1,

    paddingRight:
      spacing.sm,
  },

  itemTitle: {
    fontSize:
      typography.size.md,

    lineHeight:
      typography.size.md + 6,

    fontWeight:
      "600",

    color:
      colors.text,
  },

  itemSubtitle: {
    fontSize:
      typography.size.sm,

    lineHeight:
      typography.size.sm + 5,

    color:
      colors.textSecondary,

    marginTop:
      spacing.xs,
  },

  /* SAIR */

  logoutButton: {
    marginTop:
      spacing.lg,

    minHeight: 50,

    paddingHorizontal:
      spacing.lg,

    borderRadius:
      radius.md,

    backgroundColor:
      colors.danger,

    alignItems:
      "center",

    justifyContent:
      "center",
  },

  logoutText: {
    fontSize:
      typography.size.sm,

    lineHeight:
      typography.size.sm + 5,

    fontWeight:
      "700",

    color:
      colors.card,
  },

});
