import { createGlobalStyle } from "styled-components";

import GmarketWoff from "./gmarket.woff";
import GmarketWoff2 from "./gmarket.woff2";

export default createGlobalStyle`
    @font-face {
        font-family: 'Gmarket';
        src: url(${GmarketWoff}) format('woff'),
        url(${GmarketWoff2}) format('woff2');
        font-style: normal;
    }
`;
