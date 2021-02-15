import { useContext, useState } from "react";
import styled from "styled-components";

import Switch from "react-switch";

import BlogColors from "../consts/colors";
import { FaMoon } from "react-icons/fa";
import { BsBrightnessLowFill } from "react-icons/bs";
import { ThemeContext } from "../utils/ThemeContext";

function ThemeSwitch() {
  const { theme, dark, toggle } = useContext(ThemeContext);

  const [isDark, setIsDark] = useState(false);

  const changeIsDark = () => {
    setIsDark(!isDark);
  };

  return (
    <div>
      <Switch
        onChange={toggle}
        checked={isDark}
        onColor={BlogColors.light.darkGray}
        offColor={BlogColors.light.cream}
        checkedIcon={<MoonIcon />}
        uncheckedIcon={<SunIcon size={24} />}
      />
    </div>
  );
}

const MoonIcon = styled(FaMoon)`
  margin: 6px;
  color: ${BlogColors.light.cream};
`;

const SunIcon = styled(BsBrightnessLowFill)`
  margin: 2px;
  color: ${BlogColors.light.darkGray};
`;

export default ThemeSwitch;
