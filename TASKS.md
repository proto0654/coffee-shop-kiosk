# План разработки приложения "Кофейный киоск"

## 1. Настройка проекта
- ✅ Создать проект React с фиксированным разрешением 480x800px
- ✅ Настроить базовую структуру компонентов
- ✅ Настроить маршрутизацию между экранами
- ✅ Создать эмулятор для имитации взаимодействия с оборудованием

## 2. Реализация основных компонентов
- ✅ Создать компонент контейнера с фиксированным размером
- ✅ Разработать компонент заголовка (Header)
- ✅ Создать компоненты для навигации по разделам
- ✅ Разработать компоненты для отображения товаров

## 3. Реализация экранов
### 3.1 Экран заставки
- ✅ Анимация появления кофейных зерен
- ✅ Анимация появления стаканчиков с двух сторон
- ✅ Текст "ЭТО ТВОЙ КОФЕ"
- ✅ Окружность с призывом к действию

### 3.2 Экран выбора напитков
- ✅ Вкладки для категорий напитков
- ✅ Сетка товаров с изображениями, названиями и ценами
- ✅ Изменение цвета фона при переключении категорий
- ✅ Индикатор выбранной категории (цветной кружок под иконкой)

### 3.3 Экраны кастомизации
- ✅ Модальное окно выбора размера напитка
- ✅ Модальное окно выбора сиропов
- ✅ Кнопки изменения количества
- ✅ Отображение общей стоимости

### 3.4 Экраны оплаты
- ✅ Экран выбора способа оплаты
- ✅ Экран оплаты картой
- ✅ Экран оплаты наличными
- ✅ Обработка успешной/неуспешной оплаты

### 3.5 Экраны приготовления и выдачи
- ✅ Экран с таймером и индикатором прогресса (SVG-анимация)
- ✅ Экран "Напиток готов"
- ✅ Обработка ошибок приготовления

## 4. Реализация эмулятора
- ✅ Эмуляция приема наличных (StartCashin, StopCashin)
- ✅ Эмуляция оплаты картой (BankCardPurchase, BankCardCancel)
- ✅ Эмуляция приготовления напитка (Vend)

## 5. Стилизация и анимации
- ✅ Реализация общих стилей согласно макету
- ✅ Реализация изменения цвета фона при выборе категорий
- ✅ Реализация SVG-анимаций (индикатор прогресса)
- ✅ Стилизация модальных окон и оверлеев

## 6. Тестирование и отладка
- ✅ Проверка корректности работы на разрешении 480x800px
- ✅ Проверка корректной работы эмулятора
- ✅ Тестирование всех сценариев взаимодействия пользователя
