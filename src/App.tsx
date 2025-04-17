import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './colors.css';
import SplashScreen from './components/SplashScreen';
import DrinkSelectionScreen from './components/DrinkSelectionScreen';
import PaymentScreen from './components/PaymentScreen';
import CardPaymentScreen from './components/CardPaymentScreen';
import CashPaymentScreen from './components/CashPaymentScreen';
import PreparationScreen from './components/PreparationScreen';
import ReadyScreen from './components/ReadyScreen';
import PaymentProcessingScreen from './components/PaymentProcessingScreen';
import PaymentFailedScreen from './components/PaymentFailedScreen';
import { DrinkProvider } from './context/DrinkContext';
import { EmulatorProvider } from './context/EmulatorContext';

const App: React.FC = () => {
  return (
    <div className="w-kiosk h-kiosk relative overflow-hidden">
      <EmulatorProvider>
        <DrinkProvider>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/drinks" element={<DrinkSelectionScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/payment/card" element={<CardPaymentScreen />} />
            <Route path="/payment/cash" element={<CashPaymentScreen />} />
            <Route path="/payment/processing" element={<PaymentProcessingScreen />} />
            <Route path="/payment/failed" element={<PaymentFailedScreen />} />
            <Route path="/preparation" element={<PreparationScreen />} />
            <Route path="/ready" element={<ReadyScreen />} />
          </Routes>
        </DrinkProvider>
      </EmulatorProvider>
    </div>
  );
};

export default App;
