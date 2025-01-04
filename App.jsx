import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import Acesso from './Telas/Home/Acesso';
import CadastroCliente from './Telas/Login/CadastroCliente';
import CadastroProfissional from './Telas/Login/CadastroProfissional';
import HomeCliente from './Telas/Home/HomeCliente';
import HistoricoCliente from './Telas/Home/HistoricoCliente';
import HomeProfissional from './Telas/Home/HomeProfissional';
import Servico1 from './Telas/Servicos/Servico1';
import Servico2 from './Telas/Servicos/Servico2';
import Servico3 from './Telas/Servicos/Servico3';
import Servico4 from './Telas/Servicos/Servico4';
import Servico5 from './Telas/Servicos/Servico5';
import Servico6 from './Telas/Servicos/Servico6';
import LoginCliente from './Telas/Login/LoginCliente';
import LoginProfissional from './Telas/Login/LoginProfissional';
import PrestadorId from './Telas/Servicos/prestadorId';
import { UserProvider } from './contextos/UserContext';
const Stack = createStackNavigator();

// Configuração de Deep Linking
const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      HistoricoCliente: 'historicoCliente',
      LoginCliente: 'loginCliente',
      LoginProfissional: 'loginProfissional',
      Acesso: 'acesso',
      CadastroCliente: 'cadastroCliente',
      CadastroProfissional: 'cadastroProfissional',
      HomeProfissional: 'homeProfissional',
      HomeCliente: 'homeCliente',
      Servico1: 'servico1',
      Servico2: 'servico2',
      Servico3: 'servico3',
      Servico4: 'servico4',
      Servico5: 'servico5',
      Servico6: 'servico6',
      PrestadorId: 'prestadorId'
    },

  },
};

const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <UserProvider>
        <Stack.Navigator initialRouteName="Acesso">
          <Stack.Screen name="Acesso" options={{ title: 'Acesso' }} component={Acesso} />
          <Stack.Screen name="LoginCliente" options={{ title: 'Login' }} component={LoginCliente} />
          <Stack.Screen name="LoginProfissional" options={{ title: 'Login' }} component={LoginProfissional} />
          <Stack.Screen name="CadastroCliente" options={{ title: 'Cadastro' }} component={CadastroCliente} />
          <Stack.Screen name="CadastroProfissional" options={{ title: 'Cadastro' }} component={CadastroProfissional} />
          <Stack.Screen name="HomeCliente" options={{ title: 'Home' }} component={HomeCliente} />
          <Stack.Screen name="HistoricoCliente" options={{ title: 'Histórico' }} component={HistoricoCliente} />
          <Stack.Screen name="HomeProfissional" options={{ title: 'Home' }} component={HomeProfissional} />
          <Stack.Screen name="Servico1" options={{ title: 'Limpeza e organização' }} component={Servico1} />
          <Stack.Screen name="Servico2" options={{ title: 'Cuidado infantil e babás' }} component={Servico2} />
          <Stack.Screen name="Servico3" options={{ title: 'Jardinagem e paisagismo', }} component={Servico3} />
          <Stack.Screen name="Servico4" options={{ title: 'Assistência técnica' }} component={Servico4} />
          <Stack.Screen name="Servico5" options={{ title: 'Manutenção doméstica' }} component={Servico5} />
          <Stack.Screen name="Servico6" options={{ title: 'Outros Serviços' }} component={Servico6} />
          <Stack.Screen name="PrestadorId" options={{ title: 'Prestador de serviço' }} component={PrestadorId} />

        </Stack.Navigator>
      </UserProvider>
    </NavigationContainer>
  );
};

export default App;

