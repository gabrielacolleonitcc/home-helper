import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Modal, Button } from 'react-native';
import { UserContext } from '../../contextos/UserContext';
import dayjs from 'dayjs';
import { StatusEnum } from '../../Enums/status';
import { Ionicons } from '@expo/vector-icons';
import { ServicesEnum } from '../../Enums/servicos';
import { cancelSolicitacao, getSolicitacaoByUsuario, updateSolicitacaoByUsuario } from '../../api';
import LoadingIndicator from '../../Componentes/Loading';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ navigation, route }) {
  const { user } = useContext(UserContext);
  const services = [
    { id: 0, name: 'Serviço 1', description: 'Limpeza e organização', screen: 'Servico1', image: require('../../assets/limpeza.jpg') },
    { id: 1, name: 'Serviço 2', description: 'Cuidado infantil e Babás', screen: 'Servico2', image: require('../../assets/babas.jpg') },
    { id: 2, name: 'Serviço 3', description: 'Jardinagem e Paisagismo', screen: 'Servico3', image: require('../../assets/jardinagem.jpg') },
    { id: 3, name: 'Serviço 4', description: 'Assistência Técnica', screen: 'Servico4', image: require('../../assets/assistencia.jpg') },
    { id: 4, name: 'Serviço 5', description: 'Manutenção Doméstica', screen: 'Servico5', image: require('../../assets/domestica.jpg') },
    { id: 5, name: 'Serviço 6', description: 'Outros serviços', screen: 'Servico6', image: require('../../assets/outros.jpg') },
  ];
  const [loading, setLoading] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [modalVisible, setModalVisible] = useState(null);

  const closeModal = () => setModalVisible(null);

  useFocusEffect(useCallback(() => {

    setLoading(true)
    getSolicitacaoByUsuario(user.id).then((response) => {
      response.data.solicitacoes.forEach((solicitacao) => {
        console.log(solicitacao)
      })
      setSolicitacoes(response.data.solicitacoes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    }).catch((error) => {
      console.log(error)
      alert('Erro ao buscar solicitações')
    }).finally(() => {
      setLoading(false)
    })
  }, []))

  const handleAction = (solicitacao, action) => {
    setLoading(true)
    updateSolicitacaoByUsuario(solicitacao, {
      status: action
    }).then((response) => {
    }).catch((error) => {
      console.log(error)
      alert('Erro ao atualizar solicitação')
    }).finally(() => {
      setLoading(false)
      closeModal()
    })
  }

  const handleCancel = (solicitacao) => {
    setLoading(true)
    cancelSolicitacao(solicitacao).then((response) => {
      console.log(response)
      alert('Solicitação cancelada com sucesso')
    }).catch((error) => {
      console.log(error)
      alert('Erro ao cancelar solicitação')
    }).finally(() => {
      closeModal()
      setLoading(false)
    })
  }

  if (loading) return <LoadingIndicator />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.profileCircle}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{user.nome}</Text>
            <Text style={styles.subtitle}>{user.email}</Text>
          </View>
        </View>
        <View style={styles.actionBoxContainer}>
          <TouchableOpacity
            style={styles.actionButtonBox}
            onPress={() => navigation.navigate('CadastroCliente', { action: 'update' })}
          >
            <Ionicons
              name={'pencil-outline'}
              size={24}
              color="#036"
            />

          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButtonBox}
            onPress={() => { navigation.navigate('HistoricoCliente') }}
          >
            <Ionicons
              name={'time'}
              size={24}
              color="#036"
            />

          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Pesquisar..."
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>
      <ScrollView style={styles.container}>

        <Text style={styles.servicesTitle}>SOLICITAÇÕES</Text>

        <View style={styles.servicesContainer}>
          {solicitacoes.filter((solicitacao) => ["initiated", "accepted", "accepted_by_user"].includes(solicitacao.status)).map((solicitacao) => (
            <View key={solicitacao.id} style={styles.profissionalItem}>
              <TouchableOpacity
                style={styles.profissionalBox}
                onPress={() => { setModalVisible({ id: solicitacao.id, servico: solicitacao.servico, status: solicitacao.status, profissional: solicitacao.profissional.nome, comentario: solicitacao.comentario, valor: solicitacao.valor }) }}
              >
                <View style={styles.profissionalInfo}>
                  <View style={styles.profissionalServiceContainer}>
                    <Text style={styles.profissionalText}>{solicitacao.profissional.nome}</Text>
                    <Text style={styles.profissionalServiceStatusText}>{StatusEnum[solicitacao.status]}</Text>
                  </View>
                  <View style={styles.profissionalServiceContainer}>
                    <Text style={styles.profissionalServiceText}>{ServicesEnum[solicitacao.servico]}</Text>
                    <Text style={styles.profissionalServiceDateText}>{dayjs(solicitacao.createdAt).format('HH:mm')}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <Text style={styles.servicesTitle}>SERVIÇOS</Text>

        <View style={styles.servicesContainer}>
          {services.map((service) => (
            <View key={service.id} style={styles.serviceItem}>
              <TouchableOpacity
                style={styles.serviceBox}
                onPress={() => navigation.navigate(service.screen, { serviceId: service.id })}
              >
                <Image
                  source={service.image}
                  style={styles.image} />
                {/* <Text style={styles.serviceText}>{service.name}</Text> */}
              </TouchableOpacity>
              <Text style={styles.serviceDescription}>{service.description}</Text>
            </View>
          ))}
        </View>
        <Modal
          visible={!!modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View onPress={closeModal} style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{modalVisible?.profissional}</Text>

              <Text style={styles.modalSubTitle}>{ServicesEnum[modalVisible?.servico]}</Text>

              {modalVisible?.status == "accepted" ? <>

                <Text style={styles.modalText}>Qual valor será cobrado: R$ {modalVisible?.valor}</Text>

                <Text style={styles.modalText}>Comentário: {modalVisible?.comentario}</Text>

                <Button
                  title="Aceitar"
                  onPress={() => { handleAction(modalVisible?.id, 'accepted_by_user') }}
                  color="#036"
                />
                <Button title="Recusar" onPress={() => { handleAction(modalVisible?.id, 'rejected_by_user') }} color="#FF4444" />
              </> : modalVisible?.status == 'rejected_by_user' ? <>
                <Text style={styles.modalText}>Você recusou a proposta pelo trabalho.</Text>
              </> : modalVisible?.status == 'accepted_by_user' ? <>
                <Text style={styles.modalText}>Qual valor será cobrado: R$ {modalVisible?.valor}</Text>

                <Text style={styles.modalText}>Comentário: {modalVisible?.comentario}</Text>
                <Text style={styles.modalText}>Você aceitou a proposta pelo trabalho.{"\n"}
                  O prestador de serviço deve chegar no horário combinado.
                </Text></> : <>
                <Text style={styles.modalText}>Você fez a solicitação pelo trabalho.{"\n"}
                  O prestador de serviço ainda precisa responder a sua solicitação.
                </Text>
                <Button title="Cancelar" onPress={() => { handleCancel(modalVisible?.id) }} color="#FF4444" />

              </>
              }
              <Button title="Voltar" onPress={closeModal} color="#036" />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 10,  // para bordas arredondadas iguais ao card
    resizeMode: 'cover',  // mantém a proporção da imagem e preenche o card
  },
  serviceBox: {
    height: 120,  // ajuste a altura conforme o design desejado
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',  // garante que a imagem não ultrapasse as bordas arredondadas
  },
  serviceTextContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#036', // cor de fundo azul
    paddingVertical: 60, // aumenta ainda mais a altura da área azul
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontWeight: 'bold',
    color: '#036',
    marginBottom: 5,
  },
  modalSubTitle: {
    fontSize: 16,
    color: '#036',
    fontWeight: 'semibold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#036',
    marginBottom: 10,
  },
  modalTextAddress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#036',
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBoxContainer: {
    flexDirection: 'col',
    alignItems: 'center',
    gap: 10
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40, // torna o círculo
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
  },
  textContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
  },
  searchContainer: {
    marginTop: -30, // ajusta a posição do campo de pesquisa sobre a borda inferior da parte azul
    paddingHorizontal: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12, // torna o campo de pesquisa mais espesso (mais alto)
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  servicesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#036',
    marginTop: 20,
    marginLeft: 20,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  serviceItem: {
    width: '45%',
    marginVertical: 10,
  },
  serviceText: {
    fontSize: 16,
    color: '#036',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  profissionalItem: {
    width: '100%',
    marginVertical: 10,
  },
  profissionalBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
  },
  actionButtonBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 5,
  },
  profissionalInfo: {
    flexDirection: 'col',
    alignItems: 'start',
  },
  profissionalProfileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  serviceProfileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  profissionalTextContainer: {
    flex: 1,
  },
  profissionalServiceContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profissionalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#036',
  },

  profissionalServiceText: {
    fontSize: 18,

    color: '#036',
  },

  profissionalServiceStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#036',
  },
  profissionalServiceDateText: {
    fontSize: 12,
    color: '#036',
  },
});
