import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView } from 'react-native';
import { createUsuario, updateUsuario } from '../../api';
import LoadingIndicator from '../../Componentes/Loading';
import { UserContext } from '../../contextos/UserContext';

const Cadastro = ({ navigation, route }) => {
  const { user, login} = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [userForm, setUserForm] = useState({
    nome: 'Isabelli',
    email: 'isa4@gmail.com',
    telefone: '48912345678',
    senha: '123',
    confirmarSenha: '123'
  })

  const [endereco, setEndereco] = useState({
    cep: '88960000',
    rua: 'rua teste',
    numero: '1234',
    bairro: 'teste',
    cidade: 'teste',
    estado: 'teste'
  })

  useEffect(() => {
    if (route?.params?.action == 'update') {
      setStep(2);
      setUserForm({
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        senha: '',
        confirmarSenha: ''
      })
      setEndereco({
        cep: user.endereco.cep,
        rua: user.endereco.rua,
        numero: user.endereco.numero,
        bairro: user.endereco.bairro,
        cidade: user.endereco.cidade,
        estado: user.endereco.uf
      })
    }
  }, [])

  const handleValidateStep1 = () => {
    if (!userForm.nome || !userForm.email || !userForm.telefone || !userForm.senha || !userForm.confirmarSenha) {
      alert('Preencha todos os campos');
      return
    }

    if (userForm.senha !== userForm.confirmarSenha) {
      alert('As senhas não conferem');
      return
    }

    setStep(2);
  }

  const handleValidateStep2 = () => {
    if (!endereco.cep || !endereco.rua || !endereco.numero || !endereco.bairro || !endereco.cidade || !endereco.estado) {
      alert('Preencha todos os campos');
      return
    }

    if (route?.params?.action == 'update') {
      handleUpdate();
      return;
    }
    handleRegister();
  }

  const handleRegister = () => {
    console.log(userForm);
    console.log(endereco);
    setLoading(true);
    createUsuario({
      usuario: {
        nome: userForm.nome,
        email: userForm.email,
        telefone: userForm.telefone,
        senha: userForm.senha
      },
      endereco: {
        cep: endereco.cep,
        rua: endereco.rua,
        numero: endereco.numero,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        uf: endereco.estado
      }
    }).then((res) => {
      console.log(res.data);
      alert('Cadastro realizado com sucesso');
      navigation.goBack();
    }).catch(err => {
      console.log(err);
      alert('Erro ao fazer cadastro');
    }).finally(() => setLoading(false));
  }

  const handleUpdate = () => {
    setLoading(true);
    updateUsuario({
      usuario: user.id,
      endereco: {
        cep: endereco.cep,
        rua: endereco.rua,
        numero: endereco.numero,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        uf: endereco.estado
      }
    }).then((res) => {
      console.log(res.data);
      alert('Cadastro atualizado com sucesso');
      login({
        ...user,
        endereco: {
          ...endereco
        }
      }, 'cliente');
      navigation.goBack();
    }).catch(err => {
      console.log(err);
      alert('Erro ao atualizar cadastro');
    }).finally(() => setLoading(false));
  }

  if (loading) return <LoadingIndicator />;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <Text style={styles.title}>Cadastro do {step == 1 ? "Cliente" : "Endereço"}</Text>
        <Text style={styles.subtitle}>Preencha os campos a seguir para se cadastrar.</Text>
        <Text style={styles.additionalText}>Itens com (*) são obrigatórios.</Text>


        {step == 1 ? <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome completo*</Text>
            <TextInput style={styles.input} onChangeText={(text) => {
              setUserForm({ ...userForm, nome: text })
            }} value={userForm.nome} editable={route?.params?.action != 'update'} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email*</Text>
            <TextInput style={styles.input} onChangeText={(text) => {
              setUserForm({ ...userForm, email: text })
            }} value={userForm.email} editable={route?.params?.action != 'update'} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefone*</Text>
            <TextInput style={styles.input} onChangeText={(text) => {
              setUserForm({ ...userForm, telefone: text })
            }} value={userForm.telefone} editable={route?.params?.action != 'update'} />
          </View>
          {route?.params?.action != 'update' && <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha*</Text>
              <TextInput style={styles.input} secureTextEntry onChangeText={(text) => {
                setUserForm({ ...userForm, senha: text })
              }} value={userForm.senha} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmar senha*</Text>
              <TextInput style={styles.input} secureTextEntry onChangeText={(text) => {
                setUserForm({ ...userForm, confirmarSenha: text })
              }} value={userForm.confirmarSenha} />
            </View>
          </>}
        </> : <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Rua*</Text>
            <TextInput style={styles.input} onChangeText={(text) => {
              setEndereco({ ...endereco, rua: text })
            }} value={endereco.rua} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bairro*</Text>
            <TextInput style={styles.input} onChangeText={(text) => {
              setEndereco({ ...endereco, bairro: text })
            }} value={endereco.bairro} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Numero*</Text>
            <TextInput style={styles.input} onChangeText={(text) => {
              setEndereco({ ...endereco, numero: text })
            }} value={endereco.numero} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>CEP*</Text>
            <TextInput style={styles.input} onChangeText={(text) => {
              setEndereco({ ...endereco, cep: text })
            }} value={endereco.cep} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cidade*</Text>
            <TextInput style={styles.input} onChangeText={(text) => {
              setEndereco({ ...endereco, cidade: text })
            }} value={endereco.cidade} />
          </View>
        </>}

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.buttonEnter}
            onPress={() => {
              if (step == 1) {
                handleValidateStep1();
              } else {
                handleValidateStep2();
              }
            }}
          >
            <Text style={styles.buttonText}>{step == 1 ? "Próximo" : route?.params?.action != 'update' ? "Cadastrar" : "Atualizar"}</Text>
          </TouchableOpacity>
        </View>
        {step == 2 && route?.params?.action != 'update' && <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => { setStep(1) }}
          >
            <Text style={styles.buttonTextBlack}>Voltar</Text>
          </TouchableOpacity>
        </View>}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#69F',
    padding: 16,
  },
  buttonWrapper: {
    marginVertical: 10,
    borderRadius: 10, // Botões mais redondos
  },
  button: {
    backgroundColor: '#fff', // Cor do fundo do botão "Cadastrar"
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10, // Botões mais redondos
  },
  buttonEnter: {
    backgroundColor: '#036', // Cor do fundo do botão "Entrar"
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10, // Botões mais redondos
  },
  buttonText: {
    color: '#fff', // Cor da letra branca para "Entrar"
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  buttonTextBlack: {
    color: '#036', // Cor da letra branca para "Entrar"
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#000',
    marginBottom: 8,
    textAlign: 'left',
  },
  additionalText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 16,
    textAlign: 'left',
  },
  inputContainer: {
    marginBottom: 12,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'left',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12, // Bordas mais arredondadas
    padding: 8,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#fff',
    color: '#000',
  },
});

export default Cadastro;
