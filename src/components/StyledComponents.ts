import styled from "styled-components";
import BlogColors from "../consts/colors";

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface EmptyDivProps {
  height?: string;
  width?: string;
}

export const StyledEmptyDiv = styled.div`
  width: ${(props: EmptyDivProps) => props.width ?? "auto"};
  height: ${(props: EmptyDivProps) => props.height ?? "auto"};
  opacity: 0;
`;

interface SvgWrapperProps {
  width: string;
  height: string;
  fill?: string;
}

export const SvgWrapper = styled.div`
  height: ${(props: SvgWrapperProps) => props.height};
  width: ${(props) => props.width};
  ${(props) => (props.fill ? `fill: ${props.fill};` : "")}
`;
