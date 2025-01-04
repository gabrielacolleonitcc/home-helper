import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { createSolicitacao } from '../../api';
import { UserContext } from '../../contextos/UserContext';
import LoadingIndicator from '../../Componentes/Loading';
//import { useLocalSearchParams } from 'expo-router';

export default function ProfileScreen({ route, navigation }) {
    const { user } = useContext(UserContext);
    const [descricao, setDescricao] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    const handleCall = () => {
        closeModal();
        setLoading(true);
        createSolicitacao({
            solicitacao: {
                data: new Date().toISOString(),
                servico: route.params.serviceId,
                descricao: descricao,
                status: "initiated",
                usuario_id: user.id,
                profissional_id: route.params.id
            }
        }).then((res) => {
            console.log(res.data);
            alert('Solicitação enviada com sucesso');
            navigation.navigate('HomeCliente', { refresh: true});
        }).catch(err => {
            console.log(err);
            alert('Erro ao solicitar serviço');
        }).finally(() => {
            setLoading(false);
        })
    };


    const formatPhoneNumber = (phoneNumber) => {
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phoneNumber;
    }


    if (loading) return <LoadingIndicator />;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >

            <View style={styles.header}>
                <View style={styles.profileContainer}>
                    <View style={styles.profileCircle}>
                        <Image
                            source={{ uri: route.params.image }}
                            style={styles.profileImage}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{route.params.name}</Text>
                        <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((star, i, a) => (

                                <Ionicons
                                    key={star}
                                    name={star <= route.params.media ?
                                        'star'
                                        : star - 1 < route.params.media ?
                                            'star-half' :
                                            'star-outline'}
                                    size={24}
                                    color="#FFD700"
                                />
                            ))}
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.detailsText}>Telefone: {formatPhoneNumber(route.params.telefone)}</Text>
                <Text style={styles.detailsText}>Valor/hora: {route.params.valor_hora}</Text>
                <Text style={styles.detailsText}>Atendimentos: {route.params.atendimentos}</Text>
            </View>
            <View style={styles.commentSection}>
                <TouchableOpacity onPress={openModal} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Chamar</Text>
                </TouchableOpacity>
                <Text style={styles.sectionTitle}>Comentários</Text>
                {/* <TextInput
                    placeholder="Escreva um comentário..."
                    placeholderTextColor="#888"
                    value={newComment}
                    onChangeText={setNewComment}
                    style={styles.commentInput}
                />*/}


                <FlatList
                    style={styles.commentList}
                    data={route.params.avaliacoes}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.commentItem}>
                            <Text style={styles.commentText}>{item.comentario}</Text>
                            <View style={styles.commentActions}>
                                <View style={styles.ratingContainerComment}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Ionicons
                                            key={star}
                                            name={star <= item.nota ? 'star' : 'star-outline'}
                                            size={24}
                                            color="#FFD700"
                                        />
                                    ))}
                                </View>
                                <Text> {dayjs(item.updatedAt).format('DD/MM/YYYY')}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Deixe alguma mensagem</Text>
                        <TextInput
                            style={styles.commentInput}
                            value={descricao}
                            onChangeText={setDescricao}
                        />
                        <Button
                            title="Enviar"
                            onPress={handleCall}
                            color="#036"
                        />
                        <Button title="Cancelar" onPress={closeModal} color="#FF4444" />
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    commentList: {
        flex: 1,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    ratingContainerComment: {
        flexDirection: 'row',
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
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    profileImage: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
    },
    textContainer: {
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 14,
        color: '#fff',
    },
    detailsContainer: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        marginHorizontal: 20,
        borderRadius: 10,
        marginTop: 20,
    },
    detailsText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    photoSection: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#036',
        marginBottom: 10,
    },
    additionalImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    commentSection: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 20,
        paddingBottom: 20,
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
    addButton: {
        backgroundColor: '#036',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    commentItem: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
    },
    commentText: {
        fontSize: 16,
        color: '#333',
    },
    commentActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    replyInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    replyInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        marginRight: 5,
    },
    replyButton: {
        color: '#036',
        fontWeight: 'bold',
    },
    replyText: {
        marginLeft: 15,
        color: '#666',
        marginTop: 5,
    },
});
