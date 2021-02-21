import { useContext, useState } from "react";
import styled from "styled-components";

import Switch from "react-switch";

import BlogColors from "../consts/colors";
import { FaMoon } from "react-icons/fa";
import { BsBrightnessLowFill } from "react-icons/bs";
import { ThemeContext } from "../utils/ThemeContext";

function ThemeSwitch() {
  const { theme, dark, toggle } = useContext(ThemeContext);

  const [isDark, setIsDark] = useState(dark);

  const changeIsDark = () => {
    toggle();
    setIsDark(!isDark);
  };

  return (
    <Root>
      <Switch
        width={36}
        onChange={changeIsDark}
        checked={isDark}
        onColor={theme.text}
        offColor={theme.text}
        checkedIcon={<div />}
        uncheckedIcon={<div />}
      />
    </Root>
  );
}

const Root = styled.div`
  transform: scale(0.8);
`;

const MoonIcon = styled(FaMoon)`
  margin: 6px;
  color: ${BlogColors.light.cream};
`;

const SunIcon = styled(BsBrightnessLowFill)`
  margin: 2px;
  color: ${BlogColors.light.darkGray};
`;

export default ThemeSwitch;
