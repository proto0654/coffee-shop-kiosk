import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CashPaymentScreen.css';
import Header from './Header';
import { useDrink } from '../context/DrinkContext';
import { useEmulator } from '../context/EmulatorContext';

// SVG для иконки наличных денег
const CashIcon: React.FC = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <circle
      cx="40"
      cy="40"
      r="12"
      stroke="black"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 26H18"
      stroke="black"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M62 54H58"
      stroke="black"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CashPaymentScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDrink, selectedCategory, calculateTotalPrice } = useDrink();
  const emulator = useEmulator();

  // Состояния
  const [insertedAmount, setInsertedAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Рассчитываем итоговую сумму и сдачу
  const totalPrice = calculateTotalPrice();
  const remainingAmount = Math.max(0, totalPrice - insertedAmount);
  const changeAmount = Math.max(0, insertedAmount - totalPrice);

  // Эффект для проверки наличия выбранного напитка
  useEffect(() => {
    if (!selectedDrink) {
      setShouldRedirect(true);
    }
  }, [selectedDrink]);

  // Эффект для перенаправления на экран выбора напитков
  useEffect(() => {
    if (shouldRedirect) {
      navigate('/drinks');
    }
  }, [shouldRedirect, navigate]);

  // Эффект для запуска эмуляции приема наличных при монтировании компонента
  useEffect(() => {
    // Если нужно перенаправить, не запускаем эмуляцию
    if (shouldRedirect || !selectedDrink) return;

    const handleCashInserted = (amount: number) => {
      setInsertedAmount(prev => prev + amount);
    };

    // Начинаем эмуляцию приема наличных
    emulator.startCashin(handleCashInserted);

    // Отменяем эмуляцию при размонтировании компонента
    return () => {
      emulator.stopCashin(() => {});
    };
  }, [emulator, shouldRedirect, selectedDrink]);

  // Эффект для автоматического перехода на экран приготовления при достаточной сумме
  useEffect(() => {
    // Если нужно перенаправить или недостаточно денег, не выполняем действия
    if (shouldRedirect || !selectedDrink || insertedAmount < totalPrice || paymentComplete) return;

    setPaymentComplete(true);
    setIsProcessing(true);

    // Останавливаем прием наличных
    emulator.stopCashin(() => {
      // Задержка перед переходом на экран приготовления
      setTimeout(() => {
        navigate('/preparation');
      }, 2000);
    });
  }, [
    insertedAmount,
    totalPrice,
    paymentComplete,
    emulator,
    navigate,
    shouldRedirect,
    selectedDrink,
  ]);

  // Обработчик отмены оплаты
  const handleCancel = () => {
    emulator.stopCashin(() => {});
    navigate('/payment');
  };

  // Если нет выбранного напитка или происходит перенаправление
  if (shouldRedirect || !selectedDrink) {
    return null;
  }

  return (
    <div
      className={`w-full h-full flex flex-col ${selectedCategory === 'coffee' ? 'bg-coffee-bg' : selectedCategory === 'tea' ? 'bg-tea-bg' : selectedCategory === 'milkshake' ? 'bg-milkshake-bg' : 'bg-soft-drinks-bg'} transition-colors duration-300`}
    >
      <Header title="Оплата наличными" showBackButton={true} onBackClick={handleCancel} />

      <div className="cash-payment-content">
        <CashIcon />

        <div className="payment-info">
          <div className="payment-row">
            <span className="payment-label">Сумма к оплате:</span>
            <span className="payment-value">{totalPrice}₽</span>
          </div>

          <div className="payment-row">
            <span className="payment-label">Внесено:</span>
            <span className="payment-value">{insertedAmount}₽</span>
          </div>

          {remainingAmount > 0 ? (
            <div className="payment-row highlight">
              <span className="payment-label">Осталось внести:</span>
              <span className="payment-value">{remainingAmount}₽</span>
            </div>
          ) : (
            <div className="payment-row highlight">
              <span className="payment-label">Сдача:</span>
              <span className="payment-value">{changeAmount}₽</span>
            </div>
          )}
        </div>

        <p className="payment-instruction">
          {paymentComplete ? (
            'Оплата принята. Подготовка напитка...'
          ) : (
            <span>
              Вставьте купюры в приемник наличных.
              <br />
              (Нажмите <b>1</b> для вставки 1₽, <b>5</b> для 5₽, <b>0</b> для 10₽, <b>Пробел</b> для
              100₽)
            </span>
          )}
        </p>

        <button
          className="secondary-button cancel-button"
          onClick={handleCancel}
          disabled={isProcessing}
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

export default CashPaymentScreen;
