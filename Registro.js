import React, { useState } from 'react';
import { 
  StyleSheet, Text, TextInput, View, Pressable, Image, 
  KeyboardAvoidingView, ScrollView, Platform, Alert, Keyboard 
} from 'react-native';

const registerUser = async (name, email, password, navigation) => {
  try {
    const response = await fetch('http://192.168.0.11:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await response.json();
    if (json.success) {
      Alert.alert("Éxito", "Usuario registrado correctamente.");
      Keyboard.dismiss();
      // Pasa el userId a MenuNavegacion
      setTimeout(() => navigation.replace('MenuNavegacion', { userId: json.id }), 100);
    } else {
      Alert.alert("Error", json.error || "No se pudo registrar.");
    }
  } catch (error) {
    Alert.alert("Error", "Hubo un problema con el registro.");
    console.error("Error en la solicitud:", error);
  }
};

export default function Registro({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);

  const handleNameChange = (text) => {
    const filteredText = text.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
    setName(filteredText);
  };

  const validateEmail = (text) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (text === "" || regex.test(text)) {
      setEmailError("");
    } else {
      setEmailError("Correo electrónico no válido");
    }
  };

  const validatePassword = (text) => {
    if (text.length > 8) {
      setPasswordError("");
    } else {
      setPasswordError("La contraseña debe tener más de 8 caracteres");
    }
  };

  const handleEmailBlur = () => {
    setShowEmailError(true);
    validateEmail(email);
  };

  const handlePasswordBlur = () => {
    setShowPasswordError(true);
    validatePassword(password);
  };

  const handleRegister = () => {
    setShowEmailError(true);
    setShowPasswordError(true);

    validateEmail(email);
    validatePassword(password);

    if (!name || !email || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    if (emailError || passwordError) {
      Alert.alert("Error", "Por favor corrija la información");
      return;
    }
    registerUser(name, email, password, navigation);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={require('./assets/images/waves2.png')} style={styles.image} />
            <Image source={require('./assets/images/logo.png')} style={styles.logo} />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>Registro</Text>

            {/* Campo Nombre */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor="#aaa"
                autoCapitalize="words"
                value={name}
                onChangeText={handleNameChange}
              />
            </View>

            {/* Campo Correo */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onBlur={handleEmailBlur}
              />
              {showEmailError && emailError !== "" && (
                <Text style={styles.errorText}>{emailError}</Text>
              )}
            </View>

            {/* Campo Contraseña */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#aaa"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                onBlur={handlePasswordBlur}
              />
              {showPasswordError && passwordError !== "" && (
                <Text style={styles.errorText}>{passwordError}</Text>
              )}
            </View>

            <Pressable style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Registrar</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>¿Ya tienes una cuenta? Inicia sesión</Text>
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
    top: 50,
    alignSelf: 'center',
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: -130, // Ajusta según sea necesario para subir el contenido
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2b2b2b',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#007BFF',
    fontSize: 14,
    marginTop: 10,
  },
});
