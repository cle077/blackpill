import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

import colors from '../../theme/colors';
import radius from '../../theme/radius';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

import api from '../../services/api';
import { dataParaApi } from '../../services/lembretes';

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ],
  monthNamesShort: [
    'Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.',
    'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.',
  ],
  dayNames: [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado',
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-br';

const getToday = () => dataParaApi(new Date());

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return {
    day: date.getDate(),
    month: date.toLocaleDateString('pt-BR', { month: 'long' }),
    weekday: date.toLocaleDateString('pt-BR', { weekday: 'long' }),
  };
};

export default function CalendarScreen({ onVoltar }) {
  const today = getToday();
  const [selectedDate, setSelectedDate] = useState(today);
  const [lembretes, setLembretes] = useState([]);
  const [loading, setLoading] = useState(true);

  const selected = formatDate(selectedDate);

  const carregarLembretes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/lembretes');
      setLembretes(response.data || []);
    } catch (error) {
      console.log('Erro ao carregar lembretes:', error);
      setLembretes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarLembretes();
  }, [carregarLembretes]);

  const markedDates = React.useMemo(() => {
    const marks = {
      [selectedDate]: {
        selected: true,
        selectedColor: colors.primary,
        selectedTextColor: '#FFFFFF',
      },
    };

    lembretes.forEach((lembrete) => {
      if (lembrete.data_unica) {
        const date = lembrete.data_unica;
        if (!marks[date]) {
          marks[date] = { marked: true, dotColor: colors.primary };
        } else {
          marks[date].marked = true;
          marks[date].dotColor = colors.primary;
        }
      }
    });

    return marks;
  }, [lembretes, selectedDate]);

  const lembretesDoDia = React.useMemo(() => {
    return lembretes.filter((l) => {
      if (l.data_unica) {
        return l.data_unica === selectedDate;
      }

      const diaSemana = new Date(selectedDate + 'T12:00:00').getDay();
      return l.dias_semana?.includes(diaSemana);
    });
  }, [lembretes, selectedDate]);

  const renderLembrete = ({ item }) => (
    <View style={styles.lembreteItem}>
      <View style={styles.lembreteIcon}>
        <Ionicons name="medical" size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.lembreteNome}>{item.medicamento}</Text>
        <Text style={styles.lembreteHorario}>{item.horario}</Text>
      </View>
      {item.notificacao && (
        <Ionicons name="notifications" size={18} color={colors.primary} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={onVoltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Calendário de tratamento</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.calendarContainer}>
          <Calendar
            current={today}
            markedDates={markedDates}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            firstDay={0}
            enableSwipeMonths
            renderArrow={(direction) => (
              <Text style={styles.arrow}>
                {direction === 'left' ? '‹' : '›'}
              </Text>
            )}
            theme={{
              backgroundColor: colors.card,
              calendarBackground: colors.card,
              textSectionTitleColor: colors.textSecondary,
              dayTextColor: colors.text,
              textDisabledColor: colors.border,
              monthTextColor: colors.text,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: colors.primary,
              arrowColor: colors.primary,
              textDayFontSize: typography.size.sm,
              textMonthFontSize: typography.size.md,
              textMonthFontWeight: '700',
              textDayHeaderFontSize: typography.size.xs,
            }}
          />
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendText}>Com medicamentos</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#F29B38' }]} />
            <Text style={styles.legendText}>Atrasado</Text>
          </View>
        </View>

        <View style={styles.selectedDayCard}>
          <Text style={styles.selectedDayTitle}>
            {selected.weekday.charAt(0).toUpperCase() + selected.weekday.slice(1)},{' '}
            {selected.day} de {selected.month}
          </Text>

          {loading ? (
            <ActivityIndicator
              style={{ marginTop: spacing.lg }}
              color={colors.primary}
            />
          ) : lembretesDoDia.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum medicamento neste dia</Text>
          ) : (
            <FlatList
              data={lembretesDoDia}
              keyExtractor={(item) => item.id_lembrete}
              renderItem={renderLembrete}
              scrollEnabled={false}
              style={{ marginTop: spacing.sm }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.authBackground,
  },
  header: {
    minHeight: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: spacing.lg,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  headerTitle: {
    color: colors.text,
    fontSize: typography.size.xl,
    lineHeight: typography.size.xl + 8,
    fontWeight: '800',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  calendarContainer: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  arrow: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '300',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  legendText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  selectedDayCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    minHeight: 140,
  },
  selectedDayTitle: {
    color: colors.text,
    fontSize: typography.size.sm,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  emptyText: {
    marginTop: spacing.lg,
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  lembreteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lembreteIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  lembreteNome: {
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.text,
  },
  lembreteHorario: {
    fontSize: typography.size.xs,
    color: colors.primary,
    marginTop: 2,
  },
});
