import React, { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import api from '../../services/api';
import colors from '../../theme/colors';

export default function RecSenhaScreen({ onVoltarLogin }) {
  const [etapa, setEtapa] = useState('email');

  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [loading, setLoading] = useState(false);

  const solicitarCodigo = async () => {
    const emailNormalizado = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
      Alert.alert('Atenção', 'Digite um e-mail válido.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/auth/forgot-password', {
        email: emailNormalizado,
      });

      setEmail(emailNormalizado);
      setEtapa('codigo');

      Alert.alert(
        'Verifique seu e-mail',
        'Um código de seis digitos foi enviado ao seu e-mail.'
      );
    } catch (error) {
      Alert.alert(
        'Erro',
        error.response?.data?.message ||
          'Não foi possível solicitar o código. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const redefinirSenha = async () => {
    if (!/^\d{6}$/.test(codigo.trim())) {
      Alert.alert('Atenção', 'Digite o código de seis dígitos.');
      return;
    }

    if (!novaSenha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha os dois campos de senha.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    const senhaRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    if (!senhaRegex.test(novaSenha)) {
      Alert.alert(
        'Atenção',
        'A senha deve ter pelo menos 8 caracteres, incluir um número e um caractere especial.'
      );
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/auth/reset-password', {
        email,
        codigo: codigo.trim(),
        novaSenha,
      });

      Alert.alert(
        'Senha alterada',
        'Sua senha foi redefinida. Entre no aplicativo com a nova senha.',
        [
          {
            text: 'Ir para o login',
            onPress: onVoltarLogin,
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Não foi possível alterar a senha',
        error.response?.data?.message ||
          'Verifique o código e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onVoltarLogin}
              disabled={loading}
            >
              <Text style={styles.backButtonText}>‹</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>
              {etapa === 'email'
                ? 'Recuperar senha'
                : 'Criar nova senha'}
            </Text>

            <Text style={styles.description}>
              {etapa === 'email'
                ? 'Informe o e-mail cadastrado para receber seu código de recuperação.'
                : `Digite o código enviado para ${email} e escolha sua nova senha.`}
            </Text>

            <View style={styles.form}>
              {etapa === 'email' ? (
                <>
                  <Text style={styles.inputLabel}>E-mail</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu e-mail"
                    placeholderTextColor={colors.placeholder}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />

                  <TouchableOpacity
                    style={styles.button}
                    onPress={solicitarCodigo}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color={colors.card} />
                    ) : (
                      <Text style={styles.buttonText}>
                        Enviar código
                      </Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.inputLabel}>
                    Código de verificação
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="000000"
                    placeholderTextColor={colors.placeholder}
                    value={codigo}
                    onChangeText={(value) =>
                      setCodigo(
                        value.replace(/\D/g, '').slice(0, 6)
                      )
                    }
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!loading}
                  />

                  <Text style={styles.inputLabel}>Nova senha</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Digite a nova senha"
                    placeholderTextColor={colors.placeholder}
                    value={novaSenha}
                    onChangeText={setNovaSenha}
                    secureTextEntry
                    autoCapitalize="none"
                    editable={!loading}
                  />

                  <Text style={styles.inputLabel}>
                    Confirmar nova senha
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Repita a nova senha"
                    placeholderTextColor={colors.placeholder}
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    secureTextEntry
                    autoCapitalize="none"
                    editable={!loading}
                  />

                  <TouchableOpacity
                    style={styles.button}
                    onPress={redefinirSenha}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color={colors.card} />
                    ) : (
                      <Text style={styles.buttonText}>
                        Redefinir senha
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => {
                      setEtapa('email');
                      setCodigo('');
                      setNovaSenha('');
                      setConfirmarSenha('');
                    }}
                    disabled={loading}
                  >
                    <Text style={styles.secondaryButtonText}>
                      Voltar e solicitar outro código
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>
                Precisa de ajuda?
              </Text>
              <Text style={styles.alertDescription}>
                Verifique sua caixa de entrada e a pasta de spam.
                O código expira em 10 minutos.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.outlineButton}
              onPress={onVoltarLogin}
              disabled={loading}
            >
              <Text style={styles.outlineButtonText}>
                Voltar para o login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.authBackground,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  headerBar: {
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 32,
    color: colors.authText,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  logo: {
    width: 90,
    height: 90,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.authText,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.authText,
    textAlign: 'center',
    marginBottom: 26,
  },
  form: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.authText,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    minHeight: 50,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#D8DDE3',
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 18,
    color: colors.authText,
    fontSize: 15,
  },
  button: {
    minHeight: 50,
    backgroundColor: colors.authPrimary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  buttonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  secondaryButtonText: {
    color: colors.authPrimary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  alertBox: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 16,
    marginTop: 24,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.authText,
    marginBottom: 6,
  },
  alertDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.authText,
  },
  outlineButton: {
    width: '100%',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.authPrimary,
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 12,
  },
  outlineButtonText: {
    color: colors.authPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});
