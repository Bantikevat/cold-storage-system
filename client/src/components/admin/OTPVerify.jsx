// ✅ src/components/admin/OTPVerify.jsx
import React, { useEffect, useState, useRef } from 'react'; // useRef added for input refs
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OTPVerify = () => {
  // State to hold each digit of the OTP
  const [otp, setOtp] = useState(new Array(6).fill('')); 
  const [timer, setTimer] = useState(60); // ⏱️ 1 minute countdown for resend
  const [showResentMsg, setShowResentMsg] = useState(false); // Flag to show OTP resent message
  const [loading, setLoading] = useState(false); // Loading state for verify button
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();
  const email = localStorage.getItem('adminEmail'); // Get admin email from local storage

  // Refs for each OTP input field to manage focus
  const inputRefs = useRef([]); 

  // Focus on the first OTP input field when the component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown Timer useEffect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    // Clear interval when component unmounts or timer reaches 0
    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP input change for individual digit fields
  const handleChange = (element, index) => {
    // Only allow numeric input
    if (isNaN(element.value)) return false; 

    // Update the OTP state with the new digit
    const newOtpArray = [...otp.map((d, idx) => (idx === index ? element.value : d))];
    setOtp(newOtpArray);

    // Automatically focus the next input field if a digit is entered and it's not the last field
    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    } 
    // If it's the last digit and it's filled, attempt to verify
    else if (element.value !== '' && index === 5) {
      // Give a small delay to allow state update to propagate before calling verify
      setTimeout(() => handleVerifyOTP(newOtpArray.join('')), 100); 
    }
  };

  // Handle paste event for OTP input (pastes entire OTP string into fields)
  const handlePaste = (e) => {
    // Get pasted data, limit to 6 characters
    const pasteData = e.clipboardData.getData('text').slice(0, 6); 
    // Only proceed if pasted data contains only digits
    if (!/^\d+$/.test(pasteData)) return; 

    // Convert pasted string to an array of characters
    const newOtp = pasteData.split('');
    // Update OTP state, filling remaining fields with empty strings if paste data is shorter than 6
    const newOtpArray = [...newOtp, ...new Array(6 - newOtp.length).fill('')];
    setOtp(newOtpArray); 
    // Focus the last filled input field
    inputRefs.current[newOtp.length - 1]?.focus(); 

    // If pasted OTP is complete, attempt to verify
    if (newOtp.length === 6) {
      setTimeout(() => handleVerifyOTP(newOtpArray.join('')), 100);
    }
  };

  // Handle backspace/delete key presses for OTP input fields
  const handleKeyDown = (e, index) => {
    // If backspace is pressed and the current field is empty, move focus to the previous field
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (otpToVerify = otp.join('')) => { // Default to current state if not passed
    setError(''); // Clear previous errors
    
    // Validate if the complete 6-digit OTP has been entered
    if (otpToVerify.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    try {
      setLoading(true); // Set loading state for the button
      // Send OTP and admin email for verification
      const res = await axios.post('https://cold-storage-system-1s.onrender.com/api/otp/verify-otp', { otp: otpToVerify, email: email });
      if (res.data.verified) {
        navigate('/dashboard'); // Navigate to dashboard on successful verification
      } else {
        setError('Invalid OTP. Please try again.'); // Display error for invalid OTP
        setOtp(new Array(6).fill('')); // Clear OTP on invalid attempt
        inputRefs.current[0].focus(); // Focus first input for re-entry
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      // Display a generic error message for verification failure
      setError('OTP verification failed. Please try again later.');
      setOtp(new Array(6).fill('')); // Clear OTP on error
      inputRefs.current[0].focus(); // Focus first input for re-entry
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle resending OTP
  const handleResendOTP = async () => {
    setError(''); // Clear previous errors
    setShowResentMsg(false); // Hide any previous "OTP resent" message
    setTimer(0); // Reset timer to 0 to allow immediate resend button click

    try {
      // Send OTP request again
      await axios.post('https://cold-storage-system-1s.onrender.com/api/otp/send-otp', { email });
      setTimer(60); // Start the timer again for the next resend
      setShowResentMsg(true); // Show "OTP has been resent" message
      // Hide the message after 4 seconds
      setTimeout(() => setShowResentMsg(false), 4000); 
    } catch (err) {
      console.error("Failed to resend OTP:", err);
      setError('Failed to resend OTP. Please try again.'); // Display error if resend fails
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 font-[Outfit] p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-sky-700 mb-2">Enter OTP</h2>
        <p className="text-sm text-gray-500 mb-4">OTP has been sent to <strong>{email}</strong></p>

        {/* OTP Input Fields */}
        <div className="flex justify-center gap-2 mb-4">
          {otp.map((data, index) => {
            return (
              <input
                key={index}
                type="text"
                maxLength="1" // Each input takes only one digit
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()} // Select content on focus for easy overwrite
                onKeyDown={(e) => handleKeyDown(e, index)} // Handle backspace
                onPaste={handlePaste} // Handle pasting OTP
                ref={(el) => (inputRefs.current[index] = el)} // Assign ref to each input
                className="w-10 h-10 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                inputMode="numeric" // For mobile: brings up numeric keyboard
                pattern="[0-9]*" // For mobile: ensures only numbers are allowed
              />
            );
          })}
        </div>

        {/* Display error message if any */}
        {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}

        {/* Verify OTP Button */}
        <button
          onClick={() => handleVerifyOTP()} // Call with no argument to use current state
          disabled={loading}
          className={`mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Verifying...' : '✅ Verify OTP'}
        </button>

        {/* Resend OTP section */}
        <div className="mt-6 text-sm text-gray-600 text-center">
          {timer > 0 ? (
            <span>⏳ You can resend OTP in <strong>{timer}s</strong></span>
          ) : (
            <button
              onClick={handleResendOTP}
              className="text-sky-600 hover:underline font-semibold"
            >
              🔁 Resend OTP
            </button>
          )}
        </div>

        {/* OTP Resent Alert */}
        {showResentMsg && (
          <div className="mt-4 bg-sky-100 text-sky-800 border border-sky-300 px-4 py-3 rounded-lg shadow-sm text-sm animate-fadeIn transition-all duration-300">
            📩 OTP has been resent to your email successfully.
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPVerify;
