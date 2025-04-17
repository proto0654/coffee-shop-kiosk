import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { EmulatorInterface } from '../types/types';

// Константы для таймеров
export const PAYMENT_TIMEOUT_MS = 10000;
export const PAYMENT_TIMEOUT_SEC = PAYMENT_TIMEOUT_MS / 1000;

const EmulatorContext = createContext<EmulatorInterface | undefined>(undefined);

export const useEmulator = (): EmulatorInterface => {
  const context = useContext(EmulatorContext);
  if (context === undefined) {
    throw new Error('useEmulator must be used within an EmulatorProvider');
  }
  return context;
};

export const EmulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cashInsertCallbackRef = useRef<((amount: number) => void) | null>(null);
  const bankCardCallbackRef = useRef<((success: boolean) => void) | null>(null);
  const bankCardDisplayCallbackRef = useRef<((message: string) => void) | null>(null);
  const vendCallbackRef = useRef<((success: boolean) => void) | null>(null);
  const bankCardCallbackOverrideRef = useRef<((success: boolean) => void) | null>(null);
  const paymentCancelledRef = useRef<boolean>(false);

  const [isCardPaymentActive, setIsCardPaymentActive] = useState(false);

  const startCashin = useCallback((callback: (amount: number) => void) => {
    cashInsertCallbackRef.current = callback;
    console.log(
      '🔵 Эмулятор: Режим приема наличных активирован. Используйте Ctrl+1 для вставки 100₽, Ctrl+2 для 200₽'
    );
  }, []);

  const stopCashin = useCallback((callback: () => void) => {
    cashInsertCallbackRef.current = null;
    callback();
    console.log('🔵 Эмулятор: Режим приема наличных остановлен');
  }, []);

  const bankCardPurchase = useCallback(
    (
      amount: number,
      callback: (success: boolean) => void,
      displayCallback: (message: string) => void
    ) => {
      bankCardCallbackRef.current = callback;
      bankCardDisplayCallbackRef.current = displayCallback;
      displayCallback('Приложите карту к терминалу');
      setIsCardPaymentActive(true);
      paymentCancelledRef.current = false;
      console.log(
        `🔵 Эмулятор: Режим оплаты картой активирован на сумму ${amount}₽. Используйте пробел для приложения карты.`
      );
    },
    []
  );

  const bankCardCancel = useCallback(() => {
    if (bankCardCallbackRef.current) {
      paymentCancelledRef.current = true;
      if (bankCardCallbackOverrideRef.current) {
        bankCardCallbackOverrideRef.current(false);
      } else {
        bankCardCallbackRef.current(false);
      }
      bankCardCallbackRef.current = null;
      bankCardDisplayCallbackRef.current = null;
      setIsCardPaymentActive(false);
      console.log('🔵 Эмулятор: Оплата картой отменена');
    }
  }, []);

  const vend = useCallback((productIdx: number, callback: (success: boolean) => void) => {
    vendCallbackRef.current = callback;
    setIsCardPaymentActive(false);
    console.log(
      `🔵 Эмулятор: Приготовление напитка #${productIdx} начато. Используйте Ctrl+P для успешного приготовления, Ctrl+E для ошибки`
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cashInsertCallbackRef.current) {
        if (e.key === '1') {
          cashInsertCallbackRef.current(1);
          console.log('🔵 Эмулятор: Вставлено 1₽');
        } else if (e.key === '5') {
          cashInsertCallbackRef.current(5);
          console.log('🔵 Эмулятор: Вставлено 5₽');
        } else if (e.key === '0') {
          cashInsertCallbackRef.current(10);
          console.log('🔵 Эмулятор: Вставлено 10₽');
        } else if (e.key === ' ') {
          cashInsertCallbackRef.current(100);
          console.log('🔵 Эмулятор: Вставлено 100₽');
        }
      }

      if (
        isCardPaymentActive &&
        bankCardCallbackRef.current &&
        e.key === ' ' &&
        !cashInsertCallbackRef.current
      ) {
        if (bankCardDisplayCallbackRef.current) {
          bankCardDisplayCallbackRef.current('Обработка платежа...');
          console.log('🔵 Эмулятор: Карта приложена, перенаправление на экран обработки');

          const callback = bankCardCallbackRef.current;
          const displayCallback = bankCardDisplayCallbackRef.current;

          setTimeout(() => {
            if (!paymentCancelledRef.current) {
              if (displayCallback) {
                displayCallback('Оплата успешна');
              }
              if (callback) {
                if (bankCardCallbackOverrideRef.current) {
                  bankCardCallbackOverrideRef.current(true);
                } else {
                  callback(true);
                }
                bankCardCallbackRef.current = null;
                bankCardDisplayCallbackRef.current = null;
              }
              setIsCardPaymentActive(false);
              console.log('🔵 Эмулятор: Оплата картой успешна');
            }
          }, PAYMENT_TIMEOUT_MS);
        }
      }

      if (e.ctrlKey && vendCallbackRef.current) {
        if (e.key === 'p' || e.key === 'P') {
          const callback = vendCallbackRef.current;
          setTimeout(() => {
            if (callback) {
              callback(true);
              vendCallbackRef.current = null;
            }
          }, 3000);
          console.log('🔵 Эмулятор: Приготовление напитка успешно');
        } else if (e.key === 'e' || e.key === 'E') {
          const callback = vendCallbackRef.current;
          setTimeout(() => {
            if (callback) {
              callback(false);
              vendCallbackRef.current = null;
            }
          }, 1000);
          console.log('🔵 Эмулятор: Ошибка приготовления напитка');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCardPaymentActive]);

  const emulatorValue: EmulatorInterface = {
    startCashin,
    stopCashin,
    bankCardPurchase,
    bankCardCancel,
    vend,
    get bankCardCallbackOverride() {
      return bankCardCallbackOverrideRef.current;
    },
    set bankCardCallbackOverride(callback: ((success: boolean) => void) | null) {
      bankCardCallbackOverrideRef.current = callback;
    }
  };

  return <EmulatorContext.Provider value={emulatorValue}>{children}</EmulatorContext.Provider>;
};
