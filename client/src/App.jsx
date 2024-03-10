import { useState } from 'react';
import { Footer, Loader, Navbar, Services, Transactions, Welcome } from './components';
import { MoonPayProvider } from '@moonpay/moonpay-react';

const App = () => {
  return (
    
    <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <Navbar />
      <MoonPayProvider apiKey="pk_test_3RZLLK7Z11CfEQmh46OPHaRaLRSwNAnf" 
            environment="sandbox" 
            debug><Welcome /></MoonPayProvider>
    </div>
    <Services />
    <Transactions />
    <Footer />
  </div>
  )
}

export default App
