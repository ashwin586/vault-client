import React, { useEffect, useState, useRef } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import {
  APLHABETS,
  NUMBERS,
  SPECIAL_CHARACTERS,
  optionsState,
} from "@/utils/constants";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import LinearProgress from "@mui/material/LinearProgress";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/context/ToastContext";
import {
  calculateStrengthFromOptions,
  getStrengthColor,
} from "@/utils/passwordStrength";
import { linearProgressStyle, sliderStyle } from "@/utils/muiStyles";
import { isTokenValid } from "@/utils/auth";
import useUserSettings from "@/hooks/useUserSettings";

const App = () => {
  const [options, setOptions] = useState<optionsState>({
    upperCase: true,
    lowerCase: false,
    number: false,
    specialChar: false,
  });
  const [password, setPassword] = useState<string>("");
  const [rangeSliderValue, setRangeSliderValue] = useState<number[] | number>(15);
  const [settingsLocked, setSettingsLocked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const passTextRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();
  const { settings, isLoaded } = useUserSettings(isAuthenticated);

  useEffect(() => {
    setIsAuthenticated(isTokenValid());
  }, []);

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
    if (allChars.length === 0) {
      showToast(
        "At least one password generation rule must remain enabled.",
        "warning",
      );
      return;
    }

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
    if (settingsLocked) {
      showToast("Character sets are managed in Settings.", "info");
      return;
    }

    const newState = {
      ...options,
      [option]: !options[option],
    };

    const checkedCount = Object.values(newState).filter(Boolean).length;

    if (checkedCount === 0) {
      showToast(
        "At least one password generation rule must remain enabled.",
        "warning",
      );
      return;
    }

    setOptions(newState);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setSettingsLocked(false);
      return;
    }

    if (!isLoaded) return;

    setOptions({
      upperCase: settings.generatorUppercase,
      lowerCase: settings.generatorLowercase,
      number: settings.generatorNumbers,
      specialChar: settings.generatorSymbols,
    });
    setRangeSliderValue(settings.generatorLength);
    setSettingsLocked(true);
  }, [isAuthenticated, isLoaded, settings]);

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
      showToast("Password copied to clipboard", "success");
    }
  };

  const strength = calculateStrengthFromOptions(password, options);
  const strengthColor = getStrengthColor(strength);

  const characterSets: Array<{
    id: keyof optionsState;
    label: string;
    htmlId: string;
  }> = [
    { id: "upperCase", label: "ABC", htmlId: "upperCase" },
    { id: "lowerCase", label: "abc", htmlId: "lowerCase" },
    { id: "number", label: "123", htmlId: "number" },
    { id: "specialChar", label: "!@#", htmlId: "specialChar" },
  ];

  return (
    <AppLayout
      title="Vault — Password Generator"
      description="Generate strong and secure passwords instantly"
      contentVariant="centered"
    >
      <div className="container">
        <h1 className="heading-1 text">Random Password Generator</h1>
        <h2 className="text text-lg sm:text-2xl max-w-2xl px-2">
          Create strong, unique passwords for every account. Generated locally in
          your browser.
        </h2>

        <div className="flex items-center gap-2 text-subtle text-sm max-w-lg">
          <ShieldOutlinedIcon style={{ fontSize: "16px" }} />
          <span>Your passwords are never stored unless you save them to your vault.</span>
        </div>

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
                aria-label="Generated password"
              />
            </div>
            <button
              type="button"
              onClick={() => generatePassword()}
              className="btn-icon btn-icon-sm shrink-0"
              aria-label="Regenerate password"
            >
              <RefreshIcon style={{ fontSize: "20px" }} />
            </button>
            <button
              type="button"
              onClick={handleCopyPass}
              className="btn-icon btn-icon-sm shrink-0"
              aria-label="Copy password to clipboard"
            >
              <ContentCopyIcon style={{ fontSize: "20px" }} />
            </button>
          </div>

          <div id="character-sets">
            <div className="generator-section-header">
              <h2 className="text text-left text-xl">Character Sets</h2>
              {settingsLocked && (
                <span className="generator-managed-hint mb-2!">Managed in Settings</span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              {characterSets.map((set) => (
                <div
                  className={`segmented w-full ${settingsLocked ? "segmented--locked" : ""}`}
                  key={set.id}
                >
                  <input
                    type="checkbox"
                    name={set.id}
                    id={set.htmlId}
                    checked={options[set.id]}
                    disabled={settingsLocked}
                    onChange={() => handleCheckBox(set.id)}
                  />
                  <label htmlFor={set.htmlId}>{set.label}</label>
                </div>
              ))}
            </div>
          </div>

          <div id="password-length">
            <div className="generator-section-header">
              <h2 className="text text-left text-xl">
                Length: {rangeSliderValue}
              </h2>
              {settingsLocked && (
                <span className="generator-managed-hint">Managed in Settings</span>
              )}
            </div>
            <div className="pass__range__input__container">
              <Box sx={{ width: "100%" }}>
                <Slider
                  aria-label="Password length"
                  valueLabelDisplay="auto"
                  min={8}
                  max={50}
                  disabled={settingsLocked}
                  value={
                    typeof rangeSliderValue === "number"
                      ? rangeSliderValue
                      : rangeSliderValue[0]
                  }
                  onChange={(_, value) => {
                    if (settingsLocked) return;
                    setRangeSliderValue(value);
                  }}
                  sx={sliderStyle}
                />
              </Box>
            </div>
          </div>

          <div id="password-strength-meter">
            <p className="text text-start text-xl">Password Strength</p>
            <Box sx={{ width: "100%", mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={strength}
                sx={linearProgressStyle(strengthColor)}
              />
            </Box>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default App;
