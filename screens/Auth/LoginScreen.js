import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import colors from '../../theme/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LoginScreen({
  onAbrirCadastro,
  onAbrirRecuperacao,
  onEntrar,
}) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [ocultarSenha, setOcultarSenha] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Aviso', 'Por favor, preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);
    console.log('--- INICIANDO TENTATIVA DE LOGIN ---');
    console.log('Email digitado:', email.trim());

    try {
      const response = await api.post('/api/auth/login', {
        email: email.trim(),
        senha: senha,
      });

      console.log('--- RESPOSTA DA API RECEBIDA COM SUCESSO ---');
      console.log('Status HTTP:', response.status);
      console.log('Dados recebidos:', response.data);

      const { token, user } = response.data;

      if (!token) {
        throw new Error('Token não retornado pela API');
      }

      await AsyncStorage.setItem('@blackpill:token', token);
      await AsyncStorage.setItem('@blackpill:user', JSON.stringify(user || {}));

      console.log('TOKEN SALVO NO ASYNCSTORAGE:', token);
      console.log('USUARIO SALVO NO ASYNCSTORAGE:', user);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (onEntrar) {
        onEntrar(user);
      }
    } catch (error) {
      console.log('--- ERRO NA AUTENTICAÇÃO ---');
      console.log('Erro completo:', error);
      console.log('mensagem de erro:', error.message);
      console.log('Status de Erro HTTP:', error.response?.status);
      console.log('Resposta de Erro da API:', error.response?.data);

      const mensagemErro =
        error.response?.data?.message ||
        'Não foi possível conectar ao servidor. Verifique o Ngrok ou sua conexão.';

      Alert.alert('Falha no Login', mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.headerBackground}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.logo}
                />
              </View>
            </View>

            <Text style={styles.welcomeText}>Bem-Vindo</Text>
          </View>

          <View style={styles.cardContainer}>
            <Text style={styles.loginTitle}>Login</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Senha"
                placeholderTextColor={colors.placeholder}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={ocultarSenha}
                autoCapitalize="none"
                editable={!loading}
              />

              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setOcultarSenha(!ocultarSenha)}
                disabled={loading}
              >
                <Ionicons
                  name={ocultarSenha ? 'eye-off' : 'eye'}
                  size={22}
                  color={colors.placeholder}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={onAbrirRecuperacao}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>
                Esqueci minha senha
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.card} />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Não tem uma conta?{' '}
              <Text
                style={styles.signUpText}
                onPress={loading ? null : onAbrirCadastro}
              >
                Cadastre-se
              </Text>
            </Text>
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

  scrollContent: {
    minHeight: SCREEN_HEIGHT,
  },

  headerBackground: {
    backgroundColor: colors.authPrimary,
    height: SCREEN_HEIGHT * 0.45,
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 180,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scaleX: 1.2 }],
    paddingTop: 40,
  },

  logoContainer: {
    transform: [{ scaleX: 1 / 1.2 }],
  },

  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  logo: {
    width: 140,
    height: 140,
    position: 'absolute',
    top: -15,
    left: -22,
  },

  welcomeText: {
    color: colors.card,
    fontSize: 28,
    fontWeight: 'bold',
    transform: [{ scaleX: 1 / 1.2 }],
  },

  cardContainer: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 30,
    marginTop: -80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  loginTitle: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.authText,
    marginBottom: 20,
  },

  input: {
    height: 50,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.inputText,
    backgroundColor: colors.inputBackground,
    marginBottom: 15,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: colors.inputBackground,
    marginBottom: 15,
  },

  passwordInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.inputText,
  },

  eyeIcon: {
    paddingLeft: 10,
  },

  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },

  forgotPasswordText: {
    color: colors.authPrimary,
    fontSize: 14,
    fontWeight: '500',
  },

  button: {
    backgroundColor: colors.authPrimary,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: colors.card,
    fontSize: 18,
    fontWeight: 'bold',
  },

  footerContainer: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 14,
    color: colors.authText,
  },

  signUpText: {
    color: colors.authPrimary,
    fontWeight: 'bold',
  },
});
