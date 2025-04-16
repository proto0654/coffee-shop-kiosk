import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReadyScreen.css';
import { useDrink } from '../context/DrinkContext';

// SVG для иконки стаканчика кофе
const CoffeeReadyIcon: React.FC = () => (
  <svg
    width="160"
    height="160"
    viewBox="0 0 249 249"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M68.015 40.7004L63.3027 39.3162L67.2296 25.5722C67.7341 23.8094 68.819 22.2686 70.3086 21.1995C71.7982 20.1304 73.6052 19.5956 75.4367 19.6819L181.187 26.6913C183.023 26.7993 184.446 28.5173 184.8 31.0599L185.782 38.6682L180.873 39.326L179.891 31.7177V31.5214L75.1422 24.5904C74.418 24.578 73.7107 24.8094 73.1338 25.2474C72.557 25.6854 72.1441 26.3046 71.9615 27.0055L68.015 40.7004Z"
      fill="black"
    />
    <path
      d="M195.43 59.9911H53.5915C53.1652 59.9908 52.7449 59.8902 52.3646 59.6975C51.9843 59.5048 51.6547 59.2254 51.4023 58.8818C51.1494 58.53 50.983 58.1236 50.9165 57.6955C50.85 57.2674 50.8852 56.8296 51.0194 56.4177L56.0163 41.2207C56.3754 40.1293 57.0656 39.1769 57.9911 38.496C58.9166 37.815 60.0313 37.4395 61.1801 37.4215H187.821C188.97 37.4395 190.085 37.815 191.01 38.496C191.936 39.1769 192.626 40.1293 192.985 41.2207L197.982 56.4079C198.116 56.8198 198.152 57.2576 198.085 57.6857C198.019 58.1138 197.852 58.5202 197.599 58.872C197.352 59.217 197.027 59.4984 196.649 59.6929C196.272 59.8875 195.854 59.9897 195.43 59.9911ZM56.625 55.0826H192.396L188.322 42.7522C188.289 42.6408 188.223 42.5416 188.135 42.4667C188.046 42.3917 187.937 42.3442 187.821 42.3301H61.1801C61.0647 42.3442 60.9559 42.3917 60.867 42.4667C60.7781 42.5416 60.7129 42.6408 60.6795 42.7522L56.625 55.0826Z"
      fill="black"
    />
    <path
      d="M165.744 229.327H83.2799C81.9981 229.325 80.7612 228.855 79.8014 228.006C78.8416 227.156 78.2249 225.985 78.067 224.713L57.667 57.9691L62.5756 57.3801L82.9167 224.115C82.9264 224.199 82.9668 224.276 83.0302 224.333C83.0937 224.389 83.1756 224.419 83.2603 224.419H165.724C165.809 224.419 165.891 224.389 165.954 224.333C166.018 224.276 166.058 224.199 166.068 224.115L186.478 57.3408L191.386 57.9298L170.977 224.713C170.818 225.989 170.199 227.162 169.235 228.012C168.271 228.862 167.029 229.33 165.744 229.327Z"
      fill="black"
    />
    <path d="M183.77 100.486H65.3457L75.5261 183.598H173.58L183.77 100.486Z" fill="black" />
    <path
      d="M124.552 173.949C142.173 173.949 156.458 159.664 156.458 142.043C156.458 124.422 142.173 110.137 124.552 110.137C106.931 110.137 92.6465 124.422 92.6465 142.043C92.6465 159.664 106.931 173.949 124.552 173.949Z"
      fill="white"
    />
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
      navigate('/drinks');
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
    <div
      className={`w-full h-full flex justify-center items-center ${
        selectedCategory === 'coffee'
          ? 'bg-coffee-bg'
          : selectedCategory === 'tea'
            ? 'bg-tea-bg'
            : selectedCategory === 'milkshake'
              ? 'bg-milkshake-bg'
              : 'bg-soft-drinks-bg'
      } transition-colors duration-300`}
    >
      <div className="flex flex-col items-center justify-center text-center p-5 animate-bounce-in">
        <CoffeeReadyIcon />
        <h1 className="text-3xl font-bold my-2.5">Напиток готов!</h1>
        <p className="text-lg text-gray-800 mb-10 max-w-xs leading-relaxed">
          Вы можете забрать ваш {selectedDrink.drink.name} из лотка выдачи
        </p>
        <button
          className="w-full max-w-xs py-4 text-black rounded-2xl bg-white border border-gray-200 hover:bg-opacity-80 transition-colors duration-200"
          onClick={handleReturnHome}
        >
          Вернуться на главный экран
        </button>
      </div>
    </div>
  );
};

export default ReadyScreen;
