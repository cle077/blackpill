import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

import EmptyState from '../../components/EmptyState';

export default function MedicamentosScreen({
  onCriarTratamento,
}) {
  const tratamentos = [];

  return (
    <View style={styles.screen}>

      {/* CABEÇALHO */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Medicamentos
        </Text>
      </View>

      {/* CONTEÚDO */}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {tratamentos.length === 0 && (
          <EmptyState
            image={require('../../assets/empty-medications.png')}
            text="Nenhum tratamento adicionado"
            buttonLabel="Adicionar tratamento"
            onPress={onCriarTratamento}
          />
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

  /* CABEÇALHO PADRONIZADO */

  header: {
    height: 75,

    backgroundColor:
      colors.authBackground,

    justifyContent:
      'center',

    alignItems:
      'center',

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
      '800',

    textAlign:
      'center',
  },

  /* CONTEÚDO */

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal:
      spacing.xl,

    paddingTop:
      spacing.xl,

    paddingBottom:
      spacing['4xl'],
  },

});