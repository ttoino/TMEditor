import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { styled } from "@common/theme";
import type { PageName } from "@types";
import { useUIConfig } from "@common/config-provider";

interface Props {
    pages: PageName[];
}

export default function Sidebar({ pages }: Props) {
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
