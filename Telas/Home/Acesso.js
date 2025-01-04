import React, { useState } from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';

const Acesso = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(null);
  const openModal = (option) => setModalVisible(option);
  const closeModal = () => setModalVisible(null);

  const navigateToUser = () => {
    closeModal();
    switch (modalVisible) {
      case 'login':
        navigation.navigate('LoginCliente');
        break;
      case 'cadastro': 
        navigation.navigate('CadastroCliente');
        break;
    }
  };

  const navigateToProfissional = () => {
    closeModal();
    switch (modalVisible) {
      case 'login':
        navigation.navigate('LoginProfissional');
        break;
      case 'cadastro':
        navigation.navigate('CadastroProfissional');
        break;
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icon.png')}
        style={styles.image} />
      <Text style={styles.text}>
        Bem-vindo ao{"\n"}
        <Text style={styles.homeHelperText}>HomeHelper!</Text>
      </Text>
      <Text style={styles.subtitle}>
        Transforme tarefas domésticas em{"\n"}
        <Text style={styles.boldSubtitleText}></Text> experiências gratificantes!
      </Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.buttonEnter}
            onPress={() => openModal('login')}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => openModal('cadastro')}
          >
            <Text style={styles.cadastrarButtonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={!!modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o tipo de conta</Text>
            <Button
              title="Cliente"
              onPress={navigateToUser}
              color="#036"
            />
            <Button
              title="Prestador de serviço"
              onPress={navigateToProfissional}
              color="#036"
            />
            <Button title="Cancelar" onPress={closeModal} color="#FF4444" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#69F', // Fundo de cor #69F
  },
  image: {
    height: 120,
    width: 120
  },
  text: {
    fontSize: 28, // Aumenta o tamanho do título
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', // Cor do texto branco
    textAlign: 'center', // Centraliza o texto
  },
  homeHelperText: {
    fontSize: 28, // Mantém o mesmo tamanho para "HomeHelper"
    fontWeight: 'bold',
    color: '#fff', // Cor do texto HomeHelper branco
  },
  subtitle: {
    fontSize: 18,
    color: 'black', // Cor do subtítulo preta
    marginBottom: 20,
    textAlign: 'center', // Centraliza o subtítulo
  },
  boldSubtitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '90%',
  },
  buttonWrapper: {
    marginVertical: 10,
    borderRadius: 10, // Botões mais redondos
  },
  buttonEnter: {
    backgroundColor: '#036', // Cor do fundo do botão "Entrar"
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10, // Botões mais redondos
  },
  button: {
    backgroundColor: '#fff', // Cor do fundo do botão "Cadastrar"
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
  cadastrarButtonText: {
    color: '#036', // Cor da letra para "Cadastrar"
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    color: '#036',
    marginBottom: 20,
  },
});

export default Acesso;
