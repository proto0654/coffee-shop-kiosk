import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DrinkCustomizationScreen.css';
import Header from './Header';
import { useDrink } from '../context/DrinkContext';
import { SizeOption, Addon } from '../types/types';

const DrinkCustomizationScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedDrink,
    selectedCategory,
    sizeOptions,
    addonOptions,
    updateSize,
    addAddon,
    removeAddon,
    calculateTotalPrice,
  } = useDrink();

  // Состояние для модального окна с сиропами
  const [showSyrupModal, setShowSyrupModal] = useState(false);

  // Если напиток не выбран, перенаправляем на экран выбора напитков
  if (!selectedDrink) {
    navigate('/drinks');
    return null;
  }

  // Обработчик выбора размера
  const handleSizeSelect = (size: SizeOption) => {
    updateSize(size);
  };

  // Обработчик добавления сиропа
  const handleAddonSelect = (addon: Addon) => {
    // Проверяем, выбран ли уже этот сироп
    const isSelected = selectedDrink.addons.some(a => a.id === addon.id);

    if (isSelected) {
      removeAddon(addon.id);
    } else {
      addAddon(addon);
    }
  };

  // Обработчик перехода к оплате
  const handlePayment = () => {
    navigate('/payment');
  };

  // Функция для проверки, выбрана ли добавка
  const isAddonSelected = (addonId: number) => {
    return selectedDrink.addons.some(addon => addon.id === addonId);
  };

  return (
    <div
      className={`customization-screen ${selectedCategory === 'coffee' ? 'coffee-bg' : 'soft-drinks-bg'}`}
    >
      <Header title="Выбор напитка" showBackButton={true} onBackClick={() => navigate('/drinks')} />

      <div className="customization-content">
        {/* Модальное окно размера напитка */}
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{selectedDrink.drink.name}</h2>
              <button className="close-button" onClick={() => navigate('/drinks')}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 6L18 18"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="drink-image-container">
              <img
                src={selectedDrink.drink.image}
                alt={selectedDrink.drink.name}
                className="drink-image"
              />
            </div>

            {/* Выбор размера напитка */}
            <div className="size-options">
              {sizeOptions.map(size => (
                <button
                  key={size.id}
                  className={`size-option ${selectedDrink.size.id === size.id ? 'selected' : ''}`}
                  onClick={() => handleSizeSelect(size)}
                >
                  <div className="size-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 8H6V20H18V8Z"
                        stroke={selectedDrink.size.id === size.id ? '#FFD600' : '#333333'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 4H18V8H6V4Z"
                        stroke={selectedDrink.size.id === size.id ? '#FFD600' : '#333333'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="size-value">{size.value} мл.</span>
                </button>
              ))}
            </div>

            {/* Добавление сиропа */}
            <div className="syrup-section">
              <p className="syrup-question">Хотите добавить сироп?</p>
              <button className="primary-button" onClick={() => setShowSyrupModal(true)}>
                {selectedDrink.addons.length > 0
                  ? `Добавлены (${selectedDrink.addons.length})`
                  : 'Добавить сироп'}
              </button>
            </div>

            {/* Итоговая цена и кнопка оплаты */}
            <div className="payment-section">
              <button className="primary-button" onClick={handlePayment}>
                Оплатить {calculateTotalPrice()}₽
              </button>
            </div>
          </div>
        </div>

        {/* Модальное окно выбора сиропов */}
        {showSyrupModal && (
          <div className="modal-overlay syrup-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Выбор сиропа</h2>
                <button className="close-button" onClick={() => setShowSyrupModal(false)}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 6L18 18"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="addon-options">
                {addonOptions.map(addon => (
                  <div key={addon.id} className="addon-option">
                    <div className="addon-info">
                      <span className="addon-name">{addon.name}</span>
                      <span className="addon-price">+ {addon.price}₽</span>
                    </div>
                    <div className="addon-controls">
                      <button
                        className={`addon-button ${isAddonSelected(addon.id) ? 'remove' : 'add'}`}
                        onClick={() => handleAddonSelect(addon)}
                      >
                        {isAddonSelected(addon.id) ? (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 12H19"
                              stroke="black"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 5V19"
                              stroke="black"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5 12H19"
                              stroke="black"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="payment-section">
                <button className="primary-button" onClick={() => setShowSyrupModal(false)}>
                  Готово
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrinkCustomizationScreen;
