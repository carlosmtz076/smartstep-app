import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, Image, 
  KeyboardAvoidingView, ScrollView, Platform, Dimensions 
} from 'react-native';
import CircleProgressBar from './CircleProgressBar';

export default function ContadorPasos() {
  const inputRef = useRef(null);
  const [currentSteps] = useState(6000);
  const [objective, setObjective] = useState("10000");
  const [inputValue, setInputValue] = useState("10000"); // Estado intermedio para evitar renders en cada tecla

  const stepLimit = parseInt(objective) || 10000;
  const { height } = Dimensions.get('window');

  const metricIcons = {
    calories: require('./assets/icons/icon_calories.png'),
    distance: require('./assets/icons/icon_distance.png'),
    time: require('./assets/icons/icon_time.png'),
  };

  // 🛠 Evita renders innecesarios con un debounce (retraso en la actualización del objetivo)
  useEffect(() => {
    const timer = setTimeout(() => {
      setObjective(inputValue);
    }, 500); // Espera 500ms después del último cambio

    return () => clearTimeout(timer);
  }, [inputValue]);

  // ✅ Memoriza el progreso para evitar renders innecesarios
  const ProgressCircle = useMemo(() => (
    <CircleProgressBar 
      progress={currentSteps} 
      limit={stepLimit} 
      size={250} 
      strokeWidth={20} 
    />
  ), [stepLimit]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#EAEAEA' }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
    >
      <ScrollView 
        contentContainerStyle={[styles.scrollContainer, { minHeight: height, paddingBottom: 100 }]} 
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.container}>
          <View style={styles.topContainer}>
            {ProgressCircle}
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.objectiveContainer}>
              <Text style={styles.objectiveLabel}>Objetivo:</Text>
              <TextInput
                ref={inputRef}
                style={styles.objectiveInput}
                value={inputValue}
                onChangeText={setInputValue} // Solo cambia el estado temporal
                keyboardType="numeric"
                returnKeyType="done"
                blurOnSubmit={true} 
              />
            </View>
            <View style={styles.metricsRow}>
              <MetricItem icon={metricIcons.calories} value="0 cal" />
              <MetricItem icon={metricIcons.distance} value="0 km" />
              <MetricItem icon={metricIcons.time} value="0 h" />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ✅ Memoriza cada métrica para evitar renders innecesarios
const MetricItem = React.memo(({ icon, value }) => (
  <View style={styles.metricItem}>
    <View style={styles.iconCircle}>
      <Image source={icon} style={styles.metricIcon} />
    </View>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
));

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: { 
    top: 100,
    backgroundColor: '#EAEAEA',
  },
  topContainer: { 
    height: 300, 
    justifyContent: 'flex-end', 
    alignItems: 'center', 
    paddingBottom: 20,
  },
  bottomContainer: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    justifyContent: 'center',
  },
  objectiveContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  objectiveLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  objectiveInput: {
    fontSize: 18,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 5,
    width: '50%',
    textAlign: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  metricIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
