"use client";
import React, { useState } from "react";
import { LoginSchema } from "../../validation/schemas/loginSchema";
import { RegistrationSchema } from "../../validation/schemas/registrationSchema";


type ChildProps = {
  onValueChange: (value: boolean, setIsModalOpen: boolean) => void;
};

function LoginAndRegisterPage({ onValueChange }: ChildProps) {

  const ExistingUsers = [
    {
      email: "example123@gmail.com",
      password: "123456789",
    }
  ]

  const [isLogin, setIsLogin] = useState(true);
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [registrationFormData, setRegistrationFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState<any>({});
  const [registrationError, setRegistrationError] = useState<any>({});

  const handleChangeOnLoginFormData = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginFormData({
      ...loginFormData,
      [event.target.name]: event.target.value,
    });
  };
  const handleChangeOnRegistrationFormData = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegistrationFormData({
      ...registrationFormData,
      [event.target.name]: event.target.value,
    });
  };
  const checkLoginValidation = (event: React.FormEvent) => {
    event.preventDefault();
    const validation = LoginSchema.safeParse(loginFormData);
    if (!validation.success) {
      const fieldErrors = validation.error.formErrors.fieldErrors;
      setLoginError(fieldErrors);
      onValueChange(false, true); 
    } else {
      setLoginError({});
      onValueChange(true, false); 
    }

  };
  const checkRegistrationValidation = (event: React.FormEvent) => {
    event.preventDefault();
    const validation = RegistrationSchema.safeParse(registrationFormData);
    if (!validation.success) {
      const fieldErrors = validation.error.formErrors.fieldErrors;
      setRegistrationError(fieldErrors);
    } else {
      setRegistrationError({});
    }
    alert("User has been registered!")
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex justify-center p-10 items-center bg-white border rounded-2xl">
      <div
        className="flex flex-col md:flex-row border border-gray-300 rounded-lg shadow-lg overflow-hidden w-full max-w-4xl"
        style={{ height: "auto", minHeight: "400px" }} // Ensures dynamic height adjustment and minimum height
      >
        {/* Form Section */}
        <div
          className={`${
            isLogin ? "animate-slideLeft" : "animate-slideRight"
          } flex flex-col justify-center bg-white w-full p-6 md:p-8`}
          style={{ flex: 1, minHeight: "400px" }} // Ensures child container's height adjusts dynamically
        >
          {isLogin ? (
            /* Login Form */
            <>
              <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
              <label htmlFor="email" className="text-gray-700 mb-2">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChangeOnLoginFormData}
                className="mb-3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                placeholder="Enter your email"
              />
              <div className="min-h-8">
                {loginError.email && (
                  <p className="text-red-500 text-sm">{loginError.email[0]}</p>
                )}
              </div>
              <label htmlFor="password" className="text-gray-700 mb-2">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleChangeOnLoginFormData}
                className="mb-3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                placeholder="Enter your password"
              />
              <div className="min-h-8">
                {loginError.password && (
                  <p className="text-red-500 text-sm">
                    {loginError.password[0]}
                  </p>
                )}
              </div>
              <p className="text-sm">
                Don&apos;t have an account?{" "}
                <button
                  onClick={toggleForm}
                  className="text-green-600 underline hover:text-green-800"
                >
                  Register
                </button>
              </p>
              <button
                onClick={checkLoginValidation}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 w-full"
              >
                Login
              </button>
            </>
          ) : (
            /* Registration Form */
            <>
              <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
              <label htmlFor="username" className="text-gray-700 mb-2">
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                onChange={handleChangeOnRegistrationFormData}
                className="mb-3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                placeholder="Enter your username"
              />
              <div className="min-h-8">
                {registrationError.username && (
                  <p className="text-red-500 text-sm">
                    {registrationError.username[0]}
                  </p>
                )}
              </div>
              <label htmlFor="email" className="text-gray-700 mb-2">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChangeOnRegistrationFormData}
                className="mb-3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                placeholder="Enter your email"
              />
              <div className="min-h-8">
                {registrationError.email && (
                  <p className="text-red-500 text-sm">
                    {registrationError.email[0]}
                  </p>
                )}
              </div>
              <label htmlFor="password" className="text-gray-700 mb-2">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleChangeOnRegistrationFormData}
                className="mb-3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                placeholder="Enter your password"
              />
              <div className="min-h-8">
                {registrationError.password && (
                  <p className="text-red-500 text-sm">
                    {registrationError.password[0]}
                  </p>
                )}
              </div>
              <p className="text-sm">
                Already have an account?{" "}
                <button
                  onClick={toggleForm}
                  className="text-green-600 underline hover:text-green-800"
                >
                  Login
                </button>
              </p>
              <button
                onClick={checkRegistrationValidation}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 w-full"
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Switching Section (Hidden on Small Screens) */}
        <div
          className={`${isLogin ? "animate-slideRight" : "animate-slideLeft"} ${
            isLogin ? "bg-green-500" : "bg-green-400"
          } hidden md:flex flex-col items-center justify-center w-1/2 p-8`}
          style={{ height: "auto", minHeight: "400px" }} // Added height auto and minimum height
        >
          <h2 className="text-2xl font-semibold text-white text-center">
            {isLogin ? "Welcome Back!" : "Create an Account"}
          </h2>
          <p className="text-white mt-4 text-center">
            {isLogin ? "Sign in to continue" : "Sign up to get started"}
          </p>
          <button
            onClick={toggleForm}
            className="mt-6 px-6 py-2 bg-white text-gray-800 font-semibold rounded-md hover:bg-gray-100 transition duration-200"
          >
            {isLogin ? "Register Now" : "Login"}
          </button>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
  @keyframes slideLeft {
    0% {
      transform: translateX(-100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideRight {
    0% {
      transform: translateX(100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-slideLeft {
    animation: slideLeft 0.5s ease-in-out forwards;
  }

  .animate-slideRight {
    animation: slideRight 0.5s ease-in-out forwards;
  }
`}</style>
    </div>
  );
}

export default LoginAndRegisterPage;
