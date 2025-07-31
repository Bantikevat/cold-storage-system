// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/admin/AdminLogin';
import OTPVerify from './components/admin/OTPVerify';
import Dashboard from './components/admin/Dashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Farmer Module Imports
import AddFarmer from './components/farmers/AddFarmer';
import FarmerList from './components/farmers/FarmerList';
import EditFarmer from './components/farmers/EditFarmer';
import FarmerLedger from './components/farmers/FarmerLedger'; // NEW
import AddPayment from './components/payments/AddPayment'; // NEW

// Other Module Imports (keep if you have them, otherwise remove)
import PurchaseList from './components/purchases/PurchaseList';
import AddPurchase from './components/purchases/AddPurchase';
import InvoicePage from "./components/purchases/InvoicePage";
import EditPurchase from './components/purchases/EditPurchase';
import ReportPage from './components/purchases/ReportPage';
import SalesEntry from './components/Sales/SalesForm';
import SalesInvoice from './components/Sales/SalesInvoice';
import SalesList from './components/Sales/SalesList';
import SalesReport from './components/Sales/SalesReport';
import EditSale from './components/Sales/EditSales';
import AddCustomer from './components/Sales/AddCustomer';
import CustomerList from './components/Sales/CustomerList';
import EditCustomer from './components/Sales/EditCustomer';
import AddStorage from "./components/storage/AddStorage"; 
import StorageList from "./components/storage/StorageList";
import EditStorage from "./components/storage/EditStorage";
import ManualStockForm from "./pages/StockForm";
import StockList from './pages/StockList';
import SettingsPage from './components/setting/SettingsPage';
import ErrorBoundary from './components/common/ErrorBoundary';



// import StockDashboard from './components/stock/StockDashboard';



const App = () => {
  return (
    <Router>
      <ErrorBoundary>

      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/otp" element={<OTPVerify />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
       
        
        {/* Farmer Module Routes */}
        <Route path="/add-farmer" element={<AddFarmer />} />
        <Route path="/farmers" element={<FarmerList />} />
        <Route path="/edit-farmer/:id" element={<EditFarmer />} />
        <Route path="/ledger/:farmerId" element={<FarmerLedger />} /> {/* NEW */}
        <Route path="/add-payment/:farmerId" element={<AddPayment />} /> {/* NEW */}
      
        {/* Other Module Routes (keep if you have them, otherwise remove) */}
        <Route path="/purchase-entry" element={<AddPurchase />} />
        <Route path="/purchase-list" element={<PurchaseList />} />
        <Route path="/invoice/:id" element={<InvoicePage />} />
        <Route path="/edit-purchase/:id" element={<EditPurchase />} />
        <Route path="/report" element={<ReportPage />} />

        <Route path="/sales-entry" element={<SalesEntry />} />
        <Route path="/sales-list" element={<SalesList />} />
        <Route path="/sales-report" element={<SalesReport />} />
        <Route path="/sales-invoice/:id" element={<SalesInvoice />} />
        <Route path="/edit-sale/:id" element={<EditSale />} />
        <Route path="/add-customer" element={<AddCustomer />} />
        <Route path="/customer-list" element={<CustomerList />} />
        <Route path="/edit-customer/:id" element={<EditCustomer />} />

        <Route path="/add-storage" element={<AddStorage />} />
        <Route path="/storage-list" element={<StorageList />} />
        <Route path="/edit-storage/:id" element={<EditStorage />} />

        <Route path="/stock/add" element={<ManualStockForm />} />
        <Route path="/stock" element={<StockList />} />

        <Route path="/settings" element={<SettingsPage />} />
        {/* <Route path="/stock/edit/:id" element={<StockForm />} /> */}
       
        
        {/* <Route path="/stock" element={<StockDashboard />} /> */}
      </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
