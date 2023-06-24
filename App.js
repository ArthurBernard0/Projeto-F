import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';

export default function App() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    obterUsuarios();
  }, []);

  const obterUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:8800/');
      setUsuarios(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCadastro = async () => {
    const data = {
      nome,
      email,
      telefone,
      dataNascimento,
    };

    try {
      if (modoEdicao) {
        // Atualizar usuário existente
        const response = await axios.put(`http://localhost:8800/${usuarioEditando.id}`, data);
        const usuarioAtualizado = response.data.user;

        setUsuarios(usuarios.map(usuario => {
          if (usuario.id === usuarioAtualizado.id) {
            return usuarioAtualizado;
          }
          return usuario;
        }));

        setModoEdicao(false);
        setUsuarioEditando(null);
      } else {
        // Criar novo usuário
        const response = await axios.post('http://localhost:8800/', data);
        const novoUsuario = response.data.user;

        setUsuarios([...usuarios, novoUsuario]);
      }

      limparFormulario();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditar = (usuario) => {
    setModoEdicao(true);
    setUsuarioEditando(usuario);

    setNome(usuario.nome);
    setEmail(usuario.email);
    setTelefone(usuario.telefone);
    setDataNascimento(usuario.dataNascimento);
  };

  const handleExcluir = async (usuarioId) => {
    try {
      await axios.delete(`http://localhost:8800/${usuarioId}`);

      setUsuarios(usuarios.filter(usuario => usuario.id !== usuarioId));
    } catch (error) {
      console.log(error);
    }
  };

  const limparFormulario = () => {
    setNome('');
    setEmail('');
    setTelefone('');
    setDataNascimento('');

    setModoEdicao(false);
    setUsuarioEditando(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={text => setNome(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={text => setTelefone(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento"
        value={dataNascimento}
        onChangeText={text => setDataNascimento(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>{modoEdicao ? 'Atualizar' : 'Cadastrar'}</Text>
      </TouchableOpacity>

      <Text style={styles.dadosTitle}>Dados Cadastrados:</Text>
      <FlatList
        data={usuarios}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.dadosContainer}>
            <Text>Nome: {item.nome}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Telefone: {item.telefone}</Text>
            <Text>Data de Nascimento: {item.dataNascimento}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEditar(item)}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleExcluir(item.id)}>
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4287f5',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dadosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dadosContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#f5b042',
    padding: 5,
    borderRadius: 4,
    alignItems: 'center',
    width: '45%',
  },
  deleteButton: {
    backgroundColor: '#f54242',
    padding: 5,
    borderRadius: 4,
    alignItems: 'center',
    width: '45%',
  },
});
