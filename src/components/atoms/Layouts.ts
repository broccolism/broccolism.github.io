import styled from "styled-components";

type MainAxisType =
  | "flex-start"
  | "flex-end"
  | "center"
  | "stretch"
  | "space-between"
  | "space-around"
  | "space-evenly";

type CrossAxisType =
  | "flex-start"
  | "flex-end"
  | "center"
  | "stretch"
  | "baseline";

export const StyledRow = styled.div<{
  mainAxisAlignment?: MainAxisType;
  crossAxisAlignment?: CrossAxisType;
}>`
  display: flex;
  flex-direction: row;
  align-items: ${({ crossAxisAlignment }) => crossAxisAlignment ?? "center"};
  justify-content: ${({ mainAxisAlignment }) => mainAxisAlignment ?? "center"};
`;

export const StyledColumn = styled.div<{
  mainAxisAlignment?: MainAxisType;
  crossAxisAlignment?: CrossAxisType;
}>`
  display: flex;
  flex-direction: column;
  align-items: ${({ crossAxisAlignment }) => crossAxisAlignment ?? "center"};
  justify-content: ${({ mainAxisAlignment }) => mainAxisAlignment ?? "center"};
`;
