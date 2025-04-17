import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { useDrink } from '../context/DrinkContext';
import { useEmulator } from '../context/EmulatorContext';
import Button from './common/Button';

// SVG для иконки банковской карты
const CardIcon: React.FC = () => (
  <svg width="130" height="130" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="10"
      y="20"
      width="60"
      height="40"
      rx="4"
      stroke="black"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 32.5H70"
      stroke="black"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 47.5H25"
      stroke="black"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M35 47.5H40"
      stroke="black"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CardPaymentScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDrink, selectedCategory, calculateTotalPrice } = useDrink();
  const emulator = useEmulator();

  // Состояния
  const [paymentMessage, setPaymentMessage] = useState(
    'Приложите карту к терминалу (пробел для эмуляции)'
  );
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

  // Обработчик сообщений от банковского терминала
  const handleDisplayMessage = (message: string) => {
    setPaymentMessage(message);

    // Если сообщение "Обработка платежа...", то перенаправляем на экран обработки
    if (message === 'Обработка платежа...') {
      // Деактивируем колбэк перед переходом на экран обработки, чтобы он не вызывался дважды
      navigate('/payment/processing');
    }
  };

  // Обработчик начала процесса оплаты
  const startPaymentProcess = () => {
    if (shouldRedirect || !selectedDrink) return;

    const totalPrice = calculateTotalPrice();

    // Начинаем эмуляцию оплаты
    setIsProcessing(true);
    emulator.bankCardPurchase(
      totalPrice,
      () => {
        // Этот колбэк намеренно пустой, так как обработка будет в PaymentProcessingScreen
      },
      handleDisplayMessage
    );
  };

  // Эффект для запуска эмуляции оплаты картой при монтировании компонента
  useEffect(() => {
    // Если нужно перенаправить, не запускаем эмуляцию
    if (shouldRedirect || !selectedDrink) return;

    startPaymentProcess();

    // Отменяем эмуляцию при размонтировании компонента (нет необходимости)
  }, [selectedDrink, shouldRedirect]);

  // Обработчик отмены оплаты
  const handleCancel = () => {
    // Отменяем процесс оплаты в эмуляторе
    emulator.bankCardCancel();
    // Переходим на экран неудачной оплаты
    navigate('/payment/failed');
  };

  // Если нет выбранного напитка или происходит перенаправление
  if (shouldRedirect || !selectedDrink) {
    return null;
  }

  return (
    <div
      className={`w-full h-full flex flex-col ${
        selectedCategory === 'coffee'
          ? 'bg-coffee-bg'
          : selectedCategory === 'tea'
            ? 'bg-tea-bg'
            : selectedCategory === 'milkshake'
              ? 'bg-milkshake-bg'
              : 'bg-soft-drinks-bg'
      } transition-colors duration-300`}
    >
      <Header title="Оплата картой" showBackButton={true} onBackClick={handleCancel} />

      <div className="flex-1 flex flex-col items-center justify-between p-5 text-center">
        <span></span>
        <div className="flex flex-col items-center justify-center">
          <CardIcon />
          <h2 className="text-2xl font-semibold my-5">{paymentMessage}</h2>
          <p className="text-xs font-light text-gray-500 -mt-4 mb-4">
            (для эмуляции нажмите пробел)
          </p>
          <p className="text-lg mb-8">Сумма: {calculateTotalPrice()}₽</p>
        </div>
        <Button variant="secondary" onClick={handleCancel} className="w-full mb-0">
          Отмена
        </Button>
      </div>
    </div>
  );
};

export default CardPaymentScreen;
