import React from "react";
import styled from "styled-components";
import { HomeTileProps } from "../../models/interfaces";

function TileToPage(props: HomeTileProps) {
  return (
    <Root width={props.width} height={props.height} color={props.color}>
      {props.children}
    </Root>
  );
}

export default TileToPage;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: ${(props: HomeTileProps) => props.width};
  height: ${(props: HomeTileProps) => props.height};
  background-color: ${(props: HomeTileProps) => props.color};
  border-radius: 30px;
`;
