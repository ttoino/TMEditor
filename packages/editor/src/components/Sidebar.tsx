import React from "react";
import { Link, NavLink } from "react-router-dom";

import { styled } from "@common/theme";
import type { DBConfig, PageName } from "@types";
import { useUIConfig } from "@common/config-provider";
import { MdAdd } from "react-icons/md";
import IconButton from "./IconButton";

interface Props {
    pages: PageName[];
    databases: DBConfig[];
}

export default function Sidebar({ pages, databases }: Props) {
    const uiConfig = useUIConfig();

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
                <li>
                    <StyledSubList>
                        <StyledListTitle>
                            Connectors
                            <IconButton>
                                <MdAdd />
                            </IconButton>
                        </StyledListTitle>

                        {databases?.map(({ id }) => (
                            <li key={id}>
                                <StyledLink to={`/databases/${id}`}>
                                    {id}
                                </StyledLink>
                            </li>
                        ))}
                    </StyledSubList>
                </li>

                <li>
                    <StyledSubList>
                        <StyledListTitle>
                            Pages
                            <IconButton>
                                <MdAdd />
                            </IconButton>
                        </StyledListTitle>

                        {pages?.map(({ fileName, name }) => (
                            <li key={fileName}>
                                <StyledLink to={`/pages/${fileName}`}>
                                    {name}
                                </StyledLink>
                            </li>
                        ))}
                    </StyledSubList>
                </li>

                <li>
                    <StyledLink to="/reducers">Reducers</StyledLink>
                </li>

                {/* TODO */}
                {/* <li>Cohorts</li> */}

                {/* TODO */}
                {/* <li>Auth</li> */}

                {/* TODO */}
                {/* <li>UI</li> */}
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
    gap: "$4",
    backgroundColor: "$surface",
    padding: "$1",
});

const StyledFooter = styled("footer", {
    marginTop: "auto",
});

const StyledList = styled("ul", {
    display: "flex",
    flexDirection: "column",
    gap: "$2",
    listStyle: "none",
    padding: 0,
});

const StyledSubList = styled("ul", {
    display: "flex",
    flexDirection: "column",
    gap: "$0",
    listStyle: "none",
    padding: 0,
});

const StyledListTitle = styled("span", {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginInlineStart: "$2",
    marginBlockEnd: "$0",
    fontWeight: "600",
});

const StyledLink = styled(NavLink, {
    display: "flex",
    alignItems: "center",
    gap: "$1",
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
