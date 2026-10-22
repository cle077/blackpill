
import React, { useState } from "react";

import Splash from "./screens/Splash/Splash";

import LoginScreen from "./screens/Auth/LoginScreen";
import CadastroScreen from "./screens/Auth/CadastroScreen";
import RecSenhaScreen from "./screens/Auth/RecSenhaScreen";

import HomeScreen from "./screens/Home/HomeScreen";
import MedicamentosScreen from "./screens/Medicamentos/MedicamentosScreen";
import AdicionarMedicamentoScreen from "./screens/Medicamentos/AdicionarMedicamentoScreen";
import DetalhesMedicamentoScreen from "./screens/Medicamentos/DetalhesMedicamentoScreen";
import BulaScreen from "./screens/Medicamentos/BulaScreen";

import BottomNavBar from "./components/BottomNavBar";

import AgendaScreen from "./screens/Agenda/AgendaScreen";
import Calendar from "./screens/Agenda/CalendarScreen";

import PerfilScreen from "./screens/Perfil/PerfilScreen";
import FichaMedicaScreen from "./screens/Ficha/FichaMedicaScreen";
import HistoricoScreen from "./screens/Historico/HistoricoScreen";

import Lembretes from "./screens/Lembretes/Lembretes";
import NovoLembrete from "./screens/Lembretes/NovoLembrete";
import Notificacoes from "./screens/Notificacoes/Notificacoes";
import EditarLembrete from "./screens/Lembretes/EditarLembrete";

import ConfiguracoesScreen from "./screens/Config/ConfiguracoesScreen";
import PrivacidadeScreen from "./screens/Termos/PrivacidadeScreen";
import SobreAppScreen from "./screens/Comunicacao/SobreAppScreen";
import TermosDeUsoScreen from "./screens/Termos/TermosDeUsoScreen";
import PerguntasFrequentesScreen from "./screens/Comunicacao/PerguntasFrequentesScreen";
import FaleConoscoScreen from "./screens/Comunicacao/FaleConoscoScreen";
import RelatarProblemaScreen from "./screens/Comunicacao/RelatarProblemaScreen";

