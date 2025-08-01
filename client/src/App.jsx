// ✅ Import React & Router
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ✅ Admin Auth Components
import AdminLogin from './components/admin/AdminLogin';
import OTPVerify from './components/admin/OTPVerify';
import Dashboard from './components/admin/Dashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';

// ✅ Farmer Module Components
import AddFarmer from './components/farmers/AddFarmer';
import FarmerList from './components/farmers/FarmerList';
import EditFarmer from './components/farmers/EditFarmer';
import FarmerLedger from './components/farmers/FarmerLedger';
import AddPayment from './components/payments/AddPayment';

// ✅ Purchase Module Components
import AddPurchase from './components/purchases/AddPurchase';
import PurchaseList from './components/purchases/PurchaseList';
import EditPurchase from './components/purchases/EditPurchase';
import InvoicePage from './components/purchases/InvoicePage';
import ReportPage from './components/purchases/ReportPage';

// ✅ Sales Module Components
import SalesEntry from './components/Sales/SalesForm';
import SalesList from './components/Sales/SalesList';
import SalesReport from './components/Sales/SalesReport';
import SalesInvoice from './components/Sales/SalesInvoice';
import EditSale from './components/Sales/EditSales';
import AddCustomer from './components/Sales/AddCustomer';
import CustomerList from './components/Sales/CustomerList';
import EditCustomer from './components/Sales/EditCustomer';

// ✅ Storage Module Components
import AddStorage from './components/storage/AddStorage';
import StorageList from './components/storage/StorageList';
import EditStorage from './components/storage/EditStorage';

// ✅ Stock Module Components
import ManualStockForm from './pages/StockForm';
import StockList from './pages/StockList';

// ✅ Settings
import SettingsPage from './components/setting/SettingsPage';

// ✅ Error Handling Wrapper
import ErrorBoundary from './components/common/ErrorBoundary';


// ✅ App Component Starts Here
const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* ✅ Admin Auth Routes */}
          <Route path="/" element={<AdminLogin />} />
          <Route path="/otp" element={<OTPVerify />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* ✅ Farmer Module Routes */}
          <Route path="/add-farmer" element={<AddFarmer />} />
          <Route path="/farmers" element={<FarmerList />} />
          <Route path="/edit-farmer/:id" element={<EditFarmer />} />
          <Route path="/ledger/:farmerId" element={<FarmerLedger />} />
          <Route path="/add-payment/:farmerId" element={<AddPayment />} />

          {/* ✅ Purchase Module Routes */}
          <Route path="/purchase-entry" element={<AddPurchase />} />
          <Route path="/purchase-list" element={<PurchaseList />} />
          <Route path="/invoice/:id" element={<InvoicePage />} />
          <Route path="/edit-purchase/:id" element={<EditPurchase />} />
          <Route path="/report" element={<ReportPage />} />

          {/* ✅ Sales Module Routes */}
          <Route path="/sales-entry" element={<SalesEntry />} />
          <Route path="/sales-list" element={<SalesList />} />
          <Route path="/sales-report" element={<SalesReport />} />
          <Route path="/sales-invoice/:id" element={<SalesInvoice />} />
          <Route path="/edit-sale/:id" element={<EditSale />} />
          <Route path="/add-customer" element={<AddCustomer />} />
          <Route path="/customer-list" element={<CustomerList />} />
          <Route path="/edit-customer/:id" element={<EditCustomer />} />

          {/* ✅ Storage Module Routes */}
          <Route path="/add-storage" element={<AddStorage />} />
          <Route path="/storage-list" element={<StorageList />} />
          <Route path="/edit-storage/:id" element={<EditStorage />} />

          {/* ✅ Stock Module Routes */}
          <Route path="/stock/add" element={<ManualStockForm />} />
          <Route path="/stock" element={<StockList />} />

          {/* ✅ Settings */}
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
