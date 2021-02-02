import React from 'react';
import { Helmet } from "react-helmet";
import { ReactNode } from 'react';
import Header from './Header';
import styled from 'styled-components';

interface LayoutProps {
    subTitle: string;
    children: ReactNode;
}

function Layout({subTitle, children}: LayoutProps) {
    return (
    <>
        <Helmet>
            <title>broccolism &gt; {subTitle}</title>
            <meta name="name" content="Broccolism" />
            <meta
                name="description"
                content="one dish of broccoli salad"
            />
            <meta name="og:site_name" content="Broccolism" />
            <meta
                name="og:description"
                content="one dish of broccoli salad"
            />
        </Helmet>
        <Header />
        <Contents>{children}</Contents>
    </>
    )
}

export default Layout;

const Contents = styled.div`
    min-height: 90vh;
    padding: 0px 8vw;
`;
