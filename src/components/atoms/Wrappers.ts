import styled from "styled-components";

export const SvgWrapper = styled.div<{
  width: string;
  height: string;
  fill?: string;
}>`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  ${({ fill }) => (fill ? `fill: ${fill};` : "")}
`;
