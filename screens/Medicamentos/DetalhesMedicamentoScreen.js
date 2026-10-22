
import React, { useCallback, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import api from '../../services/api';

import colors from '../../theme/colors';
import radius from '../../theme/radius';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

import ScreenHeader from '../../components/ScreenHeader';
import MedicationSummary from '../../components/MedicationSummary';
import StatusTag from '../../components/StatusTag';
import InfoCard from '../../components/InfoCard';
import NoteCard from '../../components/NoteCard';
import PrimaryButton from '../../components/PrimaryButton';

export default function DetalhesMedicamentoScreen({
  medicamento,
  onVoltar,
  onVerBula,
}) {
  const [detalhes, setDetalhes] = useState(medicamento || null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarDetalhes = useCallback(async () => {
    const id = medicamento?.cd_remedio;

    if (!id) {
      setErro('Não foi possível identificar o medicamento.');
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro('');

      const response = await api.get(`/api/remedios/${id}`);

      setDetalhes(response.data);
    } catch (error) {
      console.error(
        'Erro ao carregar detalhes do medicamento:',
        error.response?.data || error.message
      );

      setErro(
        error.response?.data?.message ||
          'Não foi possível carregar os detalhes do medicamento.'
      );
    } finally {
      setCarregando(false);
    }
  }, [medicamento?.cd_remedio]);

  useEffect(() => {
    setDetalhes(medicamento || null);
    carregarDetalhes();
  }, [medicamento, carregarDetalhes]);

  if (carregando) {
    return (
      <View style={styles.screen}>
        <ScreenHeader
          title="Detalhes do medicamento"
          onBack={onVoltar}
        />

        <View style={styles.estadoContainer}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.estadoTexto}>
            Carregando informações do medicamento...
          </Text>
        </View>
      </View>
    );
  }

  if (erro || !detalhes) {
    return (
      <View style={styles.screen}>
        <ScreenHeader
          title="Detalhes do medicamento"
          onBack={onVoltar}
        />

        <View style={styles.estadoContainer}>
          <Text style={styles.erroTitulo}>
            Não foi possível carregar
          </Text>

          <Text style={styles.estadoTexto}>
            {erro || 'Medicamento não encontrado.'}
          </Text>

          <View style={styles.botaoErro}>
            <PrimaryButton
              label="Tentar novamente"
              onPress={carregarDetalhes}
            />
          </View>
        </View>
      </View>
    );
  }

  const nome = detalhes.nome || 'Nome não informado';

  const concentracao = detalhes.concentracao
    ? ` ${detalhes.concentracao}`
    : '';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ScreenHeader
        title="Detalhes do medicamento"
        onBack={onVoltar}
      />

      <View style={styles.topCard}>
        <MedicationSummary
          name={`${nome}${concentracao}`}
          form={
            detalhes.forma_farmaceutica ||
            detalhes.forma ||
            'Forma não informada'
          }
        >
          <StatusTag label="Informações do medicamento" />
        </MedicationSummary>
      </View>

      <InfoCard
        title="Informações do medicamento"
        items={[
          {
            label: 'Fabricante',
            value: detalhes.fabricante || 'Não informado',
          },
          {
            label: 'Marca',
            value: detalhes.marca || 'Não informada',
          },
          {
            label: 'Concentração',
            value: detalhes.concentracao || 'Não informada',
          },
          {
            label: 'Tarja',
            value: detalhes.tarja || 'Não informada',
            danger: Boolean(detalhes.tarja),
          },
          {
            label: 'DCB',
            value: detalhes.dcb || 'Não informada',
          },
        ]}
      />

      <View style={styles.noteWrap}>
        <NoteCard
          icon={<Text style={styles.noteIconText}>i</Text>}
          title="Sobre o medicamento"
          text={
            detalhes.descricao ||
            'Consulte a bula para conhecer as indicações, as orientações de uso e os cuidados relacionados a este medicamento.'
          }
        />
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label="Ver bula"
          onPress={() => onVerBula?.(detalhes)}
        />

        <PrimaryButton
          label="Adicionar aos lembretes"
          onPress={() => {}}
        />

        <PrimaryButton
          label="Ver agenda deste medicamento"
          onPress={() => {}}
        />
      </View>
    </ScrollView>
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

  noteWrap: {
    marginTop: spacing.md,
  },

  noteIconText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },

  actions: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },

  estadoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },

  estadoTexto: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },

  erroTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },

  botaoErro: {
    width: '100%',
    marginTop: spacing.lg,
  },
});
