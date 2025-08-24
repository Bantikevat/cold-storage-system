
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Purchase endpoints
  PURCHASES: `${API_BASE_URL}/api/purchases`,
  PURCHASES_ALL: `${API_BASE_URL}/api/purchases/all`,
  PURCHASES_REPORT: `${API_BASE_URL}/api/purchases/report`,
  
  // Farmer endpoints
  FARMERS: `${API_BASE_URL}/api/farmers`,
  FARMERS_ADD: `${API_BASE_URL}/api/farmers/add`,
  FARMERS_ALL: `${API_BASE_URL}/api/farmers/all`,
  FARMERS_LEDGER: `${API_BASE_URL}/api/farmers/ledger`,
  
  // Sales endpoints
  SALES: `${API_BASE_URL}/api/sales/all`,
  SALES_ADD: `${API_BASE_URL}/api/sales/add`,
  SALES_ALL: `${API_BASE_URL}/api/sales/all`,
  SALES_REPORT: `${API_BASE_URL}/api/sales/report`,
  SALES_DELETE: `${API_BASE_URL}/api/sales`,
  
  // Customer endpoints
  CUSTOMERS: `${API_BASE_URL}/api/customers`,
  CUSTOMERS_ALL: `${API_BASE_URL}/api/customers/all`,
  CUSTOMERS_ADD: `${API_BASE_URL}/api/customers/add`,
  
  // OTP endpoints
  OTP_SEND: `${API_BASE_URL}/api/otp/send-otp`,
  OTP_VERIFY: `${API_BASE_URL}/api/otp/verify-otp`,

  // Stock endpoints
  STOCK_ALL: `${API_BASE_URL}/api/stock`,
  STOCK_ADD: `${API_BASE_URL}/api/stock`,
  STOCK_REPORT: `${API_BASE_URL}/api/stock/report`,
};

export default API_ENDPOINTS;
