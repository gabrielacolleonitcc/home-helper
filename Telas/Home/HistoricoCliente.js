import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Modal, Button } from 'react-native';
import { UserContext } from '../../contextos/UserContext';
import dayjs from 'dayjs';
import { StatusEnum } from '../../Enums/status';
import { Ionicons } from '@expo/vector-icons';
import { ServicesEnum } from '../../Enums/servicos';
import { avaliarSoliciacao, getSolicitacaoByUsuario, updateSolicitacaoByUsuario } from '../../api';
import LoadingIndicator from '../../Componentes/Loading';

export default function ProfileScreen({ navigation }) {
  const { user } = useContext(UserContext);
  const services = [
    { id: 0, name: 'Serviço 1', description: 'Limpeza e organização', screen: 'Servico1' },
    { id: 1, name: 'Serviço 2', description: 'Cuidado infantil e Babás', screen: 'Servico2' },
    { id: 2, name: 'Serviço 3', description: 'Jardinagem e Paisagismo', screen: 'Servico3' },
    { id: 3, name: 'Serviço 4', description: 'Assistência Técnica', screen: 'Servico4' },
    { id: 4, name: 'Serviço 5', description: 'Manutenção Doméstica', screen: 'Servico5' },
    { id: 5, name: 'Serviço 6', description: 'Outro serviço', screen: 'Servico6' },
  ];
  const [loading, setLoading] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [modalVisible, setModalVisible] = useState(null);

  const closeModal = () => setModalVisible(null);
  const [comentario, setComentario] = useState('');
  const [nota, setNota] = useState('');

  useEffect(() => {
    setLoading(true)
    getSolicitacaoByUsuario(user.id).then((response) => {

      setSolicitacoes(response.data.solicitacoes.filter((solicitacao) => ["finished", "rejected", "rejected_by_user"].includes(solicitacao.status)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    }).catch((error) => {
      console.log(error)
      alert('Erro ao buscar solicitações')
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const handleAvaliar = (solicitacao) => {
    setLoading(true)
    avaliarSoliciacao(solicitacao, {
      nota: nota,
      comentario: comentario
    }).then((response) => {
      console.log(response.data)
      alert('Avaliação realizada com sucesso')
    }).catch((error) => {
      console.log(error)
      alert('Erro ao avaliar solicitação')
    }).finally(() => {
      setLoading(false)
      closeModal()
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
            onPress={() => navigation.navigate('HomeCliente')}
          >
            <Ionicons
              name={'home'}
              size={24}
              color="#036"
            />

          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container}>

        <Text style={styles.servicesTitle}>HISTÓRICO</Text>

        <View style={styles.servicesContainer}>
          {solicitacoes.map((solicitacao) => (
            <View key={solicitacao.id} style={styles.profissionalItem}>
              <TouchableOpacity
                style={styles.profissionalBox}
                onPress={() => {
                  if (solicitacao.avaliacao) {
                    setNota(solicitacao.avaliacao.nota)
                    setComentario(solicitacao.avaliacao.comentario)
                  } else {
                    setNota(0)
                    setComentario('')
                  }
                  setModalVisible({ id: solicitacao.id, profissional: solicitacao.profissional.nome, servico: solicitacao.servico, avaliacao: solicitacao.avaliacao })
                }}
              >
                <View style={styles.profissionalInfo}>
                  <View style={styles.profissionalServiceContainer}>
                    <Text style={styles.profissionalText}>{solicitacao.profissional.nome}</Text>
                    <Text style={styles.profissionalServiceStatusText}>{StatusEnum[solicitacao.status]}</Text>
                  </View>
                  <View style={styles.profissionalServiceContainer}>
                    <Text style={styles.profissionalServiceText}>{ServicesEnum[solicitacao.servico]}</Text>
                    <Text style={styles.profissionalServiceDateText}>{dayjs(solicitacao.createdAt).format("DD/MM")} às {dayjs(solicitacao.createdAt).format("HH:mm")}</Text>
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
              <Text style={styles.modalTitle}>{modalVisible?.profissional}</Text>
              <Text style={styles.modalSubTitle}>{ServicesEnum[modalVisible?.servico]}</Text>

              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    disabled={!!modalVisible?.avaliacao}
                    onPress={() => setNota(star)}
                  >

                    <Ionicons
                      key={star}
                      name={star <= nota ? 'star' : 'star-outline'}
                      size={24}
                      color="#FFD700"
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {!modalVisible?.avaliacao && <Text style={styles.modalText}>Deixe algum comentário</Text>}
              <TextInput
                style={styles.commentInput}
                value={comentario}
                placeholder='Excelente profissional'
                placeholderTextColor={'#888'}
                editable={!modalVisible?.avaliacao} 
                onChangeText={setComentario}
              />

              {!modalVisible?.avaliacao && <Button
                title="Avaliar"
                onPress={() => { handleAvaliar(modalVisible?.id) }}
                color="#036"
              />}

              <Button title="Voltar" onPress={closeModal} color="#000" />
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
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10,
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
