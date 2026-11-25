
import React, { useState, useEffect } from 'react';

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

// Converte uma data do banco para Date
function converterData(data) {
  if (!data) return null;

  if (data instanceof Date) return data;

  const partes = String(data).split('T')[0].split('-');

  if (partes.length === 3) {
    const [ano, mes, dia] = partes.map(Number);

    return new Date(ano, mes - 1, dia);
  }

  return new Date(data);
}

// Formata data para exibição
function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

// Formata data para o MySQL
function formatarDataBanco(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();

  return `${ano}-${mes}-${dia}`;
}

// Formata os dias da semana
function formatarDias(dias) {
  if (!Array.isArray(dias)) {
    if (typeof dias === 'string') {
      dias = dias.split(',');
    } else {
      return '';
    }
  }

  if (
    dias.length === 7 ||
    dias.includes('Todos os dias')
  ) {
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
// TELA DE EDIÇÃO
// ======================================

export default function EditarTratamentoScreen({
  tratamento,
  medicamentos = [],

  onVoltar,
  onAdicionarMedicamento,
  onEditarMedicamento,

  onSalvarEdicao,
  onDeletarTratamento,
}) {

  // ======================================
  // DADOS DO TRATAMENTO
  // ======================================

  const [nomeTratamento, setNomeTratamento] = useState(
    tratamento?.nome_tratamento || ''
  );

  const [dataInicio, setDataInicio] = useState(
    () => converterData(tratamento?.data_inicio) || new Date()
  );

  const [dataFim, setDataFim] = useState(
    () => converterData(tratamento?.data_fim)
  );

  const [observacao, setObservacao] = useState(
    tratamento?.observacao || ''
  );

  // ======================================
  // CALENDÁRIO
  // ======================================

  const [calendarioAberto, setCalendarioAberto] = useState(false);

  const [dataTemporaria, setDataTemporaria] = useState(
    dataFim || dataInicio
  );

  // ======================================
  // CONTROLE DOS BOTÕES
  // ======================================

  const [salvando, setSalvando] = useState(false);
  const [deletando, setDeletando] = useState(false);

  // Atualiza os campos caso o tratamento
  // seja carregado posteriormente pela API.

  useEffect(() => {
    setNomeTratamento(tratamento?.nome_tratamento || '');

    setDataInicio(
      converterData(tratamento?.data_inicio) || new Date()
    );

    setDataFim(
      converterData(tratamento?.data_fim)
    );

    setObservacao(tratamento?.observacao || '');

  }, [
    tratamento?.id_tratamento,
    tratamento?.nome_tratamento,
    tratamento?.data_inicio,
    tratamento?.data_fim,
    tratamento?.observacao,
  ]);

  // ======================================
  // CALENDÁRIO
  // ======================================

  function abrirCalendario() {
    setDataTemporaria(dataFim || dataInicio);
    setCalendarioAberto(true);
  }

  // Android
  function selecionarDataAndroid(evento, data) {

    if (evento.type === 'set' && data) {
      setDataFim(data);
    }

    setCalendarioAberto(false);
  }

  // ======================================
  // SALVAR ALTERAÇÕES
  // ======================================

  async function handleSalvarEdicao() {

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
        'O tratamento precisa ter pelo menos um medicamento.'
      );

      return;
    }

    if (!onSalvarEdicao) {
      Alert.alert(
        'Erro',
        'A função de salvar não foi configurada.'
      );

      return;
    }

    setSalvando(true);

    try {

      const dados = {
        id_tratamento: tratamento.id_tratamento,

        nome_tratamento: nomeTratamento.trim(),

        data_inicio: formatarDataBanco(dataInicio),

        data_fim: dataFim
          ? formatarDataBanco(dataFim)
          : null,

        observacao: observacao.trim(),

        medicamentos,
      };

      await onSalvarEdicao(dados);

    } catch (error) {

      Alert.alert(
        'Erro',
        'Não foi possível salvar as alterações.'
      );

    } finally {
      setSalvando(false);
    }
  }

  // ======================================
  // DELETAR TRATAMENTO
  // ======================================

  function confirmarExclusao() {

    Alert.alert(
      'Deletar tratamento',

      'Tem certeza que deseja deletar este tratamento? Esta ação não poderá ser desfeita.',

      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Deletar',
          style: 'destructive',

          onPress: async () => {

            if (!onDeletarTratamento) {
              Alert.alert(
                'Erro',
                'A função de exclusão não foi configurada.'
              );

              return;
            }

            setDeletando(true);

            try {

              await onDeletarTratamento(
                tratamento.id_tratamento
              );

            } catch (error) {

              Alert.alert(
                'Erro',
                'Não foi possível deletar o tratamento.'
              );

            } finally {
              setDeletando(false);
            }

          },
        },
      ]
    );
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
          Editar tratamento
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
              Data registrada
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

          {/* LISTA */}

          {medicamentos.length > 0 ? (

            medicamentos.map((item) => {

              const horarios = Array.isArray(item.horarios)
                ? item.horarios
                : [];

              return (

                <TouchableOpacity
                  key={item.id || item.id_tratamento_remedio}
                  style={styles.cardMedicamento}
                  onPress={() => {
                    if (onEditarMedicamento) {
                      onEditarMedicamento(item);
                    }
                  }}
                  activeOpacity={0.75}
                  disabled={!onEditarMedicamento}
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

                      {item.nome || item.nome_personalizado || 'Medicamento'}{' '}

                      {item.dosagem}

                      {item.quantidade
                        ? ` x${item.quantidade}`
                        : ''}

                    </Text>

                    <Text style={styles.detalhesMedicamento}>

                      {horarios.join(' - ')}

                      {horarios.length > 0 ? ' - ' : ''}

                      {formatarDias(item.diasSemana || item.dias_semana)}

                    </Text>

                  </View>

                  {onEditarMedicamento && (

                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#999999"
                    />

                  )}

                </TouchableOpacity>

              );

            })

          ) : (

            <Text style={styles.listaVazia}>
              Nenhum medicamento adicionado.
            </Text>

          )}

          {/* ADICIONAR MEDICAMENTO */}

          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={onAdicionarMedicamento}
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

        {/* BOTÃO SALVAR */}

        <View style={styles.acoes}>

          <TouchableOpacity
            style={[
              styles.botaoSalvar,
              (salvando || deletando) && styles.botaoDesabilitado
            ]}
            onPress={handleSalvarEdicao}
            disabled={salvando || deletando}
            activeOpacity={0.8}
          >

            {salvando ? (

              <ActivityIndicator color="#FFFFFF" />

            ) : (

              <Text style={styles.textoSalvar}>
                Salvar alterações
              </Text>

            )}

          </TouchableOpacity>

          {/* BOTÃO DELETAR */}

          <TouchableOpacity
            style={[
              styles.botaoDeletar,
              (salvando || deletando) && styles.botaoDesabilitado
            ]}
            onPress={confirmarExclusao}
            disabled={salvando || deletando}
            activeOpacity={0.8}
          >

            {deletando ? (

              <ActivityIndicator color="#C0392B" />

            ) : (

              <Text style={styles.textoDeletar}>
                Deletar tratamento
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

  // BOTÕES

  acoes: {
    marginTop: 8,
    gap: 8,
  },

  botaoSalvar: {
    height: 40,
    backgroundColor: '#44985A',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoSalvar: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  botaoDeletar: {
    height: 38,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#D9534F',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoDeletar: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C0392B',
  },

  botaoDesabilitado: {
    opacity: 0.6,
  },

  // MODAL

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
