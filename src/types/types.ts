// Типы для напитков
export interface Drink {
  id: number;
  name: string;
  price: number;
  image: string;
  category: 'coffee' | 'softDrink' | 'tea' | 'milkshake';
}

// Типы для опций размера напитка
export interface SizeOption {
  id: number;
  name: string; // e.g., "200 мл."
  value: number; // e.g., 200
  priceModifier: number; // Изменение цены в зависимости от размера
}

// Типы для опций добавок (сиропы)
export interface Addon {
  id: number;
  name: string;
  price: number;
}

// Тип для выбранного напитка
export interface SelectedDrink {
  drink: Drink;
  size: SizeOption;
  addons: Addon[];
  totalPrice: number;
}

// Типы для эмулятора
export interface EmulatorCallbacks {
  onCashInserted?: (amount: number) => void;
  onBankCardResult?: (success: boolean) => void;
  onVendResult?: (success: boolean) => void;
}

export interface EmulatorInterface {
  startCashin: (callback: (amount: number) => void) => void;
  stopCashin: (callback: () => void) => void;
  bankCardPurchase: (
    amount: number,
    callback: (success: boolean) => void,
    displayCallback: (message: string) => void
  ) => void;
  bankCardCancel: () => void;
  vend: (productIdx: number, callback: (success: boolean) => void) => void;
}
