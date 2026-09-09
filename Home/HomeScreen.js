import React, { useEffect, useState } from 'react';

import {
  Text,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

import {
  Feather,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import colors from '../../theme/colors';
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

export default function HomeScreen({
  onAddAlarme,
  onPressQuickAction,
  onPressBell,
  onPressSettings,
}) {
  const [nome, setNome] = useState('');
  const [lembretesHoje, setLembretesHoje] = useState([]);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const usuarioSalvo = JSON.parse((await AsyncStorage.getItem('@blackpill:user')) || '{}');
        if (ativo) setNome(usuarioSalvo.nome || '');
        const { data } = await api.get('/lembretes/hoje');
        if (ativo) setLembretesHoje(data);
      } catch (error) {
        console.log('Não foi possível carregar a Home:', error?.message);
      }
    }
    carregar();
    return () => { ativo = false; };
  }, []);

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
        <View style={styles.todayList}>
          {lembretesHoje.map((item) => (
            <View key={item.id_lembrete} style={styles.todayCard}>
              <View style={styles.todayTime}><Feather name="clock" size={18} color={colors.primary} /><Text style={styles.todayTimeText}>{item.horario}</Text></View>
              <Text style={styles.todayMedicine}>{item.medicamento}</Text>
            </View>
          ))}
        </View>
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
  todayList: { gap: spacing.sm, marginBottom: spacing.xl },
  todayCard: { minHeight: 64, paddingHorizontal: spacing.md, borderRadius: 14, backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center' },
  todayTime: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, minWidth: 86 },
  todayTimeText: { color: colors.primary, fontWeight: '700', fontSize: typography.size.md },
  todayMedicine: { color: colors.text, fontWeight: '600', fontSize: typography.size.md },
});
