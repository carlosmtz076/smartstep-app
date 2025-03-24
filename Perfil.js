import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Image, TextInput, TouchableOpacity, StatusBar, Alert 
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

const icons = {
  user: require('./assets/icons/icon_user.png'),
  name: require('./assets/icons/icon_name.png'),
  age: require('./assets/icons/icon_age.png'),
  weight: require('./assets/icons/icon_weight.png'),
  height: require('./assets/icons/icon_height.png'),
};

export default function Perfil() {
  const route = useRoute();
  const userId = route.params?.userId; 

  const [editable, setEditable] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileAge, setProfileAge] = useState('');
  const [profileWeight, setProfileWeight] = useState('');
  const [profileHeight, setProfileHeight] = useState('');

  const toggleEdit = () => setEditable(true);

  const saveChanges = async () => {
    try {
      const response = await fetch('http://192.168.0.11:3000/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: profileName,
          age: profileAge,
          weight: profileWeight,
          height: profileHeight,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const json = await response.json();
      //console.log("Respuesta del servidor:", json);
      if (json.success) {
        Alert.alert("Éxito", "Perfil actualizado correctamente.");
        setEditable(false);
      } else {
        Alert.alert("Error", json.error || "No se pudo actualizar el perfil.");
      }
    } catch (error) {
      Alert.alert("Error", "Error al actualizar el perfil.");
      console.error("Error en actualizar perfil:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetch(`http://192.168.0.11:3000/perfil?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.perfil) {
            setProfileName(data.perfil.name || '');
            setProfileAge(data.perfil.age || '');
            setProfileWeight(data.perfil.weight || '');
            setProfileHeight(data.perfil.height || '');
          }
        })
        .catch((error) => {
          console.error("Error al cargar perfil:", error);
        });
    }
  }, [userId]);

  const handleNumericInput = (text, setFunction, allowDecimal = false) => {
    let filteredText = text.replace(allowDecimal ? /[^0-9.]/g : /[^0-9]/g, '');
    setFunction(filteredText);
  };

  const renderField = (label, icon, value, onChangeText, isNumeric = false, allowDecimal = false) => (
    <View style={styles.fieldContainer} key={label}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Image source={icon} style={styles.fieldIcon} />
        <TextInput 
          style={styles.fieldInput} 
          editable={editable} 
          value={value}
          keyboardType={isNumeric ? 'numeric' : 'default'}
          onChangeText={(text) => isNumeric ? handleNumericInput(text, onChangeText, allowDecimal) : onChangeText(text)}
        />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#EAEAEA' }}>
      <StatusBar barStyle="light-content" backgroundColor="#2b2b2b" />
      <KeyboardAwareScrollView 
        contentContainerStyle={styles.scrollContainer} 
        extraScrollHeight={100}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Mi información</Text>
            <Image source={icons.user} style={styles.profileIcon} />
            {!editable && (
              <TouchableOpacity onPress={toggleEdit} style={styles.editButton}>
                <MaterialIcons name="edit" size={20} color="#0077CC" />
                <Text style={styles.editText}>Editar perfil</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.profileDetails}>
            {renderField('Nombre', icons.name, profileName, setProfileName)}
            {renderField('Edad', icons.age, profileAge, setProfileAge, true)}
            {renderField('Peso (kg)', icons.weight, profileWeight, setProfileWeight, true, true)}
            {renderField('Estatura (cm)', icons.height, profileHeight, setProfileHeight, true, true)}
            {editable && (
              <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 100,
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    elevation: 3,
    marginBottom: 20,
  },
  profileIcon: {
    width: 90,
    height: 90,
    marginVertical: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B3E5FC',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginTop: 10,
  },
  editText: {
    color: '#0077CC',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  profileDetails: {
    backgroundColor: '#fff',
    padding: 20,
    elevation: 3,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  fieldIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: '#666',
  },
  fieldInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
  },
  saveButton: {
    backgroundColor: '#59bd73',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
    marginHorizontal: 50,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
