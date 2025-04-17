import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { useDrink } from '../context/DrinkContext';
import Button from './common/Button';

// SVG для иконки ошибки/неудачи
const ErrorIcon: React.FC = () => (
  <svg width="130" height="130" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-red-500"
    />
    <path
      d="M15 9L9 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-red-500"
    />
    <path
      d="M9 9L15 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-red-500"
    />
  </svg>
);

const PaymentFailedScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCategory } = useDrink();

  // Обработчик возврата к выбору способа оплаты
  const handleBackToPayment = () => {
    navigate('/payment');
  };

  // Обработчик возврата к выбору напитков
  const handleBackToDrinks = () => {
    navigate('/drinks');
  };

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
      <Header title="Оплата отменена" showBackButton={false} />

      <div className="flex-1 flex flex-col items-center justify-between p-5 text-center">
        <span></span>
        <div className="flex flex-col items-center justify-center">
          <ErrorIcon />
          <h2 className="text-2xl font-semibold my-5">Оплата не выполнена</h2>
          <p className="text-lg mb-2">Операция была отменена или произошла ошибка</p>
          <p className="text-sm text-gray-600 mb-8">
            Вы можете повторить оплату или выбрать другой напиток
          </p>
        </div>
        <div className="w-full space-y-4">
          <Button variant="primary" onClick={handleBackToPayment} className="w-full">
            Повторить оплату
          </Button>
          <Button variant="secondary" onClick={handleBackToDrinks} className="w-full">
            Выбрать другой напиток
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedScreen;
