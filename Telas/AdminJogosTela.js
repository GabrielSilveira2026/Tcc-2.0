import React, {useState} from 'react';
import stylesGlobal, {Cores, imagemFundo} from '../Constantes/Styles'
import {TextInput, FlatList, StyleSheet, TouchableOpacity, Text, View, ImageBackground, Alert,ActivityIndicator, Keyboard} from 'react-native';
import {FontAwesome5} from 'react-native-vector-icons';
import AdminCartaoJogo from '../Componentes/AdminCartaoJogo'
import Rodape from '../Componentes/Rodape'
import axios from 'axios';
import {pesquisa2} from '../Services/httpservices'
import lista from '../Dados/jogos.json';
import {useCart} from '../Constantes/CartContext'


const AdminJogosTela = ({navigation}) => {
  const selecionados = useCart()
  const [jogo, setJogo] = useState('')
  const capturarJogo = (jogoDigitado) => {setJogo(jogoDigitado)}
  const [listaJogos, setListaJogos] = useState(lista)
  const listaAuxiliar = []

  const fazConsulta = async() => {
    if (jogo !== "") {
      setListaJogos()
      const resposta = await pesquisa2(jogo)
      if (resposta.length > 0) {
        setListaJogos(resposta)
      }
      else {
        Alert.alert("Nenhum jogo encontrado, por favor tente novamente")
        setListaJogos(lista)
      }
    }
    else{
      Alert.alert("Por favor, digite o nome de um jogo")
    }
  }


  // const pesquisa = async() => {
  //   Keyboard.dismiss()
  //   let regex = /[^0-9a-zA-Z]/gm
  //   if (jogo !== "") {
  //     setListaJogos()
  //     const response = await axios.get("https://g4673849dbf8477-qwkkduaklu8amhgz.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/jogo_tb/?limit=9999")
  //     for(var i = 0; i < response.data.items.length; i++){
  //       if(response.data.items[i].nome.replace(regex,"").toLowerCase().includes(jogo.replace(regex,"").toLowerCase())){
  //         let dadosJogo = response.data.items[i]
  //         let jogoEstaSelecionado = selecionados.cart.find(jogo => jogo.id_jogo_steam === dadosJogo.id_jogo_steam)
  //         dadosJogo.estado = jogoEstaSelecionado?'check-circle': 'circle'
  //         listaAuxiliar.push(dadosJogo)
  //       }
  //     }
  //     setListaJogos(listaAuxiliar)
  //     if (listaAuxiliar.length === 0) {
  //       setListaJogos(lista)
  //       Alert.alert("Nenhum jogo encontrado", "Por favor, tente pesquisar de outra maneira")
  //     }
  //   }
  // }

  return (
    <ImageBackground source={imagemFundo} resizeMode="stretch"  backgroundColor={Cores.secondary} style={stylesGlobal.backgroundImage}>
      <View style={stylesGlobal.conteudoTela}>
        
        <FlatList
          keyboardShouldPersistTaps='handled'
          style={{width: '100%'}}
          ListHeaderComponent={
          <>
            <Text style={styles.titulo}>Pesquise Jogos para Adicionar</Text>

            <View style={styles.pesquisa}>
              <TextInput
                style={styles.input}
                placeholder="Digite o jogo"
                placeholderTextColor="#cccccc"
                value={jogo}
                onChangeText={capturarJogo}
                onSubmitEditing={fazConsulta}
              />
              <TouchableOpacity
                onPress={fazConsulta}
              >
                <FontAwesome5 style={styles.botaoPesquisa} name="search" size={30} color="white"/>
              </TouchableOpacity>

            </View>
          </> 
          }
          data={listaJogos}
          ListEmptyComponent={<ActivityIndicator style={{marginTop:80,marginBottom:'auto'}} size={60} color={Cores.primary}/>}
          numColumns={2}
          keyExtractor={item => item.id_jogo_steam}
          renderItem={j => (
            <AdminCartaoJogo jogo={j.item} />
          )}
        />

      </View>
      <Rodape telas={{proxima: 'Selecionados', txtProxima: selecionados.cart.length>0 ? 'Confirmar '+'('+selecionados.cart.length+')':'Confirmar'}}/>
    </ImageBackground>
  );
}


export default AdminJogosTela;

const styles = StyleSheet.create({
  titulo: {
    textAlign: 'center', 
    fontSize: 25,
    color: 'white', 
    marginBottom: 15
  },
  pesquisa:{
    flexDirection: 'row',
    marginLeft: 2,
    marginRight: 2,
    marginBottom: 5,
  },
  input: {
    flexGrow:1,
    color: 'white',
    fontSize: 25,
    borderBottomWidth: 1,
    marginBottom: 10,
    borderColor: 'white'
  },
  botaoPesquisa:{
    width: 'auto', 
    backgroundColor: 'black',
    alignItems: 'center',
    borderRadius: 7,
    padding: 10, 
    marginLeft: 5,
    marginBottom: 10
  }

})