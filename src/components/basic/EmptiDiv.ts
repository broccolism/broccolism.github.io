import styled from "styled-components";

export const StyledEmptyDiv = styled.div<{ width?: string; height?: string }>`
  width: ${({ width }) => width ?? "auto"};
  height: ${({ height }) => height ?? "auto"};
  opacity: 0;
`;
