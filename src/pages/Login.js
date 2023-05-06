import React, { useState, useCallback } from "react";
import axios from "axios";
import "./Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const PhoneNumberForm = ({ onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onSubmit(phoneNumber);
    },
    [onSubmit, phoneNumber]
  );

  return (
    <form onSubmit={handleSubmit}>
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

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onSubmit(otp);
    },
    [onSubmit, otp]
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
      <Link to="/task">
        <button type="submit">Login</button>
      </Link>
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
        localStorage.setItem("token", response.data.data.token);
        navigate("/tasks");
      } catch (error) {
        console.error("Error logging in:", error);
      }
    },
    [phoneNumber]
  );

  const handleResendOtp = useCallback(async (phoneNumber) => {
    try {
      await axios.post("https://task-manager-7h07.onrender.com/register", {
        phoneNumber,
      });
      // You can add any custom logic here, e.g., show a message that the OTP was resent.
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
