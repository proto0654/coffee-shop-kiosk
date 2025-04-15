import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PreparationScreen.css';
import { useDrink } from '../context/DrinkContext';
import { useEmulator } from '../context/EmulatorContext';

const PreparationScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDrink, selectedCategory } = useDrink();
  const emulator = useEmulator();
  
  // Состояния
  const [timeLeft, setTimeLeft] = useState(49); // 49 секунд на приготовление
  const [isError, setIsError] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Процент завершения для индикатора прогресса
  const progressPercent = 100 - (timeLeft / 49) * 100;
  const circumference = 2 * Math.PI * 45; // 2π * r, где r = 45
  const dashOffset = circumference - (circumference * progressPercent) / 100;

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

  // Эффект для запуска таймера и эмуляции приготовления
  useEffect(() => {
    // Если нужно перенаправить, не запускаем эмуляцию
    if (shouldRedirect || !selectedDrink) return;
    
    // Запускаем таймер
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        // Если время вышло, останавливаем таймер
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Запускаем эмуляцию приготовления напитка
    emulator.vend(selectedDrink.drink.id, (success) => {
      if (success) {
        // Если приготовление успешно, дожидаемся окончания таймера
        // и переходим на экран готовности напитка
        if (timeLeft <= 0) {
          navigate('/ready');
        }
      } else {
        // Если произошла ошибка, показываем сообщение об ошибке
        setIsError(true);
        clearInterval(timer);
      }
    });

    // Очистка таймера при размонтировании компонента
    return () => {
      clearInterval(timer);
    };
  }, [emulator, navigate, timeLeft, selectedDrink, shouldRedirect]);

  // Эффект для автоматического перехода на экран готовности
  useEffect(() => {
    // Если нужно перенаправить или есть ошибка, не выполняем действия
    if (shouldRedirect || !selectedDrink || isError || timeLeft > 0) return;
    
    navigate('/ready');
  }, [timeLeft, isError, navigate, shouldRedirect, selectedDrink]);
  
  // Если нет выбранного напитка или происходит перенаправление
  if (shouldRedirect || !selectedDrink) {
    return null;
  }

  return (
    <div className={`preparation-screen ${selectedCategory === 'coffee' ? 'coffee-bg' : 'soft-drinks-bg'}`}>
      {isError ? (
        <div className="preparation-error">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="30" stroke="#FF3B30" strokeWidth="3"/>
            <path d="M50 30L30 50" stroke="#FF3B30" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M30 30L50 50" stroke="#FF3B30" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 className="error-title">Ошибка приготовления</h2>
          <p className="error-message">К сожалению, произошла ошибка при приготовлении напитка.</p>
          <button
            className="primary-button"
            onClick={() => navigate('/drinks')}
          >
            Вернуться к выбору напитков
          </button>
        </div>
      ) : (
        <div className="preparation-content">
          <h2 className="preparation-title">Приготовление напитка</h2>
          
          <div className="timer-container">
            <svg className="progress-circle" width="150" height="150" viewBox="0 0 100 100">
              <circle className="circle-bg" cx="50" cy="50" r="45" />
              <circle
                className="circle-progress"
                cx="50"
                cy="50"
                r="45"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <div className="timer">
              {`00:${timeLeft < 10 ? '0' : ''}${timeLeft}`}
            </div>
          </div>
          
          <p className="preparation-message">
            {selectedDrink.drink.name} готовится. Пожалуйста, подождите.
          </p>
        </div>
      )}
    </div>
  );
};

export default PreparationScreen; 