import {
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";

import colors from "./theme/colors";
import radius from "./theme/radius";
import spacing from "./theme/spacing";
import typography from "./theme/typography";

const { width, height } = Dimensions.get("window");

const telas = [
  require("./assets/onboarding/onboarding1/onboarding1.png"),
  require("./assets/onboarding/onboarding2/onboarding2.png"),
  require("./assets/onboarding/onboarding3/onboarding3.png"),
];

export default function App() {
  const [splash, setSplash] = useState(true);

  const [telaAtual, setTelaAtual] = useState(0);
  const [onboardingFinalizado, setOnboardingFinalizado] =
    useState(false);

  const [telaLogin, setTelaLogin] = useState(false);
  const [telaCadastro, setTelaCadastro] = useState(false);
  const [telaRecSenha, setTelaRecSenha] = useState(false);

  const [abaAtual, setAbaAtual] = useState("inicio");

  const [telaAdicionarMedicamento, setTelaAdicionarMedicamento] =
    useState(false);

  const [medicamentoSelecionado, setMedicamentoSelecionado] =
    useState(null);

  const [telaDetalhesMedicamento, setTelaDetalhesMedicamento] =
    useState(false);

  const [telaBula, setTelaBula] = useState(false);

  const [telaLembretes, setTelaLembretes] = useState(false);
  const [telaNovoLembrete, setTelaNovoLembrete] = useState(false);
  const [telaNotificacoes, setTelaNotificacoes] = useState(false);
  const [telaEditarLembrete, setTelaEditarLembrete] = useState(false);
  const [lembreteEmEdicao, setLembreteEmEdicao] = useState(null);
  const [origemNotificacoes, setOrigemNotificacoes] = useState("home");
  const [origemCalendario, setOrigemCalendario] = useState("agenda");
  const [origemSobreApp, setOrigemSobreApp] = useState("config");

  const [telaConfiguracoes, setTelaConfiguracoes] = useState(false);
  const [telaPrivacidade, setTelaPrivacidade] = useState(false);
  const [telaSobreApp, setTelaSobreApp] = useState(false);
  const [telaTermos, setTelaTermos] = useState(false);
  const [telaPerguntas, setTelaPerguntas] = useState(false);
  const [telaFaleConosco, setTelaFaleConosco] = useState(false);
  const [telaRelatarProblema, setTelaRelatarProblema] =
    useState(false);

  const [origemTermos, setOrigemTermos] = useState("config");
  const [origemPrivacidade, setOrigemPrivacidade] = useState("config");
  const [origemPerguntas, setOrigemPerguntas] = useState("config");
  const [origemFaleConosco, setOrigemFaleConosco] =
    useState("config");
  const [origemRelatarProblema, setOrigemRelatarProblema] =
    useState("config");

  const [telaFichaMedica, setTelaFichaMedica] = useState(false);
  const [telaHistorico, setTelaHistorico] = useState(false);
  const [telaCalendario, setTelaCalendario] = useState(false);

  // Splash
  if (splash) {
    return <Splash onFinish={() => setSplash(false)} />;
  }

  // Login
  if (telaLogin) {
    return (
      <LoginScreen
        onAbrirCadastro={() => {
          setTelaLogin(false);
          setTelaCadastro(true);
        }}
        onAbrirRecuperacao={() => {
          setTelaLogin(false);
          setTelaRecSenha(true);
        }}
        onEntrar={() => {
          setTelaLogin(false);
          setAbaAtual("inicio");
          setOnboardingFinalizado(true);
        }}
      />
    );
  }

  // Cadastro
  if (telaCadastro) {
    return (
      <CadastroScreen
        onVoltarLogin={() => {
          setTelaCadastro(false);
          setTelaLogin(true);
        }}
        onCadastrar={() => {
          setTelaCadastro(false);
          setTelaLogin(true);
        }}
        onAbrirTermos={() => {
          setTelaCadastro(false);
          setOrigemTermos("cadastro");
          setTelaTermos(true);
        }}
        onAbrirPrivacidade={() => {
          setTelaCadastro(false);
          setOrigemPrivacidade("cadastro");
          setTelaPrivacidade(true);
        }}
      />
    );
  }

  // Recuperação de senha
  if (telaRecSenha) {
    return (
      <RecSenhaScreen
        onVoltarLogin={() => {
          setTelaRecSenha(false);
          setTelaLogin(true);
        }}
      />
    );
  }

  // Privacidade
  if (telaPrivacidade) {
    return (
      <PrivacidadeScreen
        onVoltar={() => {
          setTelaPrivacidade(false);

          if (origemPrivacidade === "cadastro") {
            setTelaCadastro(true);
          }

          if (origemPrivacidade === "config") {
            setTelaConfiguracoes(true);
          }
        }}
      />
    );
  }

  // Sobre o aplicativo
  if (telaSobreApp) {
    return (
      <SobreAppScreen
        onVoltar={() => {
          setTelaSobreApp(false);

          if (origemSobreApp === "config") {
            setTelaConfiguracoes(true);
          }

          if (origemSobreApp === "perfil") {
            setAbaAtual("perfil");
          }
        }}
      />
    );
  }

  // Termos de uso
  if (telaTermos) {
    return (
      <TermosDeUsoScreen
        onVoltar={() => {
          setTelaTermos(false);

          if (origemTermos === "cadastro") {
            setTelaCadastro(true);
          }

          if (origemTermos === "config") {
            setTelaConfiguracoes(true);
          }
        }}
      />
    );
  }

  // Perguntas frequentes
  if (telaPerguntas) {
    return (
      <PerguntasFrequentesScreen
        onVoltar={() => {
          setTelaPerguntas(false);

          if (origemPerguntas === "config") {
            setTelaConfiguracoes(true);
          }

          if (origemPerguntas === "perfil") {
            setAbaAtual("perfil");
          }
        }}
        onAbrirRelatarProblema={() => {
          setTelaPerguntas(false);
          setOrigemRelatarProblema("perguntas");
          setTelaRelatarProblema(true);
        }}
      />
    );
  }

  // Fale conosco
  if (telaFaleConosco) {
    return (
      <FaleConoscoScreen
        onVoltar={() => {
          setTelaFaleConosco(false);

          if (origemFaleConosco === "config") {
            setTelaConfiguracoes(true);
          }

          if (origemFaleConosco === "perfil") {
            setAbaAtual("perfil");
          }
        }}
      />
    );
  }

  // Relatar problema
  if (telaRelatarProblema) {
    return (
      <RelatarProblemaScreen
        onVoltar={() => {
          setTelaRelatarProblema(false);

          if (origemRelatarProblema === "config") {
            setTelaConfiguracoes(true);
          }

          if (origemRelatarProblema === "perguntas") {
            setTelaPerguntas(true);
          }

          if (origemRelatarProblema === "perfil") {
            setAbaAtual("perfil");
          }
        }}
      />
    );
  }

  // Configurações
  if (telaConfiguracoes) {
    return (
      <ConfiguracoesScreen
        onVoltar={() => {
          setTelaConfiguracoes(false);
          setTelaNotificacoes(false);
          setAbaAtual("inicio");
        }}
        onAbrirNotificacoes={() => {
          setTelaConfiguracoes(false);
          setOrigemNotificacoes("config");
          setTelaNotificacoes(true);
        }}
        onAbrirPrivacidade={() => {
          setTelaConfiguracoes(false);
          setOrigemPrivacidade("config");
          setTelaPrivacidade(true);
        }}
        onAbrirSobre={() => {
          setTelaConfiguracoes(false);
          setOrigemSobreApp("config");
          setTelaSobreApp(true);
        }}
        onAbrirTermos={() => {
          setTelaConfiguracoes(false);
          setOrigemTermos("config");
          setTelaTermos(true);
        }}
        onAbrirPerguntas={() => {
          setTelaConfiguracoes(false);
          setOrigemPerguntas("config");
          setTelaPerguntas(true);
        }}
        onAbrirFaleConosco={() => {
          setTelaConfiguracoes(false);
          setOrigemFaleConosco("config");
          setTelaFaleConosco(true);
        }}
        onAbrirRelatarProblema={() => {
          setTelaConfiguracoes(false);
          setOrigemRelatarProblema("config");
          setTelaRelatarProblema(true);
        }}
      />
    );
  }

  // Notificações
  if (telaNotificacoes) {
    return (
      <Notificacoes
        onVoltar={() => {
          setTelaNotificacoes(false);

          if (origemNotificacoes === "lembretes") {
            setTelaLembretes(true);
          }

          if (origemNotificacoes === "config") {
            setTelaConfiguracoes(true);
          }

          if (origemNotificacoes === "home") {
            setAbaAtual("inicio");
          }
        }}
      />
    );
  }

  // Novo lembrete
  if (telaNovoLembrete) {
    return (
      <NovoLembrete
        onVoltar={() => setTelaNovoLembrete(false)}
        onSalvar={() => {
          setTelaNovoLembrete(false);
          setTelaLembretes(true);
        }}
      />
    );
  }

  // Editar lembrete
  if (telaEditarLembrete) {
    return (
      <EditarLembrete
        lembrete={lembreteEmEdicao}
        onVoltar={() => setTelaEditarLembrete(false)}
        onSalvar={() => {
          setTelaEditarLembrete(false);
          setTelaLembretes(true);
        }}
        onExcluir={() => {
          setTelaEditarLembrete(false);
          setTelaLembretes(true);
        }}
      />
    );
  }

  // Calendário
  if (telaCalendario) {
    return (
      <Calendar
        onVoltar={() => {
          setTelaCalendario(false);

          if (origemCalendario === "lembretes") {
            setTelaLembretes(true);
          }

          if (origemCalendario === "agenda") {
            setAbaAtual("agenda");
          }
        }}
      />
    );
  }

  // Lembretes
  if (telaLembretes) {
    return (
      <Lembretes
        onVoltar={() => setTelaLembretes(false)}
        onAdicionarLembrete={() => setTelaNovoLembrete(true)}
        onAbrirConfiguracoes={() => {
          setTelaLembretes(false);
          setOrigemNotificacoes("lembretes");
          setTelaNotificacoes(true);
        }}
        onAbrirCalendario={() => {
          setTelaLembretes(false);
          setOrigemCalendario("lembretes");
          setTelaCalendario(true);
        }}
        onEditarLembrete={(lembrete) => {
          setLembreteEmEdicao(lembrete);
          setTelaLembretes(false);
          setTelaEditarLembrete(true);
        }}
      />
    );
  }

  // Ficha médica
  if (telaFichaMedica) {
    return (
      <FichaMedicaScreen
        onVoltar={() => setTelaFichaMedica(false)}
      />
    );
  }

  // Histórico
  if (telaHistorico) {
    return (
      <HistoricoScreen
        onVoltar={() => setTelaHistorico(false)}
      />
    );
  }

  // Bula: deve ficar depois de TODOS os useState
  if (telaBula && medicamentoSelecionado) {
    return (
      <BulaScreen
        medicamento={medicamentoSelecionado}
        onVoltar={() => setTelaBula(false)}
      />
    );
  }

  // Detalhes do medicamento
  if (telaDetalhesMedicamento && medicamentoSelecionado) {
    return (
      <DetalhesMedicamentoScreen
        medicamento={medicamentoSelecionado}
        onVoltar={() => setTelaDetalhesMedicamento(false)}
        onVerBula={(medicamento) => {
          setMedicamentoSelecionado(medicamento);
          setTelaBula(true);
        }}
      />
    );
  }

  // Pesquisa e seleção de medicamento
  if (telaAdicionarMedicamento) {
    return (
      <AdicionarMedicamentoScreen
        onVoltar={() => setTelaAdicionarMedicamento(false)}
        onSelecionarMedicamento={(medicamento) => {
          setMedicamentoSelecionado(medicamento);
          setTelaAdicionarMedicamento(false);
          setTelaDetalhesMedicamento(true);
        }}
      />
    );
  }

  // Aplicativo principal
  if (onboardingFinalizado) {
    return (
      <View style={styles.appContainer}>
        <View style={styles.mainContent}>
          {abaAtual === "inicio" && (
            <HomeScreen
              onAddAlarme={() => setTelaNovoLembrete(true)}
              onPressBell={() => {
                setOrigemNotificacoes("home");
                setTelaNotificacoes(true);
              }}
              onPressSettings={() => {
                setTelaConfiguracoes(true);
              }}
              onPressQuickAction={(acao) => {
                if (acao === "add") {
                  setTelaAdicionarMedicamento(true);
                }

                if (acao === "bulas") {
                  setAbaAtual("medicamentos");
                }

                if (acao === "historico") {
                  setTelaHistorico(true);
                }

                if (acao === "alertas") {
                  setTelaLembretes(true);
                }
              }}
            />
          )}

          {abaAtual === "agenda" && (
            <AgendaScreen
              onAbrirCalendario={() => {
                setOrigemCalendario("agenda");
                setTelaCalendario(true);
              }}
            />
          )}

          {abaAtual === "medicamentos" && (
            <MedicamentosScreen
              onAddMedicamento={() =>
                setTelaAdicionarMedicamento(true)
              }
            />
          )}

          {abaAtual === "perfil" && (
            <PerfilScreen
              onAbrirFicha={() => {
                setTelaFichaMedica(true);
              }}
              onAbrirLembretes={() => {
                setTelaLembretes(true);
              }}
              onAbrirHistorico={() => {
                setTelaHistorico(true);
              }}
              onAbrirAjuda={() => {
                setOrigemPerguntas("perfil");
                setTelaPerguntas(true);
              }}
              onAbrirSobre={() => {
                setOrigemSobreApp("perfil");
                setTelaSobreApp(true);
              }}
              onSair={() => {
                setAbaAtual("inicio");
                setTelaLogin(true);
                setOnboardingFinalizado(false);
              }}
            />
          )}
        </View>

        <BottomNavBar
          activeTab={abaAtual}
          onHome={() => setAbaAtual("inicio")}
          onAgenda={() => setAbaAtual("agenda")}
          onMedicamentos={() => setAbaAtual("medicamentos")}
          onPerfil={() => setAbaAtual("perfil")}
        />
      </View>
    );
  }

  // Onboarding
  function proximaTela() {
    if (telaAtual < telas.length - 1) {
      setTelaAtual(telaAtual + 1);
    } else {
      setOnboardingFinalizado(true);
      setTelaLogin(true);
    }
  }

  function pular() {
    setOnboardingFinalizado(true);
    setTelaLogin(true);
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={telas[telaAtual]}
        style={styles.background}
        resizeMode="cover"
      >
        <TouchableOpacity
          style={styles.botaoProximo}
          onPress={proximaTela}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotao}>
            {telaAtual === telas.length - 1
              ? "Começar"
              : "Próximo"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoPular}
          onPress={pular}
          activeOpacity={0.7}
        >
          <Text style={styles.textoPular}>Pular</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },

  background: {
    flex: 1,
    width,
    height,
  },

  botaoProximo: {
    position: "absolute",
    left: "7%",
    right: "7%",
    bottom: height * 0.145,
    height: 52,
    backgroundColor: colors.onboardingPrimary,
    borderRadius: radius.sm + 1,
    justifyContent: "center",
    alignItems: "center",
  },

  textoBotao: {
    color: colors.card,
    fontSize: typography.size.md,
    fontWeight: "bold",
  },

  botaoPular: {
    position: "absolute",
    bottom: height * 0.085,
    width: "100%",
    alignItems: "center",
  },

  textoPular: {
    color: colors.onboardingLink,
    fontSize: typography.size.sm + 1,
    fontWeight: "bold",
  },

  appContainer: {
    flex: 1,
    backgroundColor: colors.card,
  },

  mainContent: {
    flex: 1,
  },

  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  placeholderText: {
    fontSize: typography.size.xl + 1,
    fontWeight: "700",
    color: colors.primary,
  },

  voltarText: {
    marginTop: spacing.xl,
    fontSize: typography.size.md,
    fontWeight: "600",
    color: colors.primary,
  },
});
