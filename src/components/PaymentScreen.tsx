import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { useDrink } from '../context/DrinkContext';

// SVG для иконки оплаты картой
const CardPaymentIcon: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="24" height="16" rx="2" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 13H28" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 19H10" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 19H16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// SVG для иконки оплаты наличными
const CashPaymentIcon: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="24" height="16" rx="2" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="16" cy="16" r="4" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 10H6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M26 22H23" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PaymentScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDrink, selectedCategory, calculateTotalPrice } = useDrink();

  // Если напиток не выбран, перенаправляем на экран выбора напитков
  if (!selectedDrink) {
    navigate('/drinks');
    return null;
  }

  // Обработчик выбора способа оплаты
  const handlePaymentMethodSelect = (method: 'card' | 'cash') => {
    if (method === 'card') {
      navigate('/payment/card');
    } else {
      navigate('/payment/cash');
    }
  };

  return (
    <div className={`w-full h-full flex flex-col ${selectedCategory === 'coffee' ? 'bg-coffee-bg' : selectedCategory === 'tea' ? 'bg-tea-bg' : selectedCategory === 'milkshake' ? 'bg-milkshake-bg' : 'bg-soft-drinks-bg'} transition-colors duration-300`}>
      <Header
        title="Выбор напитка"
        showBackButton={true}
        onBackClick={() => navigate('/customize')}
      />

      <div className="flex-1 flex flex-col items-center p-5">
        <h2 className="text-2xl font-semibold mb-2.5 text-center">Выберите способ оплаты</h2>
        <p className="text-lg mb-8 text-center text-gray-700">Сумма к оплате: {calculateTotalPrice()}₽</p>

        <div className="flex flex-col w-full gap-5 mb-8">
          <div
            className="flex items-center p-5 bg-white rounded-xl shadow-md cursor-pointer hover:transform hover:-translate-y-0.5 hover:shadow-lg transition duration-200"
            onClick={() => handlePaymentMethodSelect('card')}
          >
            <CardPaymentIcon />
            <span className="text-lg font-medium ml-4">Оплата картой</span>
          </div>

          <div
            className="flex items-center p-5 bg-white rounded-xl shadow-md cursor-pointer hover:transform hover:-translate-y-0.5 hover:shadow-lg transition duration-200"
            onClick={() => handlePaymentMethodSelect('cash')}
          >
            <CashPaymentIcon />
            <span className="text-lg font-medium ml-4">Оплата наличными</span>
          </div>
        </div>

        <button
          className="w-full py-4 bg-white text-black rounded border border-gray-200 hover:bg-gray-50 transition-colors duration-200 mt-auto"
          onClick={() => navigate('/customize')}
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

export default PaymentScreen; 