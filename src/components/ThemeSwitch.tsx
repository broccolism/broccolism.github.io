import { useContext, useState } from "react";
import styled from "styled-components";

import Switch from "react-switch";

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

export default ThemeSwitch;
