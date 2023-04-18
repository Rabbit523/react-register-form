import React, { useEffect, useState } from "react";
import axios from "axios";

const API_TOKEN =
  "QcMunXKtTS62P4fhx7p4IOugsRtpi5pW1GzoUBaRdW38PRddrV7PoXyMTcw6uAAGMk0";
const API_USER = "wisdom.gemini@outlook.com";
const authTokenURL = "https://www.universal-tutorial.com/api/getaccesstoken";
const stateApiURL =
  "https://www.universal-tutorial.com/api/states/United States";

const validateFormData = (data) => {
  const errors = {};

  if (!data.firstName.trim()) {
    errors.firstName = "FirstName is required";
  }

  if (!data.lastName.trim()) {
    errors.lastName = "lastName is required";
  }

  if (!data.state.trim()) {
    errors.state = "State is required";
  }

  if (!data.city.trim()) {
    errors.city = "City is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
    errors.email = "Invalid email address";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

const Register = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    state: "",
    city: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAccessToken = async () => {
      if (!accessToken) {
        try {
          const { data } = await axios.get(authTokenURL, {
            headers: {
              "api-token": API_TOKEN,
              "user-email": API_USER,
            },
          });

          setAccessToken(data.auth_token);
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      }
    };

    fetchAccessToken();
  }, [accessToken]);

  useEffect(() => {
    const fetchStates = async () => {
      if (!accessToken) return;

      try {
        const statesResponse = await axios.get(stateApiURL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        });

        setStates(statesResponse.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStateChange = async (e) => {
    const stateName = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      state: stateName,
    }));

    try {
      const citiesResponse = await axios.get(
        `https://www.universal-tutorial.com/api/cities/${stateName}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );

      setCities(citiesResponse.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(formData);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form data submitted:", formData);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="firstName">FirstName:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        {errors.firstName && <p>{errors.firstName}</p>}
      </div>
      <div>
        <label htmlFor="lastName">LastName:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        {errors.lastName && <p>{errors.lastName}</p>}
      </div>
      <div>
        <label htmlFor="state">State:</label>
        <select name="state" onChange={handleStateChange}>
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.state_name} value={state.state_name}>
              {state.state_name}
            </option>
          ))}
        </select>
        {errors.state && <p>{errors.state}</p>}
      </div>
      <div>
        <label htmlFor="city">City:</label>
        <select name="city" onChange={handleChange}>
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.city_name} value={city.city_name}>
              {city.city_name}
            </option>
          ))}
        </select>
        {errors.city && <p>{errors.city}</p>}
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p>{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <p>{errors.password}</p>}
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Register;
