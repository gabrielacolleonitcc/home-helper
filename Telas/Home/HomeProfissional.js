import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Modal, Button, TouchableWithoutFeedback } from 'react-native';
import { UserContext } from '../../contextos/UserContext';
import dayjs from 'dayjs';
import { StatusEnum } from '../../Enums/status';
import { Ionicons } from '@expo/vector-icons';
import LoadingIndicator from '../../Componentes/Loading';
import { finishSolicitacao, getSolicitacaoByProfissional, updateSolicitacaoByProfissional } from '../../api';
import { ServicesEnum } from '../../Enums/servicos';

export default function ProfileScreen({ navigation }) {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(null);

  const closeModal = () => setModalVisible(null);
  const [comentario, setComentario] = useState('');
  const [valor, setValor] = useState('');
  const [solicitacoes, setSolicitacoes] = useState([]);

  const getSolicitacoes = () => {
    setLoading(true)
    getSolicitacaoByProfissional(user.id).then((response) => {
      response.data.solicitacoes.forEach((solicitacao) => {
        console.log(ServicesEnum[solicitacao.servico])
      })
      setSolicitacoes(response.data.solicitacoes)
    }).catch((error) => {
      console.log(error)
      alert('Erro ao buscar solicitações')
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    getSolicitacoes()
  }, [])


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

  const handleFinishService = (id) => {
    setLoading(true);
    finishSolicitacao(id).then(() => {
      alert('Serviço finalizado com sucesso')
      getSolicitacoes()
    }).catch((error) => {
      console.log(error)
      alert('Erro ao finalizar serviço')
      setLoading(false)
    }).finally(() => {
      closeModal()
    })
  }

  const handleAction = (id, action) => {
    setLoading(true);
    if (action == 'accept') {
      updateSolicitacaoByProfissional(id, {
        status: 'accepted',
        comentario: comentario,
        valor: parseFloat(valor.replace(',', '.')),
      }).then(() => {
        alert('Solicitação aceita com sucesso')
        getSolicitacoes()
      }).catch((error) => {
        console.log(error)
        alert('Erro ao aceitar solicitação')
        setLoading(false)
      }).finally(() => {
        closeModal()
      })
    } else {
      updateSolicitacaoByProfissional(id, {
        status: 'rejected',
        comentario: comentario,
      }).then(() => {
        getSolicitacoes()
      }).catch((error) => {
        console.log(error)
        alert('Erro ao recusar solicitação')
        setLoading(false)
      }).finally(() => {
        closeModal()
      })
    }
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
            onPress={() => navigation.navigate('CadastroProfissional', { action: 'update' })}
          >
            <Ionicons
              name={'pencil-outline'}
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
                onPress={() => { 
                  setValor('')
                  setComentario('')
                  setModalVisible({ id: solicitacao.id, servico: solicitacao.servico,status: solicitacao.status, cliente: solicitacao.user.nome, endereco: solicitacao.user.endereco, descricao: solicitacao.descricao }) 
                }}
              >
                <View style={styles.profissionalInfo}>
                  <View style={styles.profissionalServiceContainer}>
                    <Text style={styles.profissionalText}>{solicitacao.user.nome}</Text>
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
        <Text style={styles.servicesTitle}>HISTÓRICO</Text>

        <View style={styles.servicesContainer}>
          {solicitacoes.filter((solicitacao) => ["finished", "rejected", "rejected_by_user"].includes(solicitacao.status)).map((solicitacao) => (
            <View key={solicitacao.id} style={styles.profissionalItem}>
              <TouchableOpacity
                style={styles.profissionalBox}
                onPress={() => { }}
              >
                <View style={styles.profissionalInfo}>
                  <View style={styles.profissionalServiceContainer}>
                    <Text style={styles.profissionalText}>{solicitacao.user.nome}</Text>
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
        <Modal
          visible={!!modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View onPress={closeModal} style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{modalVisible?.cliente}</Text>
              <Text style={styles.modalSubtitle}>{ServicesEnum[modalVisible?.servico]}</Text>
              <Text style={styles.modalSubtitle}>Descrição: {modalVisible?.descricao}</Text>
              <Text style={styles.modalTextAddress}>Endereço: {modalVisible?.endereco?.rua}, {modalVisible?.endereco?.numero}</Text>
              {modalVisible?.status == 'initiated' ? <>
                <Text style={styles.modalText}>Qual valor será cobrado:</Text>
                <TextInput keyboardType='decimal-pad' style={styles.commentInput} onChangeText={(text) => {
                  setValor(handleInputValorHora(text))
                }} value={valor} />
                <Text style={styles.modalText}>Deixe alguma mensagem</Text>
                <TextInput
                  style={styles.commentInput}
                  value={comentario}
                  placeholder='Eu vou às 14h'
                  placeholderTextColor={'#888'}
                  onChangeText={setComentario}
                />

                <Button
                  title="Aceitar"
                  onPress={() => { handleAction(modalVisible?.id, 'accept') }}
                  color="#036"
                />
                <Button title="Recusar" onPress={() => { handleAction(modalVisible?.id, 'reject') }} color="#FF4444" />
              </> : modalVisible?.status == 'rejected_by_user' ? <>
                <Text style={styles.modalText}>O cliente recusou a sua proposta pelo trabalho.</Text>
              </> : modalVisible?.status == 'accepted_by_user' ? <>
                <Text style={styles.modalText}>O cliente aceitou a sua proposta pelo trabalho.{"\n"}
                  Compareça no endereço informado no horário combinado.
                </Text>
                <Button title="Já finalizei o serviço" onPress={()=>{handleFinishService(modalVisible?.id)}} color="#036" />
              </> : <>
                <Text style={styles.modalText}>O cliente precisa aceitar a sua proposta pelo trabalho.</Text>
              </>}
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
  serviceTextContainer: {
    flex: 1,
  },
  commentInput: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
  },
  actionBoxContainer: {
    flexDirection: 'col',
    alignItems: 'center',
    gap: 10
  },
  actionButtonBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 5,
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
  modalSubtitle: {
    fontSize: 16,
    color: '#036',
    fontWeight: 'semibold',
    marginBottom: 10,
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
  header: {
    backgroundColor: '#036', // cor de fundo azul
    paddingVertical: 60, // aumenta ainda mais a altura da área azul
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  serviceBox: {
    height: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
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
