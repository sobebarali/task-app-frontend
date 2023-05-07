import React, { useState, useCallback } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const countryList = [
  { value: "+1", label: "United States +1" },
  { value: "+44", label: "United Kingdom +44" },
  { value: "+91", label: "India +91" },
  // Add more countries here
];



const PhoneNumberForm = ({ onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countryList[2]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onSubmit(selectedCountry.value + phoneNumber);
    },
    [onSubmit, phoneNumber, selectedCountry]
  );

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="country">Country:</label>
      <Select
        id="country"
        options={countryList}
        value={selectedCountry}
        onChange={setSelectedCountry}
      />
      <label htmlFor="mobile-number">Mobile Number:</label>
      <input
        type="tel"
        id="mobile-number"
        name="mobile-number"
        value={phoneNumber}
        onChange={(event) => setPhoneNumber(event.target.value)}
        required
      />
      <button type="submit">Send OTP</button>
    </form>
  );
};

const OtpForm = ({ onSubmit, onBack, onResend, phoneNumber }) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const success = await onSubmit(otp);
      if (success) {
        navigate("/tasks");
      }
    },
    [onSubmit, otp, navigate]
  );

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="otp">Enter OTP:</label>
      <input
        type="text"
        id="otp"
        name="otp"
        value={otp}
        onChange={(event) => setOtp(event.target.value)}
        required
      />
      <button type="submit">Login</button>
      {onBack && (
        <button type="button" onClick={onBack}>
          Back
        </button>
      )}
      {onResend && (
        <button type="button" onClick={() => onResend(phoneNumber)}>
          Resend OTP
        </button>
      )}
    </form>
  );
};

const Login = () => {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleMobileSubmit = useCallback(async (phoneNumber) => {
    try {
      setShowOtpInput(true);
      await axios.post("https://task-manager-7h07.onrender.com/register", {
        phoneNumber,
      });
      setPhoneNumber(phoneNumber);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  }, []);

  const handleOtpSubmit = useCallback(
    async (otp) => {
      try {
        const response = await axios.post(
          "https://task-manager-7h07.onrender.com/login",
          {
            phoneNumber,
            otp,
          }
        );

        if (response.data.data.token) {
          localStorage.setItem("token", response.data.data.token);
          return true;
        }
      } catch (error) {
        alert("Invalid OTP");
        return false;
      }
    },
    [phoneNumber]
  );

  const handleResendOtp = useCallback(async (phoneNumber) => {
    try {
      await axios.post("https://task-manager-7h07.onrender.com/register", {
        phoneNumber,
      });
      setPhoneNumber(phoneNumber);
      alert("OTP sent successfully");
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  }, []);

  const handleBack = useCallback(() => {
    setShowOtpInput(false);
  }, []);

  return (
    <div className="login-page">
      <h1>Welcome to Task Manager</h1>
      {!showOtpInput ? (
        <PhoneNumberForm onSubmit={handleMobileSubmit} />
      ) : (
        <OtpForm
          onSubmit={handleOtpSubmit}
          onBack={handleBack}
          onResend={handleResendOtp}
          phoneNumber={phoneNumber}
        />
      )}
    </div>
  );
};

export default Login;
