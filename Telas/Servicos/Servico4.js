import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Pacote de ícones do Expo
import { UserContext } from '../../contextos/UserContext';
import { listServicos } from '../../api';
import LoadingIndicator from '../../Componentes/Loading';

export default function ProfileScreen({ navigation }) {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [profissionais, setProfissionais] = useState([])

  useEffect(() => {
    setLoading(true);
    listServicos(4).then((res) => {
      console.log(res.data);
      setProfissionais(res.data.servicos.map((servico) => servico.profissional).sort((a,b)=>{
        return a.media < b.media ? 1 : -1;
      }));
      res.data.servicos.forEach((servico) => {
        console.log(servico.profissional)
      })
    }).catch(err => {
      console.log(err);
      alert('Erro ao buscar prestadores de serviço');
    }).finally(() => setLoading(false));
  }, []);


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
      </View>

      {/* <View style={styles.searchContainer}>
        <TextInput
          placeholder="Pesquisar..."
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View> */}

      <Text style={styles.servicesTitle}>ASSISTÊNCIA TÉCNICA</Text>
      <ScrollView>
        <View style={styles.servicesContainer}>
          {profissionais.map((profissional) => (
            <View key={profissional.id} style={styles.serviceItem}>
              <TouchableOpacity
                style={styles.serviceBox}
                onPress={() => navigation.navigate('PrestadorId', {serviceId: 4, id: profissional.id, name: profissional.nome, telefone: profissional.telefone, valor_hora: profissional.valor_hora, media: profissional.media, atendimentos: profissional.atendimentos, avaliacoes: profissional.avaliacaos })}
              >
                <View style={styles.serviceInfo}>
                  <View style={styles.serviceProfileCircle}>
                    <Image
                      source={{ uri: profissional.image }}
                      style={styles.serviceProfileImage}
                    />
                  </View>
                  <View style={styles.serviceTextContainer}>
                    <Text style={styles.serviceText}>{profissional.nome}</Text>
                    <View style={styles.ratingContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (

                        <Ionicons
                          key={star}
                          name={star <= profissional.media ?
                            'star'
                            : star - 1 < profissional.media ?
                                'star-half' :
                                'star-outline'}
                          size={24}
                          color="#FFD700"
                        />
                      ))}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#036',
    paddingVertical: 40,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 37.5,
  },
  textContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 12,
    color: '#fff',
  },
  searchContainer: {
    marginTop: -20,
    paddingHorizontal: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
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
    width: '100%',
    marginVertical: 10,
  },
  serviceBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceProfileCircle: {
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
  serviceTextContainer: {
    flex: 1,
  },
  serviceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#036',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
});
