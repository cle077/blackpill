import React, { useEffect, useMemo, useState } from 'react';

import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

import {
  Feather,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import colors from '../../theme/colors';
import radius from '../../theme/radius';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

import AppHeader from '../../components/AppHeader';
import SectionTitle from '../../components/SectionTitle';
import EmptyCard from '../../components/EmptyCard';
import PrimaryButton from '../../components/PrimaryButton';
import QuickActionsGrid from '../../components/QuickActionsGrid';

const ACOES_RAPIDAS = [
  {
    key: 'add',
    label: 'Adicionar remédio',
    variant: 'add',
    icon: (
      <Feather
        name="plus"
        size={20}
        color={colors.card}
      />
    ),
  },
  {
    key: 'bulas',
    label: 'Ver bulas',
    variant: 'light',
    icon: (
      <Feather
        name="book-open"
        size={20}
        color={colors.primary}
      />
    ),
  },
  {
    key: 'historico',
    label: 'Histórico',
    variant: 'light',
    icon: (
      <Feather
        name="calendar"
        size={20}
        color={colors.primary}
      />
    ),
  },
  {
    key: 'alertas',
    label: 'Alertas e lembretes',
    variant: 'light',
    icon: (
      <Feather
        name="bell"
        size={20}
        color={colors.primary}
      />
    ),
  },
];

function horarioAtualFormatado() {
  const agora = new Date();
  const horas = String(agora.getHours()).padStart(2, '0');
  const minutos = String(agora.getMinutes()).padStart(2, '0');
  return `${horas}:${minutos}`;
}

export default function HomeScreen({
  onAddAlarme,
  onPressQuickAction,
  onPressBell,
  onPressSettings,
  onVerAgenda,
  onConfirmarLembrete,
}) {
  const [nome, setNome] = useState('');
  const [lembretesHoje, setLembretesHoje] = useState([]);
  const [horarioAtual, setHorarioAtual] = useState(horarioAtualFormatado());
  const [proximoOcultoId, setProximoOcultoId] = useState(null);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const usuarioSalvo = JSON.parse((await AsyncStorage.getItem('@blackpill:user')) || '{}');
        if (ativo) setNome(usuarioSalvo.nome || '');
        const { data } = await api.get('/api/lembretes/hoje');
        if (ativo) setLembretesHoje(data);
      } catch (error) {
        console.log('Não foi possível carregar a Home:', error?.message);
      }
    }
    carregar();
    return () => { ativo = false; };
  }, []);

  // Mantém "o próximo remédio" em dia mesmo se a tela ficar aberta passando de um horário.
  useEffect(() => {
    const intervalo = setInterval(() => {
      setHorarioAtual(horarioAtualFormatado());
    }, 30000);
    return () => clearInterval(intervalo);
  }, []);

  // O endpoint /lembretes/hoje já retorna ordenado por horario ASC,
  // então o primeiro item ainda não passado é o próximo a tocar.
  const proximoLembrete = useMemo(() => {
    return lembretesHoje.find((item) => item.horario >= horarioAtual) || null;
  }, [lembretesHoje, horarioAtual]);

  // Some quando o usuário confirma; se o próximo lembrete mudar (passou o horário
  // e entrou outro), o card volta a aparecer normalmente para o novo lembrete.
  const proximoVisivel = proximoLembrete && proximoLembrete.id_lembrete !== proximoOcultoId;

  function handleConfirmarProximo() {
    if (!proximoLembrete) return;
    setProximoOcultoId(proximoLembrete.id_lembrete);
    if (onConfirmarLembrete) {
      onConfirmarLembrete(proximoLembrete);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <AppHeader
        onPressBell={onPressBell}
        onPressSettings={onPressSettings}
      />

      <Text style={styles.greetingTitle}>
        Olá{nome ? `, ${nome.split(' ')[0]}` : ''}
      </Text>

      <Text style={styles.greetingSubtitle}>
        Estamos aqui para lhe auxiliar
      </Text>

      {proximoVisivel && (
        <View style={styles.proximoCard}>
          <View style={styles.proximoHeaderRow}>
            <Feather name="clock" size={16} color={colors.reminderDark} />
            <Text style={styles.proximoLabel}>Próximo remédio:</Text>
          </View>

          <Text style={styles.proximoHorario}>{proximoLembrete.horario}</Text>
          <Text style={styles.proximoMedicamento}>{proximoLembrete.medicamento.toUpperCase()}</Text>

          <View style={styles.proximoActions}>
            <TouchableOpacity
              style={[styles.pillButton, styles.pillButtonPrimary]}
              onPress={handleConfirmarProximo}
              activeOpacity={0.85}
            >
              <Feather name="check" size={18} color={colors.card} />
              <Text style={styles.pillButtonPrimaryLabel}>Já tomei</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pillButton, styles.pillButtonSecondary]}
              onPress={onVerAgenda}
              activeOpacity={0.85}
            >
              <Feather name="calendar" size={18} color={colors.primary} />
              <Text style={styles.pillButtonSecondaryLabel}>Ver Agenda</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <SectionTitle
        icon={
          <MaterialCommunityIcons
            name="pill"
            size={21}
            color={colors.text}
          />
        }
        title="Medicamentos de hoje"
      />

      {lembretesHoje.length === 0 ? (
        <EmptyCard message="Nenhum alarme configurado para hoje">
          <PrimaryButton label="Adicionar alarme" icon="plus" variant="pill" onPress={onAddAlarme} />
        </EmptyCard>
      ) : (
        <ScrollView
          style={styles.todayScroll}
          contentContainerStyle={styles.todayList}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {lembretesHoje.map((item) => (
            <View key={item.id_lembrete} style={styles.todayCard}>
              <View style={styles.todayTime}><Feather name="clock" size={18} color={colors.primary} /><Text style={styles.todayTimeText}>{item.horario}</Text></View>
              <Text style={styles.todayMedicine}>{item.medicamento}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <SectionTitle
        icon={
          <Feather
            name="zap"
            size={21}
            color={colors.text}
          />
        }
        title="Ações Rápidas"
      />

      <QuickActionsGrid
        actions={ACOES_RAPIDAS.map((acao) => ({
          ...acao,
          onPress: () => {
            if (onPressQuickAction) {
              onPressQuickAction(acao.key);
            }
          },
        }))}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing['4xl'],
  },

  greetingTitle: {
    fontSize: typography.size.xl + 2,
    lineHeight: typography.size.xl + 10,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },

  greetingSubtitle: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md + 7,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },

  proximoCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius['2xl'] + 2,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  proximoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  proximoLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.reminderDark,
  },
  proximoHorario: {
    fontSize: typography.size.display + 8,
    fontWeight: '800',
    color: colors.reminderText,
    marginBottom: spacing.xs,
  },
  proximoMedicamento: {
    fontSize: typography.size.md,
    fontWeight: '700',
    color: colors.reminder,
    letterSpacing: 0.5,
    marginBottom: spacing.lg,
  },
  proximoActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 52,
    borderRadius: radius.pill,
    paddingVertical: spacing.lg - 2,
    paddingHorizontal: spacing.xl,
  },
  pillButtonPrimary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  pillButtonPrimaryLabel: {
    color: colors.card,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },
  pillButtonSecondary: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  pillButtonSecondaryLabel: {
    color: colors.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
  },

  todayScroll: { maxHeight: 260, marginBottom: spacing.xl },
  todayList: { gap: spacing.sm },
  todayCard: { minHeight: 64, paddingHorizontal: spacing.md, borderRadius: 14, backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center' },
  todayTime: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, minWidth: 86 },
  todayTimeText: { color: colors.primary, fontWeight: '700', fontSize: typography.size.md },
  todayMedicine: { color: colors.text, fontWeight: '600', fontSize: typography.size.md },
});