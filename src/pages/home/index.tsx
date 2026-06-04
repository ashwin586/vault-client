import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import RefreshIcon from "@mui/icons-material/Refresh";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  APLHABETS,
  NUMBERS,
  SPECIAL_CHARACTERS,
  optionsState,
} from "@/utils/constants";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import Head from "next/head";
import { isTokenValid } from "@/utils/auth";
import AppHeader from "@/components/AppHeader";

const App = () => {
  const [options, setOptions] = useState<optionsState>({
    upperCase: true,
    lowerCase: false,
    number: false,
    specialChar: false,
  });
  const [password, setPassword] = useState<string>("");
  const [rangeSliderValue, setRangeSliderValue] = useState<number[] | number>(
    15,
  );
  const passTextRef = useRef<HTMLInputElement | null>(null);
  const [toast, setToast] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const alphabets: string[] = APLHABETS.split("");
  const numbers: string[] = NUMBERS.split("");
  const specialChar: string[] = SPECIAL_CHARACTERS.split("");

  let allChars: string[] = [];
  if (options.lowerCase)
    allChars = allChars.concat(alphabets.map((c) => c.toLowerCase()));
  if (options.upperCase)
    allChars = allChars.concat(alphabets.map((c) => c.toUpperCase()));
  if (options.number) allChars = allChars.concat(numbers);
  if (options.specialChar) allChars = allChars.concat(specialChar);

  const generatePassword = () => {
    const length =
      typeof rangeSliderValue === "number"
        ? rangeSliderValue
        : rangeSliderValue[0];
    let newPassword: string = "";

    for (let i = 0; i < length; i++) {
      const randomValue = Math.floor(Math.random() * allChars.length);
      newPassword += allChars[randomValue];
    }
    setPassword(newPassword);
  };

  const handleCheckBox = (option: keyof optionsState) => {
    const newState = {
      ...options,
      [option]: !options[option],
    };

    const checkedCount = Object.values(newState).filter(Boolean).length;

    if (checkedCount === 0) {
      return;
    }

    setOptions(newState);
  };

  useEffect(() => {
    generatePassword();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    options.lowerCase,
    options.upperCase,
    options.number,
    options.specialChar,
    rangeSliderValue,
  ]);

  const handleCopyPass = async () => {
    if (passTextRef.current) {
      await navigator.clipboard.writeText(passTextRef.current.value);
      setToast(true);
    }
  };

  const handleClose = () => {
    setToast(false);
  };

  const calculateStrength = (password: string) => {
    let size = 0;

    if (options.lowerCase) size += 26;
    if (options.upperCase) size += 26;
    if (options.number) size += 10;
    if (options.specialChar) size += 32;

    const score = password.length * Math.log2(size);

    if (score < 40) return Number(score);
    if (score < 60) return Number(score);
    if (score < 80) return Number(score);
    if (score > 100) return 100;
  };

  const strength = calculateStrength(password);

  const getColor = (strength: number) => {
    if (strength < 40) return "#ef4444";
    if (strength < 70) return "#f59e0b";
    return "#22c55e";
  };

  useEffect(() => {
    setIsLoggedIn(isTokenValid());
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Vault - Password Generator</title>
        <meta
          name="description"
          content="Generate strong and secure passwords instantly"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="main">
        <AppHeader
          rightContent={
            isLoggedIn ? (
              <span>
                <Link href={"/profile"} className="auth__link">
                  Account
                </Link>
              </span>
            ) : (
              <>
                <span>
                  {" "}
                  <Link className="auth__link" href={"/auth/login"}>
                    Login
                  </Link>
                </span>{" "}
                /{" "}
                <span>
                  <Link className="auth__link" href={"/auth/register"}>
                    Register
                  </Link>
                </span>
              </>
            )
          }
        />
        <div className="container">
          <h1 className="heading-1 text">Random Password Generator</h1>
          <h2 className="text text-lg sm:text-2xl max-w-2xl px-2!">
            Create strong and secure passwords for your accounts.
          </h2>
          <div className="password__generator__container glossy_container">
            <div className="flex items-center gap-3">
              <div className="input__box__container min-w-0 flex-1">
                <input
                  type="text"
                  name="password"
                  id="password"
                  className="input__box"
                  value={password}
                  readOnly
                  ref={passTextRef}
                />
              </div>
              <RefreshIcon
                fontSize="large"
                className="text-white cursor-pointer shrink-0"
                onClick={() => generatePassword()}
              />
              <ContentCopyIcon
                fontSize="large"
                onClick={handleCopyPass}
                className="text-white cursor-pointer shrink-0"
              />
            </div>
            <div id="character-sets">
              <h1 className="text text-left text-xl">Character Sets</h1>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5!">
                <div className="segmented w-full">
                  <input
                    type="checkbox"
                    name="upperCase"
                    id="upperCase"
                    checked={options.upperCase}
                    onChange={() => handleCheckBox("upperCase")}
                  />
                  <label htmlFor="upperCase">ABC</label>
                </div>
                <div className="segmented w-full">
                  <input
                    type="checkbox"
                    name="lowerCase"
                    id="lowerCase"
                    checked={options.lowerCase}
                    onChange={() => handleCheckBox("lowerCase")}
                  />
                  <label htmlFor="lowerCase">abc</label>
                </div>
                <div className="segmented w-full">
                  <input
                    type="checkbox"
                    name="numeric"
                    id="number"
                    checked={options.number}
                    onChange={() => handleCheckBox("number")}
                  />
                  <label htmlFor="number">123</label>
                </div>
                <div className="segmented w-full">
                  <input
                    type="checkbox"
                    name="specialCharacter"
                    id="specialChar"
                    checked={options.specialChar}
                    onChange={() => handleCheckBox("specialChar")}
                  />
                  <label htmlFor="specialChar">!@#</label>
                </div>
              </div>
            </div>
            <div id="password-length">
              <h1 className="text text-left text-xl">
                Length: {""} {rangeSliderValue}
              </h1>
              <div className="pass__range__input__container">
                <Box sx={{ width: "100%" }}>
                  <Slider
                    defaultValue={15}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    min={1}
                    max={50}
                    onChange={(_, value) => {
                      setRangeSliderValue(value);
                    }}
                  />
                </Box>
              </div>
            </div>
            <div id="password-strength-meter" className="">
              <p className="text text-start text-xl">Password Strength</p>
              <Box sx={{ width: "100%", mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={strength}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: "#1e293b",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 5,
                      background: `${getColor(strength || 0)}`,
                    },
                  }}
                />
              </Box>
            </div>
          </div>
        </div>
      </div>
      <Snackbar open={toast} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          Password copied to clipboard
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default App;
