import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, TextInput, Animated, Easing, KeyboardAvoidingView, ScrollView, Platform 
} from 'react-native';

export default function DistribucionFuerza() {
  // Estado para almacenar los dígitos en formato "MMSS" (por defecto "0000")
  const [digits, setDigits] = useState("0000");
  // Estado para controlar si se está analizando o pausado
  const [analyzing, setAnalyzing] = useState(false);
  // Estado para el contador de segundos restantes
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  // Animated values para la línea de escaneo y el color del icono
  const scanAnim = useRef(new Animated.Value(0)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;
  const scanAnimRef = useRef(null);
  const countdownInterval = useRef(null);
  
  const iconContainerHeight = 200; // No modificar

  // Función para convertir segundos a dígitos "MMSS"
  const secondsToDigits = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return minutes.toString().padStart(2, '0') + seconds.toString().padStart(2, '0');
  };

  // Formatea los dígitos a "MM:SS"
  const formatTime = (digs) => {
    return digs.slice(0, 2) + ":" + digs.slice(2);
  };

  // onKeyPress: captura cada tecla numérica o Backspace (con verificación)
  const handleKeyPress = ({ nativeEvent }) => {
    if (!nativeEvent || !nativeEvent.key) return;
    const key = nativeEvent.key;
    if (/[0-9]/.test(key)) {
      setDigits(prev => prev.slice(1) + key);
    } else if (key === "Backspace") {
      setDigits(prev => "0" + prev.slice(0,3));
    }
  };

  // Botones para incrementar o decrementar los minutos (dos primeros dígitos)
  const incrementTime = () => {
    const currentMinutes = parseInt(digits.slice(0,2), 10);
    const newMinutes = currentMinutes + 1;
    const seconds = digits.slice(2);
    const newDigits = newMinutes.toString().padStart(2, '0') + seconds;
    setDigits(newDigits.slice(-4));
  };

  const decrementTime = () => {
    const currentMinutes = parseInt(digits.slice(0,2), 10);
    const newMinutes = currentMinutes > 0 ? currentMinutes - 1 : 0;
    const seconds = digits.slice(2);
    const newDigits = newMinutes.toString().padStart(2, '0') + seconds;
    setDigits(newDigits.slice(-4));
  };

  // Calcula la duración de la animación en milisegundos a partir del tiempo ingresado
  const getDuration = () => {
    const minutes = parseInt(digits.slice(0,2), 10);
    const seconds = parseInt(digits.slice(2), 10);
    let totalSeconds = minutes * 60 + seconds;
    if (totalSeconds === 0) totalSeconds = 1; // mínimo 1 segundo
    return totalSeconds * 1000;
  };

  // Función que inicia la animación (como antes)
  const startAnimation = () => {
    const duration = getDuration();

    // Animación continua de la línea: ciclo fijo de 2000ms (1s bajando y 1s subiendo)
    scanAnim.setValue(0);
    scanAnimRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    );
    scanAnimRef.current.start();

    // Animación del color del icono: duración basada en el tiempo ingresado
    iconAnim.setValue(0);
    Animated.timing(iconAnim, {
      toValue: 1,
      duration: getDuration(),
      easing: Easing.linear,
      useNativeDriver: false, // para la interpolación de color
    }).start(() => {
      if (scanAnimRef.current) {
        scanAnimRef.current.stop();
      }
      clearInterval(countdownInterval.current);
      setAnalyzing(false);
    });
  };

  // Función para alternar entre analizar y pausar
  const toggleAnalysis = () => {
    if (!analyzing) {
      const durationMs = getDuration();
      const totalSecs = durationMs / 1000;
      setRemainingSeconds(totalSecs);
      setDigits(secondsToDigits(totalSecs));
      startAnimation();
      setAnalyzing(true);
      countdownInterval.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval.current);
            setAnalyzing(false);
            return 0;
          } else {
            const newVal = prev - 1;
            setDigits(secondsToDigits(newVal));
            return newVal;
          }
        });
      }, 1000);
    } else {
      if (scanAnimRef.current) {
        scanAnimRef.current.stop();
      }
      iconAnim.stopAnimation();
      clearInterval(countdownInterval.current);
      setAnalyzing(false);
    }
  };

  // Interpolación para la posición vertical de la línea (de 0 a (height - 2))
  const lineTop = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, iconContainerHeight - 2],
  });

  // Interpolación para el color del icono: de original a negro y de vuelta
  const iconTint = iconAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#4a4a4a', 'black', '#4a4a4a'],
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#EAEAEA' }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#2b2b2b" />
          
          {/* Mitad superior: Solo la imagen del icono y la línea de escaneo */}
          <View style={styles.topContainer}>
            <View style={[styles.iconContainer, { height: iconContainerHeight }]}>
              <Animated.Image 
                source={require('./assets/icons/icon_insoles.png')} 
                style={[styles.topImage, { tintColor: iconTint }]} 
              />
              <Animated.View style={[styles.scanLine, { top: lineTop }]} />
            </View>
          </View>
          
          {/* Mitad inferior: Contenedor con campo de tiempo, botones y botón Analizar */}
          <View style={styles.bottomContainer}>
            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>Minutos</Text>
              <View style={styles.timeInputRow}>
                <TouchableOpacity onPress={decrementTime} style={styles.adjustButton}>
                  <Text style={styles.adjustButtonText}>–</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.timeInput}
                  value={formatTime(digits)}
                  onKeyPress={handleKeyPress}
                  keyboardType="numeric"
                  maxLength={5} // "MM:SS" tiene 5 caracteres
                />
                <TouchableOpacity onPress={incrementTime} style={styles.adjustButton}>
                  <Text style={styles.adjustButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.analyzeButton} onPress={toggleAnalysis}>
              <Text style={styles.analyzeButtonText}>{analyzing ? "Pausar" : "Analizar"}</Text>
            </TouchableOpacity>
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>Mensaje</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#EAEAEA',
    paddingBottom: 100, // Para evitar solapamiento con el tab navigator
  },
  topContainer: {
    top: 50,
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    width: '60%',
    height: '100%',
    resizeMode: 'cover',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'white',
  },
  bottomContainer: {
    flex: 0.3, // Menos altura para el contenedor inferior
    backgroundColor: '#fff',
    borderRadius: 10, 
    padding: 20,
    marginHorizontal: 20,
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adjustButton: {
    backgroundColor: '#ddd',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustButtonText: {
    fontSize: 24,
    color: '#333',
  },
  timeInput: {
    marginHorizontal: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    width: 80,
  },
  analyzeButton: {
    backgroundColor: '#00AAFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
});
