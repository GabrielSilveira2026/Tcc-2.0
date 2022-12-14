import axios from "axios";
import {parse} from 'himalaya'

const regex = /[^0-9a-zA-Z() " : , { } @ . / -]/gi

const enderecoBackend = "http://144.22.197.132"

export function extraiRequisitosDeUmaLista(listaDeJogos){
  let listaRequisitosMinimos = []
  let listaRequisitosRecomendados = []
  let listaJogosSemRequisitosMinimos = []
  let listaJogosSemRequisitosRecomendados = []
  for (let jogo of listaDeJogos) {
    if (jogo.requisitosminimos) {
      let anotaNome
      let campos = []
      let requisitosJson = JSON.parse(jogo.requisitosminimos)
      for (const campo in requisitosJson) {
          if(requisitosJson[campo] === 'undefined'){
            anotaNome = jogo.nome
            campos.push(campo)
            delete requisitosJson[campo]
          }
      }
      anotaNome?listaJogosSemRequisitosMinimos.push({nome: anotaNome, campos:campos.length<4?campos:["Sem requisitos minimos"]}):null
      
      JSON.stringify(requisitosJson) !=="{}"?
        listaRequisitosMinimos.push(requisitosJson)
      :
        null
    }
    else{
      listaJogosSemRequisitosMinimos.push({nome: jogo.nome, campos:["Sem requisitos mínimos"]})
    }

    if (jogo.requisitosrecomendados) {
      let anotaNome
      let campos = []
      let requisitosJson = JSON.parse(jogo.requisitosrecomendados)
      for (const campo in requisitosJson) {
          if(requisitosJson[campo] === 'undefined'){
            anotaNome = jogo.nome
            campos.push(campo)
            delete requisitosJson[campo]
          }
      }
      anotaNome?listaJogosSemRequisitosRecomendados.push({nome: anotaNome, campos:campos.length<4?campos:["Sem requisitos recomendados"]}):null
      
      JSON.stringify(requisitosJson) !=="{}"?
        listaRequisitosRecomendados.push(requisitosJson)
      :
        null
    }
    else{
      listaJogosSemRequisitosRecomendados.push({nome: jogo.nome, campos:["Sem requisitos Recomendados"]})
    }
  }
  return {listaRequisitosMinimos, listaRequisitosRecomendados, listaJogosSemRequisitosMinimos, listaJogosSemRequisitosRecomendados}
}

export function validaNome(nome){
  return nome.length > 2
}

export function validaEmail(email) {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{3,4}$/g
  return(regex.test(email))
}

export function validaSenha(senha){
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/
  return(regex.test(senha))
}

export function consultaBanco(){
  return axios.get("https://g4673849dbf8477-qwkkduaklu8amhgz.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/jogo_tb/?limit=9999")
}

export function montaPc(requisitos){
  return axios.post(`${enderecoBackend}/montaPc`, {requisitos:requisitos})
}

export function cadastraUsuario(usuario){
  return axios.post(`${enderecoBackend}/usuario/cadastro`, {usuario:usuario})
}

export function autenticaUsuario(usuario){
  return axios.post(`${enderecoBackend}/usuario/autentica`, {usuario:usuario})
}

export function favoritaPc(token, usuario, configSalva){
  return axios.post({usuario,configSalva},{headers:{token:token}})
}

export function validaToken(tokenjwt){
  return axios.post(`${enderecoBackend}/usuario/validaToken`, {}, {headers:{tokenjwt :tokenjwt}})
}