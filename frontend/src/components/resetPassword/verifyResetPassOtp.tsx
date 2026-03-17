import { useState, useEffect } from "react";
import { resendOtp, verifyOtp } from "../../assets/services/services";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

function VerifyResetOtpPassword() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // countdown timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const res = await verifyOtp(otp, email);

      if (res.data.success) {
        toast.success("Otp verified");
        navigate("/resetPassword",{state :{email}});
      } else {
        toast.error(res.data.message);
      }

    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    const res = await resendOtp(email);

    if (res.data.success) {
      toast.success("OTP resent to your email");
      setTimer(60); // restart timer
      
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>Verify OTP</h2>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
            className="otp-input"
          />

          <button className="verify-btn">Verify</button>
        </form>

        <p className="resend-text">
          {timer > 0 ? (
            <>Resend OTP in <b>{timer}s</b></>
          ) : (
            <>
              Didn't receive OTP?
              <button onClick={handleResend} className="resend-btn">
                Resend
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default VerifyResetOtpPassword;