import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReadyScreen.css';
import { useDrink } from '../context/DrinkContext';

// SVG для иконки стаканчика кофе
const CoffeeReadyIcon: React.FC = () => (
  <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 30H80L75 110H25L20 30Z" fill="#FFFFFF" stroke="#333333" strokeWidth="2"/>
    <path d="M28 10H72L80 30H20L28 10Z" fill="#EEEEEE" stroke="#333333" strokeWidth="2"/>
    <circle cx="50" cy="70" r="20" fill="#FFD600" stroke="#333333" strokeWidth="2"/>
    <path d="M40 60L50 70L60 60" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ReadyScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDrink, selectedCategory, clearSelection } = useDrink();
  const [shouldRedirect, setShouldRedirect] = useState(false);

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

  // Эффект для автоматического возврата на начальный экран через 20 секунд
  useEffect(() => {
    if (shouldRedirect || !selectedDrink) {
      return;
    }
    
    const timer = setTimeout(() => {
      clearSelection();
      navigate('/');
    }, 20000);

    return () => clearTimeout(timer);
  }, [navigate, clearSelection, shouldRedirect, selectedDrink]);

  // Обработчик кнопки для возврата на начальный экран
  const handleReturnHome = () => {
    clearSelection();
    navigate('/');
  };

  if (shouldRedirect || !selectedDrink) {
    return null;
  }

  return (
    <div className={`w-full h-full flex justify-center items-center ${selectedCategory === 'coffee' ? 'bg-coffee-bg' : selectedCategory === 'tea' ? 'bg-tea-bg' : selectedCategory === 'milkshake' ? 'bg-milkshake-bg' : 'bg-soft-drinks-bg'} transition-colors duration-300`}>
      <div className="flex flex-col items-center justify-center text-center p-5 animate-bounce-in">
        <CoffeeReadyIcon />
        <h1 className="text-3xl font-bold my-2.5">Напиток готов!</h1>
        <p className="text-lg text-gray-800 mb-10 max-w-xs leading-relaxed">Вы можете забрать ваш {selectedDrink.drink.name} из лотка выдачи</p>
        <button
          className="w-full max-w-xs py-4 bg-coffee-bg text-black rounded border border-gray-200 hover:bg-opacity-80 transition-colors duration-200"
          onClick={handleReturnHome}
        >
          Вернуться на главный экран
        </button>
      </div>
    </div>
  );
};

export default ReadyScreen; 