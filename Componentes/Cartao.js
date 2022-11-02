import {Image, StyleSheet, Text, View, ImageBackground} from 'react-native'
import React, { useState } from 'react'
import {FontAwesome5} from 'react-native-vector-icons';
import {useCart} from '../Constantes/CartContext'
import {Cores} from '../Constantes/Styles'

const Cartao = ({jogo}) => {
    const cart = useCart()
    const {id, nome, imagem, preco} = jogo
    const [estado, setEstado] = useState("circle")

    const mudaEstado = () => {
        if (jogo.estado === "circle"){
            jogo.estado = "check-circle"
            cart.addToCart(jogo)
        }
        else{
            jogo.estado = "circle"
            cart.removeToCart(id)
        }
    }
    
  return (
    <View style={styles.cartao}>
        { 
            imagem ? 
            // <View style={{borderWidth:1}}>
                <ImageBackground source={{ uri: imagem }} style={styles.imagem}>
                    <FontAwesome5 style={{
                        borderBottomLeftRadius: 10, backgroundColor: Cores.secondary, width: 'auto', marginLeft:'auto',padding:2
                        }} 
                        name={jogo.estado} size={30} color="#cccccc" onPress={mudaEstado}/>
                </ImageBackground>
                /* <Image style={styles.imagem} source={{uri: imagem}}></Image>  */
            // </View>
            : 
            <Image style={styles.imagem} source={{uri: "https://cdn-icons-png.flaticon.com/512/2140/2140618.png"}}/>
        }
        { nome ?<Text style={{fontSize: 15, textAlign: "center"}}>{nome}</Text> : null }
        {/* { preco ?<Text style={{fontSize: 20}}>Preco: {preco}</Text> : null } */}
    </View>
  )
}

export default Cartao

const styles = StyleSheet.create({
    cartao:{
        marginBottom: 4,
        backgroundColor: Cores.tertiary,
        // paddingBottom: 5,
        width: "49%",
        marginLeft:'auto',
        marginRight:'auto',
        borderRadius: 8,
        borderWidth:3
    },
    imagem:{
        height: 100,
        width: "100%",
        resizeMode:"contain"
    }
})