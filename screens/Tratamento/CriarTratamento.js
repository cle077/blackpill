
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import DateTimePicker from '@react-native-community/datetimepicker';

// ======================================
// FUNÇÕES AUXILIARES
// ======================================

function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

function formatarDataBanco(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();

  return `${ano}-${mes}-${dia}`;
}

function formatarDias(dias) {
  if (!Array.isArray(dias)) return '';

  if (dias.length === 7 || dias.includes('Todos os dias')) {
    return 'Todos os dias';
  }

  const nomes = {
    seg: 'Seg',
    ter: 'Ter',
    qua: 'Qua',
    qui: 'Qui',
    sex: 'Sex',
    sab: 'Sáb',
    dom: 'Dom',
  };

  return dias
    .map(dia => nomes[dia.toLowerCase()] || dia)
    .join(', ');
}

// ======================================
// TELA
// ======================================

export default function CriarTratamentoScreen({
  medicamentos = [],
  onVoltar,
  onAddMedicamento,
  onCancelar,
  onCriarTratamento,
}) {

  // Dados do tratamento
  const [nomeTratamento, setNomeTratamento] = useState('');

  const [dataInicio] = useState(() => new Date());

  const [dataFim, setDataFim] = useState(null);

  const [observacao, setObservacao] = useState('');

  // Controle do calendário
  const [calendarioAberto, setCalendarioAberto] = useState(false);

  const [dataTemporaria, setDataTemporaria] = useState(
    dataFim || dataInicio
  );

  // Estado de salvamento
  const [salvando, setSalvando] = useState(false);

  // ======================================
  // CALENDÁRIO
  // ======================================

  function abrirCalendario() {
    setDataTemporaria(dataFim || dataInicio);
    setCalendarioAberto(true);
  }

  // Calendário Android
  function selecionarDataAndroid(evento, data) {
    if (evento.type === 'set' && data) {
      setDataFim(data);
    }

    setCalendarioAberto(false);
  }

  // ======================================
  // CRIAR TRATAMENTO
  // ======================================

  async function handleCriarTratamento() {

    if (!nomeTratamento.trim()) {
      Alert.alert(
        'Atenção',
        'Informe o nome do tratamento.'
      );

      return;
    }

    if (medicamentos.length === 0) {
      Alert.alert(
        'Atenção',
        'Adicione pelo menos um medicamento.'
      );

      return;
    }

    setSalvando(true);

    try {
      const dados = {
        nome_tratamento: nomeTratamento.trim(),

        data_inicio: formatarDataBanco(dataInicio),

        data_fim: dataFim
          ? formatarDataBanco(dataFim)
          : null,

        observacao: observacao.trim(),

        medicamentos,
      };

      await onCriarTratamento(dados);

    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível criar o tratamento.'
      );

    } finally {
      setSalvando(false);
    }
  }

  // ======================================
  // INTERFACE
  // ======================================

  return (
    <SafeAreaView style={styles.safeArea}>

      <StatusBar
        backgroundColor="#F5F5F5"
        barStyle="dark-content"
      />

      {/* CABEÇALHO */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={onVoltar}
        >
          <Ionicons
            name="chevron-back"
            size={23}
            color="#333333"
          />
        </TouchableOpacity>

        <Text style={styles.tituloHeader}>
          Tratamento
        </Text>

        <View style={styles.espacoHeader} />

      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* NOME DO TRATAMENTO */}

        <View style={styles.grupo}>

          <Text style={styles.label}>
            Nome do tratamento
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Escolha um nome para o tratamento"
            placeholderTextColor="#999999"
            value={nomeTratamento}
            onChangeText={setNomeTratamento}
            maxLength={100}
          />

        </View>

        {/* DATA DE INÍCIO */}

        <View style={styles.grupo}>

          <Text style={styles.label}>
            Data de início
          </Text>

          <View style={styles.dataInicioContainer}>

            <Text style={styles.dataTexto}>
              {formatarData(dataInicio)}
            </Text>

            <Text style={styles.dataFixa}>
              Hoje · fixa
            </Text>

          </View>

        </View>

        {/* DATA FINAL */}

        <View style={styles.grupo}>

          <Text style={styles.label}>
            Data final
          </Text>

          <TouchableOpacity
            style={styles.inputData}
            onPress={abrirCalendario}
            activeOpacity={0.7}
          >

            <Text
              style={[
                styles.dataPlaceholder,
                dataFim && styles.dataTexto
              ]}
            >
              {dataFim
                ? formatarData(dataFim)
                : 'Selecionar data'}
            </Text>

            <Ionicons
              name="calendar-outline"
              size={20}
              color="#315C3C"
            />

          </TouchableOpacity>

        </View>

        {/* MEDICAMENTOS */}

        <View style={styles.grupo}>

          <View style={styles.tituloSecao}>

            <Text style={styles.label}>
              Medicamentos
            </Text>

            <View style={styles.contador}>
              <Text style={styles.contadorTexto}>
                {medicamentos.length}
              </Text>
            </View>

          </View>

          {/* LISTA DE MEDICAMENTOS */}

          {medicamentos.length > 0 ? (

            medicamentos.map((item) => (

              <View
                key={item.id}
                style={styles.cardMedicamento}
              >

                <View style={styles.iconeMedicamento}>

                  <MaterialCommunityIcons
                    name="pill"
                    size={27}
                    color="#479C61"
                  />

                </View>

                <View style={styles.infoMedicamento}>

                  <Text style={styles.nomeMedicamento}>
                    {item.nome} {item.dosagem}
                    {item.quantidade
                      ? ` x${item.quantidade}`
                      : ''}
                  </Text>

                  <Text style={styles.detalhesMedicamento}>
                    {item.horarios.join(' - ')}
                    {item.horarios.length > 0 ? ' - ' : ''}
                    {formatarDias(item.diasSemana)}
                  </Text>

                </View>

              </View>

            ))

          ) : (

            <Text style={styles.listaVazia}>
              Nenhum medicamento adicionado.
            </Text>

          )}

          {/* ADICIONAR MEDICAMENTO */}

          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={onAddMedicamento}
            activeOpacity={0.7}
          >

            <Ionicons
              name="add"
              size={20}
              color="#315C3C"
            />

            <Text style={styles.textoAdicionar}>
              Adicionar medicamento
            </Text>

          </TouchableOpacity>

        </View>

        {/* OBSERVAÇÕES */}

        <View style={styles.grupo}>

          <View style={styles.tituloSecao}>

            <Text style={styles.label}>
              Observações
            </Text>

            <Text style={styles.opcional}>
              Opcional
            </Text>

          </View>

          <TextInput
            style={styles.inputObservacao}
            placeholder="Adicione informações sobre o tratamento..."
            placeholderTextColor="#999999"
            multiline
            textAlignVertical="top"
            value={observacao}
            onChangeText={setObservacao}
            maxLength={255}
          />

        </View>

        {/* BOTÕES */}

        <View style={styles.acoes}>

          <TouchableOpacity
            style={styles.botaoCancelar}
            onPress={onCancelar}
            disabled={salvando}
          >

            <Text style={styles.textoCancelar}>
              Cancelar
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botaoCriar,
              salvando && styles.botaoDesabilitado
            ]}
            onPress={handleCriarTratamento}
            disabled={salvando}
            activeOpacity={0.8}
          >

            {salvando ? (

              <ActivityIndicator color="#FFFFFF" />

            ) : (

              <Text style={styles.textoCriar}>
                Criar tratamento
              </Text>

            )}

          </TouchableOpacity>

        </View>

      </ScrollView>

      {/* CALENDÁRIO ANDROID */}

      {Platform.OS === 'android' && calendarioAberto && (

        <DateTimePicker
          value={dataTemporaria}
          mode="date"
          display="default"
          minimumDate={dataInicio}
          onChange={selecionarDataAndroid}
        />

      )}

    </SafeAreaView>
  );
}

