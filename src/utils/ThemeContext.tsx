import React, { useEffect, useState } from "react";

const themes = {
  dark: {
    background: "#0D1116",
    text: "#C8D1D9",
    green: "#6CCFB5",
    rose: "#F9858A",
    black: "#0D1116",
    white: "#FFFFFF",

    salmon: "#EFA19D",
    cream: "#F2CFB1",
    khaki: "#C8C8AC",
    padua: "#8CAE9C",
    lightGray: "#C9CCCA",
    darkGray: "#111212",
  },
  light: {
    background: "#FFFFFF",
    text: "#24292F",
    green: "#00B78F",
    rose: "#EA5368",
    black: "#0D1116",
    white: "#FFFFFF",

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
  const [dark, setIsDark] = useState(
    window.localStorage.getItem("dark") === "true"
  );

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
