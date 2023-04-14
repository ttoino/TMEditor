import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { styled } from "@common/theme";
import type { DBConfig, PageName } from "@types";
import { useUIConfig } from "@common/config-provider";

interface Props {
    pages: PageName[];
    databases: DBConfig[];
}

export default function Sidebar({ pages, databases }: Props) {
    const uiConfig = useUIConfig();
    const { search } = useLocation();

    return (
        <Wrapper>
            <Logo to="/">
                <img
                    width={200}
                    src={uiConfig?.theme?.logo ?? "/logo.png"}
                    alt="logo"
                />
            </Logo>

            <StyledList>
                <li><StyledList>
                    Connectors
                    {databases?.map(({ id }) => {
                        return (
                            <li key={id}>
                                <StyledLink
                                    as={NavLink}
                                    to={`/databases/${id}${search}`}
                                >
                                    {id}
                                </StyledLink>
                            </li>
                        );
                    })}
                    <li>
                        <StyledLink
                            //as="Add Connectors"
                            //to="/connectors/newconnector"
                        >
                            Add Connector
                        </StyledLink>
                    </li>
                </StyledList></li>

                <li><StyledList>
                    Pages
                    {pages?.map(({ fileName, name }) => {
                        return (
                            <li key={fileName}>
                                <StyledLink
                                    as={NavLink}
                                    to={`/pages/${fileName}${search}`}
                                >
                                    {name}
                                </StyledLink>
                            </li>
                        );
                    })}
                    <li>
                        <StyledLink
                            //as="Add Pages"
                            //to="/pages/newpage"
                        >
                            Add Pages
                        </StyledLink>
                    </li>
                </StyledList></li>

                <li><StyledList>
                    Reducers
                    <StyledLink
                        as={NavLink}
                        to={`/reducer`}
                    >
                        Reducer
                    </StyledLink>
                </StyledList></li>

                <li>Cohorts</li>

                <li>Auth</li>

                <li>UI</li>
            </StyledList>

            <StyledFooter>
                <StyledAuthor>
                    Built by{" "}
                    <a href="https://www.fraunhofer.pt/">Fraunhofer AICOS</a>
                </StyledAuthor>
            </StyledFooter>
        </Wrapper>
    );
}

const Logo = styled(Link, {
    paddingTop: 12,
    marginLeft: "$1",
});

const Wrapper = styled("div", {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "$surface",
    padding: "$1",
});

const StyledFooter = styled("footer", {
    marginTop: "auto",
});

const StyledList = styled("ul", {
    listStyle: "none",
    marginTop: "$4",
    padding: 0,
});

const StyledLink = styled("a", {
    display: "block",
    marginBottom: "$0",
    padding: "$2",
    borderRadius: "$button",
    textDecoration: "none",
    color: "$textMenu",
    transition: "$hover",

    "&.active": {
        backgroundColor: "$primaryTint",
        color: "$textMenuActive",
    },

    "&:hover": {
        backgroundColor: "$primaryTintHover",
        color: "$textMenuHover",
    },
});

const StyledAuthor = styled("div", {
    fontSize: "$xsmall",
});
