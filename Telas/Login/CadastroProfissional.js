import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Platform, KeyboardAvoidingView, ScrollView, FlatList } from 'react-native';
import { createProfissional, createUsuario, updateProfissional, updateProfissionalServicos } from '../../api';
import LoadingIndicator from '../../Componentes/Loading';
import Checkbox from 'expo-checkbox';
import { UserContext } from '../../contextos/UserContext';

const Cadastro = ({ navigation, route }) => {
  const { user, login } = useContext(UserContext);
  const services = [
    { id: 1, name: 'Serviço 1', description: 'Limpeza e organização', screen: 'Servico1' },
    { id: 2, name: 'Serviço 2', description: 'Cuidado infantil e Babás', screen: 'Servico2' },
    { id: 3, name: 'Serviço 3', description: 'Jardinagem e Paisagismo', screen: 'Servico3' },
    { id: 4, name: 'Serviço 4', description: 'Assistência Técnica', screen: 'Servico4' },
    { id: 5, name: 'Serviço 5', description: 'Manutenção Doméstica', screen: 'Servico5' },
    { id: 6, name: 'Serviço 6', description: 'Outro serviço', screen: 'Servico6' },
  ];
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [userForm, setUserForm] = useState({
    nome: 'Isabelli',
    email: 'isa3@gmail.com',
    telefone: '48912345678',
    senha: '123',
    confirmarSenha: '123',
    valor_hora: "50"
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
      console.log(user.servicos);
      console.log(user.servicos.map(servico => servico.servico));
      setSelectedServices(user.servicos.map(servico => servico.servico));
    }
  }, [])

  const [selectedServices, setSelectedServices] = useState([]);

  const toggleServiceSelection = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((serviceId) => serviceId !== id) : [...prev, id]
    );
  };

  const renderServiceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => toggleServiceSelection(item.id)}
    >
      <View style={styles.cardContent}>
        <Checkbox
          value={selectedServices.includes(item.id)}
          onValueChange={() => toggleServiceSelection(item.id)}
        />
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );


  const handleValidateStep1 = () => {
    if (!userForm.nome || !userForm.email || !userForm.telefone || !userForm.senha || !userForm.confirmarSenha || !userForm.valor_hora) {
      alert('Preencha todos os campos');
      return
    }

    if (userForm.senha !== userForm.confirmarSenha) {
      alert('As senhas não conferem');
      return
    }
    // se o valor da hora terminar com vírgula, adiciona um zero no final
    if (userForm.valor_hora.split(',')[1] && userForm.valor_hora.split(',')[1].length === 1) {
      setUserForm({ ...userForm, valor_hora: userForm.valor_hora + '0' })
    }
    //se o valor da hora for menor que 0, exibe um alerta
    if (parseFloat(userForm.valor_hora) < 0) {
      alert('O valor da hora não pode ser menor que 0');
      return
    }

    setStep(2);
  }

  const handleValidateStep2 = () => {
    if (!endereco.cep || !endereco.rua || !endereco.numero || !endereco.bairro || !endereco.cidade || !endereco.estado) {
      alert('Preencha todos os campos');
      return
    }
    setStep(3);
    // handleRegister();
  }

  const handleRegister = () => {

    if (selectedServices.length === 0) {
      alert('Selecione ao menos um serviço');
      return
    }
    console.log({
      profissional: {
        nome: userForm.nome,
        email: userForm.email,
        telefone: userForm.telefone,
        senha: userForm.senha,
        valor_hora: parseFloat(userForm.valor_hora)
      },
      endereco: {
        cep: endereco.cep,
        rua: endereco.rua,
        numero: endereco.numero,
        bairro: endereco.bairro,
        uf: endereco.estado,
        cidade: endereco.cidade
      },
      servicos: selectedServices
    })
    setLoading(true);
    createProfissional({
      profissional: {
        nome: userForm.nome,
        email: userForm.email,
        telefone: userForm.telefone,
        senha: userForm.senha,
        valor_hora: parseFloat(userForm.valor_hora)
      },
      endereco: {
        cep: endereco.cep,
        rua: endereco.rua,
        numero: endereco.numero,
        bairro: endereco.bairro,
        uf: endereco.estado,
        cidade: endereco.cidade
      },
      servicos: selectedServices
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
    let hasError = false;
    updateProfissional({
      profissional: user.id,
      endereco: {
        cep: endereco.cep,
        rua: endereco.rua,
        numero: endereco.numero,
        bairro: endereco.bairro,
        uf: endereco.estado,
        cidade: endereco.cidade
      }
    }).then((res) => {
      console.log(res.data);

    }).catch(err => {
      hasError = true;
      console.log(err);
      alert('Erro ao atualizar cadastro');
    }).finally(() => setLoading(false));
    if (!hasError) {
      updateProfissionalServicos({
        profissional: user.id,
        servicos: selectedServices
      }).then((res) => {
        console.log(res.data);
        alert('Cadastro atualizado com sucesso');
        login({
          ...user,
          endereco: { ...endereco, uf: endereco.estado },
          servicos: selectedServices.map(servico => ({ servico })),
        }, 'profissional')
        navigation.goBack();
      }).catch(err => {
        console.log(err);
        alert('Erro ao atualizar cadastro de serviços');
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }

  const handleInputValorHora = (text) => {
    if (typeof text === 'string') {
      //se o texto tiver duas vírgulas, remove a última	
      if ((text.match(/,/g) || []).length > 1) {
        text = text.slice(0, -1)
      }
      //se após a vírgula tiver mais de dois números, remove o último
      if (text.split(',')[1] && text.split(',')[1].length > 2) {
        text = text.slice(0, -1)
      }
    }
    return text
  }

  if (loading) return <LoadingIndicator />;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <Text style={styles.title}>Cadastro {step == 1 ? "do Prestador de Serviço" : step == 2 ? "do Endereço" : "dos Serviços"}</Text>
        <Text style={styles.subtitle}>Preencha os campos a seguir para se cadastrar.</Text>
        <Text style={styles.additionalText}>Itens com (*) são obrigatórios.</Text>


        {step == 1 ? <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome completo*</Text>
            <TextInput style={styles.input} onChangeText={(text) => {
              setUserForm({ ...userForm, nome: text })
            }} value={userForm.nome} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email*</Text>
            <TextInput style={styles.input} onChangeText={(text) => {
              setUserForm({ ...userForm, email: text })
            }} value={userForm.email} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefone*</Text>
            <TextInput style={styles.input} onChangeText={(text) => {
              setUserForm({ ...userForm, telefone: text })
            }} value={userForm.telefone} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Valor por hora</Text>
            <TextInput keyboardType='decimal-pad' style={styles.input} onChangeText={(text) => {
              setUserForm({ ...userForm, valor_hora: handleInputValorHora(text) })
            }} value={userForm.valor_hora} />
          </View>
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
        </> : step === 3 ? (

          <FlatList
            data={services}
            renderItem={renderServiceCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        ) : <>
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
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Estado*</Text>
            <TextInput style={styles.input} onChangeText={(text) => {
              setEndereco({ ...endereco, estado: text })
            }} value={endereco.estado} />
          </View>
        </>}

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.buttonEnter}
            onPress={() => {
              if (step == 1) {
                handleValidateStep1();
              } else if (step == 2) {
                handleValidateStep2();
              } else {
                if (route?.params?.action == 'update') {
                  handleUpdate();
                } else {
                  handleRegister();
                }
              }
            }}
          >
            <Text style={styles.buttonText}>{step != 3 ? "Próximo" : route?.params?.action == 'update' ? "Atualizar" : "Cadastrar"}</Text>
          </TouchableOpacity>
        </View>
        {((step == 2 && route?.params?.action != 'update') || (step == 3)) && <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => { setStep(step - 1) }}
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
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
    alignSelf: 'center',
  },
  cardSelected: {
    borderColor: '#007BFF',
    borderWidth: 2,
  },
  textContainer: {
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  }, serviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
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
