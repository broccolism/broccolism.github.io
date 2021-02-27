import { createGlobalStyle } from "styled-components";

import GmarketWoff from "./Gmarket.woff";
import GmarketWoff2 from "./Gmarket.woff2";
import D2CodingWoff from "./D2Coding.woff";
import D2CodingWoff2 from "./D2Coding.woff2";

export default createGlobalStyle`
    @font-face {
        font-family: 'Gmarket';
        src: url(${GmarketWoff}) format('woff'),
        url(${GmarketWoff2}) format('woff2'),
        url(${D2CodingWoff}) format('woff'),
        url(${D2CodingWoff2}) format('woff2');
        font-style: normal;
    }
`;
