// __tests__/Registro.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Registro from '../Registro'; // Ajusta la ruta si es necesario

describe('Registro Component', () => {
  test('Muestra error de validación para correo inválido', async () => {
    // Simula el objeto de navegación
    const navigation = { navigate: jest.fn(), replace: jest.fn() };

    // Renderiza el componente Registro
    const { getByPlaceholderText, getByText } = render(<Registro navigation={navigation} />);

    // Busca el input de correo electrónico
    const emailInput = getByPlaceholderText('Correo electrónico');

    // Simula el ingreso de un correo inválido y dispara el evento blur
    fireEvent.changeText(emailInput, 'correo-invalido');
    fireEvent(emailInput, 'blur');

    // Verifica que se muestre el mensaje de error esperado
    await waitFor(() => {
      expect(getByText('Correo electrónico no válido')).toBeTruthy();
    });
  });
});
