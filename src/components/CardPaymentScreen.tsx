import React, { useState, useEffect } from 'react';
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

// SVG для иконки ошибки
const ErrorIcon: React.FC = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="30" stroke="#FF3B30" strokeWidth="3"/>
    <path d="M50 30L30 50" stroke="#FF3B30" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M30 30L50 50" stroke="#FF3B30" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CardPaymentScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDrink, selectedCategory, calculateTotalPrice } = useDrink();
  const emulator = useEmulator();
  
  // Состояния
  const [paymentMessage, setPaymentMessage] = useState('Приложите карту к терминалу');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
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
    
    const handlePaymentResult = (success: boolean) => {
      if (success) {
        setPaymentStatus('success');
        // Задержка перед переходом на экран приготовления
        setTimeout(() => {
          navigate('/preparation');
        }, 2000);
      } else {
        setPaymentStatus('error');
      }
      setIsProcessing(false);
    };
    
    const handleDisplayMessage = (message: string) => {
      setPaymentMessage(message);
    };
    
    // Начинаем эмуляцию оплаты
    setIsProcessing(true);
    emulator.bankCardPurchase(totalPrice, handlePaymentResult, handleDisplayMessage);
    
    // Отменяем эмуляцию при размонтировании компонента
    return () => {
      emulator.bankCardCancel();
    };
  }, [emulator, calculateTotalPrice, navigate, selectedDrink, shouldRedirect]);

  // Обработчик повторной попытки оплаты
  const handleRetry = () => {
    setPaymentStatus('pending');
    setPaymentMessage('Приложите карту к терминалу');
    setIsProcessing(true);
    
    const totalPrice = calculateTotalPrice();
    
    emulator.bankCardPurchase(
      totalPrice,
      (success) => {
        if (success) {
          setPaymentStatus('success');
          setTimeout(() => {
            navigate('/preparation');
          }, 2000);
        } else {
          setPaymentStatus('error');
        }
        setIsProcessing(false);
      },
      (message) => {
        setPaymentMessage(message);
      }
    );
  };

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
        {paymentStatus === 'pending' && (
          <>
            <CardIcon />
            <h2 className="text-2xl font-semibold my-5">{paymentMessage}</h2>
            <p className="text-lg mb-8">Сумма: {calculateTotalPrice()}₽</p>
          </>
        )}

        {paymentStatus === 'error' && (
          <>
            <ErrorIcon />
            <h2 className="text-2xl font-semibold my-5 text-red-600">Оплата не прошла</h2>
            <p className="text-base text-gray-600 mb-8 max-w-sm">Убедитесь, что на карте достаточно средств, и попробуйте еще раз</p>
            <Button 
              variant="primary"
              onClick={handleRetry}
              disabled={isProcessing}
              className="mb-5 w-full"
            >
              Попробовать еще раз
            </Button>
          </>
        )}

        <Button
          variant="secondary"
          onClick={handleCancel}
          disabled={isProcessing && paymentStatus === 'pending'}
          className="w-full mt-auto"
        >
          Отмена
        </Button>
      </div>
    </div>
  );
};

export default CardPaymentScreen; 