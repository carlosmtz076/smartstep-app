import React, { useState } from 'react';
import { 
  StyleSheet, Text, TextInput, View, Pressable, Image, 
  KeyboardAvoidingView, ScrollView, Platform, Alert, Keyboard 
} from 'react-native';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.11:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();
      //console.log("Respuesta del servidor:", json);

      if (json.success) {
        Keyboard.dismiss();
        // Se pasa el userId a MenuNavegacion
        setTimeout(() => navigation.replace('MenuNavegacion', { userId: json.id }), 100);
      } else {
        Alert.alert('Error', 'Correo o contraseña incorrectos');
      }
    } catch (error) {
      Alert.alert('Error', 'Error en el servidor');
      console.error('Error en el login:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={require('./assets/images/waves1.png')} style={styles.image} />
            <Image source={require('./assets/images/logo.png')} style={styles.logo} />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>Inicio de Sesión</Text>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#aaa"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Registro')}>
              <Text style={styles.linkText}>¿No tienes una cuenta? Regístrate</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    height: 400,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logo: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: -80, // Eleva el contenedor del formulario
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#2b2b2b',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
    marginTop: 70,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#007BFF',
    fontSize: 14,
    alignSelf: 'center',
    marginTop: 10,
  },
});
