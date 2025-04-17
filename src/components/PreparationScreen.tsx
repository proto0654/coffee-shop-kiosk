import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './PreparationScreen.css';
import { useDrink } from '../context/DrinkContext';
import { useEmulator } from '../context/EmulatorContext';

const PreparationScreen: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDrink, selectedCategory } = useDrink();
  const emulator = useEmulator();

  // Состояния
  const [timeLeft, setTimeLeft] = useState(60); // 60 секунд (1 минута) на приготовление
  const [isError, setIsError] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const [isVendingSuccessful, setIsVendingSuccessful] = useState<boolean | null>(null);

  // Процент завершения для индикатора прогресса
  const progressPercent = 100 - (timeLeft / 60) * 100;
  const circumference = 2 * Math.PI * 45; // 2π * r, где r = 45
  const dashOffset = circumference - (circumference * progressPercent) / 100;

  // Угол поворота для шарика-индикатора (от 0 до 360 градусов)
  const dotRotation = progressPercent * 3.6; // 3.6 = 360 / 100

  // Обработчик нажатия пробела для ускорения таймера
  const handleSkipTimer = useCallback(() => {
    setIsFastForwarding(true);
    // Запускаем быстрое уменьшение таймера
    const fastTimer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 2) {
          clearInterval(fastTimer);
          navigate('/ready');
          return 0;
        }
        // Быстрее уменьшаем время
        return prevTime - 5;
      });
    }, 100); // Более быстрый интервал

    return () => clearInterval(fastTimer);
  }, [navigate]);

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

  // Обработчик клавиатуры для пробела
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && !isError && !isFastForwarding) {
        e.preventDefault();
        handleSkipTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSkipTimer, isError, isFastForwarding]);

  // Эффект для запуска таймера и эмуляции приготовления
  useEffect(() => {
    // Если нужно перенаправить или уже выполняется быстрая перемотка, не запускаем эмуляцию
    if (shouldRedirect || !selectedDrink || isFastForwarding) return;

    // Запускаем таймер
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        // Если время вышло, останавливаем таймер
        if (prevTime <= 1) {
          clearInterval(timer);
          // Автоматически устанавливаем успешное приготовление, когда таймер достиг 0
          if (isVendingSuccessful === null) {
            setIsVendingSuccessful(true);
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Запускаем эмуляцию приготовления напитка
    emulator.vend(selectedDrink.drink.id, success => {
      if (success) {
        // Если приготовление успешно, устанавливаем флаг успешности
        setIsVendingSuccessful(true);
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
  }, [emulator, navigate, selectedDrink, shouldRedirect, isFastForwarding]);

  // Эффект для автоматического перехода на экран готовности
  useEffect(() => {
    // Если нужно перенаправить или есть ошибка, не выполняем действия
    if (shouldRedirect || !selectedDrink || isError || timeLeft > 0) return;

    // Проверяем, что напиток успешно приготовлен
    if (isVendingSuccessful) {
      navigate('/ready');
    }
  }, [timeLeft, isError, navigate, shouldRedirect, selectedDrink, isVendingSuccessful]);

  // Если нет выбранного напитка или происходит перенаправление
  if (shouldRedirect || !selectedDrink) {
    return null;
  }

  return (
    <div className="w-full h-full flex justify-center items-center bg-white relative">
      {isError ? (
        <div className="flex flex-col items-center justify-center text-center p-5">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="40" cy="40" r="30" stroke="#FF3B30" strokeWidth="3" />
            <path
              d="M50 30L30 50"
              stroke="#FF3B30"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M30 30L50 50"
              stroke="#FF3B30"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 className="text-2xl font-semibold my-4 text-red-600">Ошибка приготовления</h2>
          <p className="text-base text-gray-600 mb-8 max-w-sm">
            К сожалению, произошла ошибка при приготовлении напитка.
          </p>
          <button
            className="w-full max-w-xs py-4 bg-coffee-bg text-black rounded border border-gray-200 hover:bg-opacity-80 transition-colors duration-200"
            onClick={() => navigate('/drinks')}
          >
            Вернуться к выбору напитков
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-5">
          <div className="relative w-[300px] h-[300px]">
            {/* Фоновая окружность */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle className="fill-none stroke-gray-200 stroke-[1.5]" cx="50" cy="50" r="45" />

              {/* Прогресс-окружность */}
              <circle
                className="fill-none stroke-yellow-400 stroke-[1.5] rounded-full"
                cx="50"
                cy="50"
                r="45"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{
                  transition: isFastForwarding
                    ? 'stroke-dashoffset 2s linear'
                    : 'stroke-dashoffset 1s linear',
                }}
              />
            </svg>

            {/* Шарик-индикатор на окружности */}
            <div
              className="dot-indicator-container"
              style={{
                transform: `translate(-50%, -50%) rotate(${dotRotation}deg)`,
                transition: isFastForwarding ? 'transform 2s linear' : 'transform 1s linear',
              }}
            >
              <div
                className="absolute top-0 left-1/2 w-4 h-4 bg-yellow-400 rounded-full"
                style={{
                  transform: 'translateX(-50%)',
                  boxShadow: '0 0 4px 1px rgba(255, 214, 0, 0.6)',
                }}
              ></div>
            </div>

            {/* Таймер в центре */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="tracking-wider">{`00:${timeLeft < 10 ? '0' : ''}${timeLeft}`}</div>
              <div className="text-gray-500 mt-2 text-sm">
                Приготовление <br></br>напитка
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Надпись внизу экрана */}
      {!isError && (
        <div className="absolute bottom-6 left-0 right-0 text-center text-gray-500 text-sm">
          Для пропуска таймера нажмите пробел
        </div>
      )}
    </div>
  );
};

export default PreparationScreen;