// ======================================
// ESTILIZAÇÃO
// ======================================

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },

  botaoVoltar: {
    width: 35,
    height: 40,
    justifyContent: 'center',
  },

  tituloHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
  },

  espacoHeader: {
    width: 35,
  },

  scroll: {
    flex: 1,
  },

  conteudo: {
    paddingHorizontal: 15,
    paddingTop: 13,
    paddingBottom: 25,
  },

  grupo: {
    marginBottom: 11,
  },

  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#292929',
    marginBottom: 5,
  },

  input: {
    height: 35,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 12,
    paddingHorizontal: 10,
    fontSize: 11,
    color: '#333333',
  },

  dataInicioContainer: {
    height: 35,
    backgroundColor: '#E8F0E9',
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dataTexto: {
    fontSize: 11,
    color: '#333333',
  },

  dataFixa: {
    fontSize: 9,
    fontWeight: '600',
    color: '#438653',
  },

  inputData: {
    height: 35,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 9,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dataPlaceholder: {
    fontSize: 11,
    color: '#999999',
  },

  tituloSecao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  contador: {
    minWidth: 15,
    height: 15,
    paddingHorizontal: 4,
    backgroundColor: '#E5EEE6',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  contadorTexto: {
    fontSize: 9,
    color: '#438653',
    fontWeight: '600',
  },

  cardMedicamento: {
    minHeight: 45,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#AFAFAF',
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  iconeMedicamento: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  infoMedicamento: {
    flex: 1,
  },

  nomeMedicamento: {
    fontSize: 10,
    fontWeight: '700',
    color: '#292929',
  },

  detalhesMedicamento: {
    fontSize: 9,
    color: '#666666',
    marginTop: 2,
  },

  listaVazia: {
    fontSize: 10,
    color: '#999999',
    paddingVertical: 12,
    textAlign: 'center',
  },

  botaoAdicionar: {
    height: 34,
    borderWidth: 1,
    borderColor: '#479C61',
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  textoAdicionar: {
    fontSize: 10,
    fontWeight: '600',
    color: '#315C3C',
  },

  opcional: {
    fontSize: 9,
    color: '#888888',
  },

  inputObservacao: {
    height: 75,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingTop: 9,
    fontSize: 10,
    color: '#333333',
  },

  acoes: {
    marginTop: 8,
    gap: 7,
  },

  botaoCancelar: {
    height: 36,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoCancelar: {
    fontSize: 10,
    color: '#555555',
  },

  botaoCriar: {
    height: 38,
    backgroundColor: '#44985A',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoCriar: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  botaoDesabilitado: {
    opacity: 0.7,
  },

  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },

  modalConteudo: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 15,
    paddingBottom: 30,
  },

  modalAcoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  modalCancelar: {
    color: '#777777',
    fontSize: 14,
  },

  modalConfirmar: {
    color: '#44985A',
    fontSize: 14,
    fontWeight: '700',
  },

});
