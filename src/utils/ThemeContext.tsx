import React, { useEffect, useState } from "react";

type ThemeType = "light" | "dark";

const themes = {
  dark: {
    rose: "#EA5368",
    salmon: "#EFA19D",
    cream: "#F2CFB1",
    khaki: "#C8C8AC",
    padua: "#8CAE9C",
    lightGray: "#C9CCCA",
    darkGray: "#111212",
  },
  light: {
    rose: "#FEA7B3",
    salmon: "#FFD8D6",
    cream: "#FEE4CD",
    khaki: "#DFDFC0",
    padua: "#D5F2E3",
    lightGray: "#646866",
    darkGray: "#111212",
  },
};

const initState = {
  dark: false,
  theme: themes.light,
  toggle: () => {},
};

export const ThemeContext = React.createContext(initState);

export const ThemeProvider = ({ children }: any) => {
  const [dark, setIsDark] = useState(false);

  useEffect(() => {
    const setToDark = window.localStorage.getItem("dark") === "true";
    setIsDark(setToDark);
  }, [dark]);

  const toggle = () => {
    const newIsDark = !dark;
    window.localStorage.setItem("dark", JSON.stringify(newIsDark));
    setIsDark(newIsDark);
  };

  const theme = dark ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ theme, dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
