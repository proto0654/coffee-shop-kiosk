import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { useDrink } from '../context/DrinkContext';
import { useEmulator } from '../context/EmulatorContext';
import Button from './common/Button';

// SVG для иконки банковской карты
const CardIcon: React.FC = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="20" width="60" height="40" rx="4" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 32.5H70" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 47.5H25" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M35 47.5H40" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CardPaymentScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDrink, selectedCategory, calculateTotalPrice } = useDrink();
  const emulator = useEmulator();
  
  // Состояния
  const [paymentMessage, setPaymentMessage] = useState('Приложите карту к терминалу(пробел для эмуляции)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  // Мемоизируем функции с помощью useCallback, чтобы избежать их пересоздания при каждом рендере
  const handlePaymentResult = useCallback((success: boolean) => {
    if (success) {
      // Сразу переходим на экран приготовления
      navigate('/preparation');
    }
    setIsProcessing(false);
  }, [navigate]);
  
  const handleDisplayMessage = useCallback((message: string) => {
    setPaymentMessage(message);
  }, []);

  // Эффект для проверки выбранного напитка и перенаправления
  useEffect(() => {
    if (!selectedDrink) {
      setShouldRedirect(true);
    }
  }, [selectedDrink]);
  
  // Эффект для перенаправления, если напиток не выбран
  useEffect(() => {
    if (shouldRedirect) {
      navigate('/drinks');
    }
  }, [shouldRedirect, navigate]);

  // Эффект для запуска эмуляции оплаты картой при монтировании компонента
  useEffect(() => {
    // Если нужно перенаправить, не запускаем эмуляцию
    if (shouldRedirect || !selectedDrink) return;
    
    const totalPrice = calculateTotalPrice();
    
    // Начинаем эмуляцию оплаты
    setIsProcessing(true);
    emulator.bankCardPurchase(totalPrice, handlePaymentResult, handleDisplayMessage);
    
    // Отменяем эмуляцию при размонтировании компонента
    return () => {
      emulator.bankCardCancel();
    };
  }, [emulator, calculateTotalPrice, navigate, selectedDrink, shouldRedirect, handlePaymentResult, handleDisplayMessage]);

  // Обработчик отмены оплаты
  const handleCancel = () => {
    emulator.bankCardCancel();
    navigate('/payment');
  };
  
  // Если нет выбранного напитка или происходит перенаправление
  if (shouldRedirect || !selectedDrink) {
    return null;
  }

  return (
    <div className={`w-full h-full flex flex-col ${selectedCategory === 'coffee' ? 'bg-coffee-bg' : selectedCategory === 'tea' ? 'bg-tea-bg' : selectedCategory === 'milkshake' ? 'bg-milkshake-bg' : 'bg-soft-drinks-bg'} transition-colors duration-300`}>
      <Header
        title="Оплата картой"
        showBackButton={true}
        onBackClick={handleCancel}
      />

      <div className="flex-1 flex flex-col items-center justify-center p-5 text-center">
        <CardIcon />
        <h2 className="text-2xl font-semibold my-5">{paymentMessage}</h2>
        <p className="text-lg mb-8">Сумма: {calculateTotalPrice()}₽</p>

        <Button
          variant="secondary"
          onClick={handleCancel}
          disabled={isProcessing}
          className="w-full mt-auto"
        >
          Отмена
        </Button>
      </div>
    </div>
  );
};

export default CardPaymentScreen; 