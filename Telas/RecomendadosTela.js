import React, { useEffect, useState} from 'react';
import {StyleSheet, Text, View, ImageBackground, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import stylesGlobal, {Cores, imagemFundo} from '../Constantes/Styles'
import Rodape from '../Componentes/Rodape'
import CartaoPc from '../Componentes/CartaoPc'
import {extraiRequisitosDeUmaLista, montaPc} from '../Services/httpservices'
import {useCart} from '../Constantes/CartContext'
import axios from 'axios'


const RecomendadosTela = ({route, navigation}) => {
  const [verMais, setVerMais] = useState(false)
  const precoFiltro = route.params
  const selecionados = useCart()
  const [carrega, setCarrega] = useState(true)
  const [pcMinimo, setPcMinimo] = useState([])
  const [pcRecomendado, setPcRecomendado] = useState([])
  const reqs = extraiRequisitosDeUmaLista(selecionados.cart)

  useEffect(()=>{
    async function montaPC(){
      let pcMin
      let pcRec
      if (reqs.listaRequisitosMinimos.length) {
        try {
          pcMin = await montaPc(reqs.listaRequisitosMinimos)
          let {placa, ram, rom} = pcMin.data
          setPcMinimo([placa,ram,rom])
        } catch (error) {
          setCarrega(false)
        } 
      }
      else{
        setCarrega(false)
      }
      

      if (reqs.listaRequisitosRecomendados.length) {
        try {
          pcRec = await axios.post("http://144.22.197.132/montaPc", {requisitos:reqs.listaRequisitosRecomendados}); 
          let {placa, ram, rom} = pcRec.data
          setPcRecomendado([placa, ram, pcMin.data.rom? pcMin.data.rom : rom])
        } 
        catch (error) {
          setCarrega(false)
        } 
      }
      else{
        setCarrega(false)
      }
    }
    montaPC()
    return()=>{
      setCarrega() 
      setPcRecomendado() 
      setPcMinimo()
    }
  },[])
  
  return (
    <ImageBackground backgroundColor={Cores.secondary} source={imagemFundo} resizeMode="stretch" style={stylesGlobal.backgroundImage}>
      <View style={stylesGlobal.conteudoTela}>
        <ScrollView style={{width: '100%',paddingLeft:5, paddingRight:5}}>
          <Text style={styles.titulo}>Recomendamos esses Pcs, agora basta escolher!</Text>
          {
            pcMinimo?.length?
            <>
              { 
                pcMinimo && reqs.listaJogosSemRequisitosMinimos?.length && pcRecomendado?.length && reqs.listaJogosSemRequisitosRecomendados?.length?
                <>
                  <Text style={{...styles.txtCalculo, height: verMais? null:120}}>Os seguintes Jogos podem n??o ter sido considerados no c??lculo pois n??o possuem requisitos completos: 
                  {'\n\nCom requisitos M??nimos incompletos:'+ reqs.listaJogosSemRequisitosMinimos.map( item => {return '\n'+item.nome + ' ('+ item.campos+ ')'+ '\n'})}
                  
                  {'\nCom requisitos Recomendados incompletos:'+ reqs.listaJogosSemRequisitosRecomendados.map( item => {return '\n'+item.nome + ' ('+ item.campos+ ')'})}
                  </Text>

                  <TouchableOpacity onPress={()=>{setVerMais(verMais?false:true)}}>
                    <Text style={styles.txtVerMais}>{verMais?"Ver menos": "Ver mais"}</Text>
                  </TouchableOpacity>
                </>
                :
                pcMinimo && reqs.listaJogosSemRequisitosMinimos?.length?
                  <Text style={styles.txtCalculo}>Os seguintes Jogos podem n??o ter sido considerados no c??lculo de configura????o M??nima pois n??o possuem requisitos completos: {'\n'+ reqs.listaJogosSemRequisitosMinimos.map( item => {return '\n'+item.nome + ' ('+ item.campos+ ')'})}
                  </Text>
                :
                pcRecomendado?.length && reqs.listaJogosSemRequisitosRecomendados?.length?
                  <Text style={styles.txtCalculo}>Os seguintes Jogos podem n??o ter sido considerados no c??lculo de configura????o Recomendada pois n??o possuem requisitos completos: {'\n'+ reqs.listaJogosSemRequisitosRecomendados.map( item => {return '\n'+item.nome + ' ('+ item.campos+ ')'})}</Text>
                :
                null
              }
              {
                pcMinimo?
                  <CartaoPc pc={{pecas: pcMinimo,tipo: 'M??nima',jogos:selecionados.cart}}/>
                : 
                  null
              }
              {
                pcRecomendado?.length>0? 
                  <CartaoPc pc={{pecas: pcRecomendado, tipo: 'Recomendada',jogos:selecionados.cart}}/> 
                :
                  <ActivityIndicator animating={carrega} style={{marginTop:'50%',marginBottom:'50%'}} size={30} color={Cores.primary}/>
              }
              
            </>
            :
            carrega?
              <>
                <ActivityIndicator style={{marginTop:'auto',marginBottom:'auto'}} size={60} color={Cores.primary}/>
                <Text style={styles.txtCarregando}>J?? estamos calculando as pe??as para seus jogos...</Text>
              </>
            :
              <Text style={styles.txtCalculo}>N??o foi poss??vel realizar o c??lculo pois os jogos selecionados n??o possuem requisitos listados</Text>
          }
        </ScrollView>
      </View>
      <Rodape telas={{ anterior: 'Filtros'}} />
    </ImageBackground>
);
}

export default RecomendadosTela

const styles = StyleSheet.create({
  titulo: {
    textAlign: 'center',
    color: 'white',
    fontSize: 22,
    marginBottom: 10
  },
  carregando: {
    marginTop:'50%', 
    textAlign: 'center',
    color: 'white',
  },
  txtCarregando: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    margin:40
  },
  txtCalculo:{
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    borderWidth: 1,
    borderRadius:6,
    padding:5,
    borderColor: Cores.primary,
  },
  txtVerMais: {
    textAlign: 'center',
    fontSize: 18,
    color: Cores.primary
  }
})