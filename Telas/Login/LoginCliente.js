import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { loginUsuario } from '../../api';
import LoadingIndicator from '../../Componentes/Loading';
import { UserContext } from '../../contextos/UserContext';

const Login = ({ navigation }) => {
    const {login} = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('gabriela@gmail.com');
    const [password, setPassword] = useState('12345');
    const handleLogin = () => {
        setLoading(true);
        loginUsuario({ login: email, senha: password }).then((res) => {
            console.log(res.data);
            login(res.data.user, 'cliente');
            navigation.navigate('HomeCliente');
        }).catch(err => {
            console.log(err);
            alert('Erro ao fazer login');
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

                <Image
                    source={require('../../assets/icon.png')}
                    style={styles.image} />
                <Text style={styles.title}>Login</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
                </View>
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonWrapper}>
                        <TouchableOpacity
                            style={styles.buttonEnter}
                            onPress={handleLogin}
                        >
                            <Text style={styles.buttonText}>Entrar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonWrapper}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.cadastrarButtonText}>Voltar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#69F', // Fundo de cor #69F
    },
    image: {
        height: 120,
        width: 120
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
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
});

export default Login;
