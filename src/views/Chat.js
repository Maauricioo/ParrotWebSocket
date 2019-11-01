import React, { Component } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { TextInput, View, TouchableOpacity, Text, StyleSheet } from 'react-native'

export default class Chat extends Component {

    constructor(props) {
        super(props)
        this.state = {
            text: '',
            mensagens: [],
        }
    }

    cont = 0

    UNSAFE_componentWillMount() {
        this.setState({
            mensagens: [
                {
                    _id: this.cont,
                    text: 'Olá, sou o papagaio imitador, diga algo',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'Papagaio',
                    },
                },
            ],
        })
        this.cont++
    }

    enviar(texto) {
        mensagem = [
            {
                _id: this.cont,
                text: texto,
                createdAt: new Date(),
                user: {
                    _id: 1,
                    name: 'Usuario',
                },
            },
        ]

        this.cont++

        this.setState(previousState => ({
            mensagens: GiftedChat.append(previousState.mensagens, mensagem)
        }))
        this.websocket = new WebSocket('ws://echo.websocket.org')
        this.websocket.onopen = () => { this.doSend(texto) }
        this.websocket.onmessage = (evt) => { this.onMessage(evt) }
        this.websocket.onerror = (evt) => { this.onError(evt) };
        this.setState({ text: '' })
    }

    //Enviando mensagem para WebSocket
    doSend = (echo) => {
        this.websocket.send(echo)
    }

    //Recebendo resposta
    onMessage = (evt) => {
        var mensagem = [
            {
                _id: this.cont,
                text: evt.data,
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Papagaio',
                },
            },
        ]
        this.cont++
        this.setState(previousState => ({
            mensagens: GiftedChat.append(previousState.mensagens, mensagem),
        }))

        this.websocket.close()
    }

    //Tratamento de erro na conexão
    onError = (evt) => {
        alert('Ocorreu algum erro e o papagaio foi embora, verifique sua conexão com a internet')
    }

    //Input personalizado
    input = () => (
        <View style={styles.containerTextInput}>
            <View style={styles.viewTextInput}>
                <TextInput
                    style={styles.textInput}
                    onChangeText={text => this.setState({ text })}
                    value={this.state.text}
                />
            </View>
            <View style={styles.btnEnviar}>
                <TouchableOpacity onPress={() => this.enviar(this.state.text)}>
                    <Text style={styles.btnText}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

    render() {
        return (
            <GiftedChat
                messages={this.state.mensagens}
                renderInputToolbar={this.input}
                user={{
                    _id: 1,
                    name: 'Usuário'
                }}
            />
        )
    }
}

const styles = StyleSheet.create({
    containerTextInput: {
        flex: 1,
        flexDirection: 'row'
    },
    viewTextInput: {
        flex: 8
    },
    textInput: {
        height: 40,
        borderColor: '#e5e5e5',
        borderWidth: 1,
        marginLeft: 10,
        marginBottom: 10,
        borderRadius: 15,
        backgroundColor: '#e5e5e5'
    },
    btnEnviar: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginBottom: 10,
        padding: 5
    },
    btnText: {
        color: 'blue'
    }
})