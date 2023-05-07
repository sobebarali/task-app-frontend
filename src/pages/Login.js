import React, { useState, useCallback, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axiosInstance from "../axiosConfig";

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

const OtpForm = ({
  onSubmit,
  onBack,
  onResend,
  phoneNumber,
  initialDisableResend,
}) => {
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(initialDisableResend);
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    if (resendDisabled) {
      setTimeLeft(60);
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      const disableTimeout = setTimeout(() => {
        setResendDisabled(false);
      }, 60000);

      return () => {
        clearInterval(timer);
        clearTimeout(disableTimeout);
      };
    }
  }, [resendDisabled]);

  const handleResend = () => {
    setResendDisabled(true);
    onResend(phoneNumber);
  };

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
      <p>OTP sent to {phoneNumber}</p>
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
        <>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendDisabled}
            className="resend-button"
          >
            Resend OTP
          </button>
          {resendDisabled && <div>{timeLeft} seconds left</div>}
        </>
      )}
    </form>
  );
};

const Login = () => {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleMobileSubmit = useCallback(async (phoneNumber) => {
    try {
      setShowOtpInput(true);
      await axiosInstance.post("/register", { phoneNumber });
      setPhoneNumber(phoneNumber);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  }, []);

  const handleOtpSubmit = useCallback(
    async (otp) => {
      try {
        const response = await axiosInstance.post("/login", {
          phoneNumber,
          otp,
        });

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
      await axiosInstance.post("/register", { phoneNumber });
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
          initialDisableResend
        />
      )}
    </div>
  );
};

export default Login;
