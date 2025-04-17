import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { useDrink } from '../context/DrinkContext';
import { useEmulator } from '../context/EmulatorContext';
import { PAYMENT_TIMEOUT_SEC } from '../context/EmulatorContext';
import Button from './common/Button';

// SVG для иконки загрузки/ожидания
const LoadingIcon: React.FC = () => (
  <svg
    className="animate-spin h-24 w-24 text-gray-600"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const PaymentProcessingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDrink, selectedCategory, calculateTotalPrice } = useDrink();
  const emulator = useEmulator();

  // Состояние для отслеживания отмены платежа
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  // Состояние для отсчета времени
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT_SEC);
  const [isFastForwarding, setIsFastForwarding] = useState(false);

  // Обработчик пропуска таймера
  const handleSkipTimer = useCallback(() => {
    if (!paymentCancelled) {
      setIsFastForwarding(true);
      // Эмулируем успешное завершение оплаты
      if (emulator.bankCardCallbackOverride) {
        emulator.bankCardCallbackOverride(true);
      }
      navigate('/preparation');
    }
  }, [navigate, paymentCancelled, emulator]);

  // Обработчик клавиатуры для пробела
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && !paymentCancelled && !isFastForwarding) {
        e.preventDefault();
        handleSkipTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSkipTimer, paymentCancelled, isFastForwarding]);

  // Эффект для проверки выбранного напитка
  useEffect(() => {
    if (!selectedDrink) {
      navigate('/drinks');
    }
  }, [selectedDrink, navigate]);

  // Эффект для обратного отсчета
  useEffect(() => {
    if (paymentCancelled) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentCancelled]);

  // Обработчик успешной оплаты от эмулятора
  useEffect(() => {
    if (!selectedDrink || paymentCancelled) return;

    // Устанавливаем обработчик для завершения оплаты от эмулятора
    const handlePaymentCompleted = (success: boolean) => {
      if (paymentCancelled) return;
      
      if (success) {
        console.log('🔵 Эмулятор: Платеж подтвержден банком, оплата успешна');
        navigate('/preparation');
      } else {
        //console.log('🔵 Эмулятор: Платеж отклонен банком');
        navigate('/payment/failed');
      }
    };

    // Мы НЕ вызываем bankCardPurchase, так как он уже вызван на экране CardPaymentScreen
    // Вместо этого, устанавливаем обработчик напрямую
    emulator.bankCardCallbackOverride = handlePaymentCompleted;

    // При размонтировании, очищаем обработчик, только если отмена не была инициирована пользователем
    return () => {
      // Убираем наш перехватчик при уходе со страницы
      emulator.bankCardCallbackOverride = null;
    };
  }, [selectedDrink, navigate, paymentCancelled, emulator, calculateTotalPrice]);

  // Обработчик отмены оплаты
  const handleCancel = () => {
    // Отмечаем платеж как отмененный
    setPaymentCancelled(true);
    // Явно вызываем отмену платежа, что приведет к вызову нашего перехватчика с false
    emulator.bankCardCancel();
    // Переходим на экран неудачной оплаты
    navigate('/payment/failed');
  };

  // Если нет выбранного напитка
  if (!selectedDrink) {
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
      <Header title="Обработка платежа" showBackButton={false} />

      <div className="flex-1 flex flex-col items-center justify-between p-5 text-center">
        <span></span>
        <div className="flex flex-col items-center justify-center">
          <LoadingIcon />
          <h2 className="text-2xl font-semibold my-5">Ожидание подтверждения от банка</h2>
          <p className="text-lg mb-8">Сумма: {calculateTotalPrice()}₽</p>
          <p className="text-sm text-gray-600 mb-4">Пожалуйста, подождите...</p>
          <p className="text-xs text-gray-500 mb-4">
            Вы можете отменить платеж или он будет обработан автоматически через {timeLeft} {timeLeft === 1 ? 'секунду' : timeLeft > 1 && timeLeft < 5 ? 'секунды' : 'секунд'}
          </p>
          <p className="text-xs text-gray-500">
            Нажмите пробел для пропуска ожидания
          </p>
        </div>
        <Button variant="secondary" onClick={handleCancel} className="w-full mb-0">
          Отмена
        </Button>
      </div>
    </div>
  );
};

export default PaymentProcessingScreen;
