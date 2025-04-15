import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentScreen.css';
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
    <div className={`payment-method-screen ${selectedCategory === 'coffee' ? 'coffee-bg' : 'soft-drinks-bg'}`}>
      <Header
        title="Выбор напитка"
        showBackButton={true}
        onBackClick={() => navigate('/customize')}
      />

      <div className="payment-method-content">
        <h2 className="payment-title">Выберите способ оплаты</h2>
        <p className="payment-subtitle">Сумма к оплате: {calculateTotalPrice()}₽</p>

        <div className="payment-methods">
          <div
            className="payment-method-card"
            onClick={() => handlePaymentMethodSelect('card')}
          >
            <CardPaymentIcon />
            <span className="payment-method-name">Оплата картой</span>
          </div>

          <div
            className="payment-method-card"
            onClick={() => handlePaymentMethodSelect('cash')}
          >
            <CashPaymentIcon />
            <span className="payment-method-name">Оплата наличными</span>
          </div>
        </div>

        <button
          className="secondary-button cancel-button"
          onClick={() => navigate('/customize')}
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

export default PaymentScreen; 