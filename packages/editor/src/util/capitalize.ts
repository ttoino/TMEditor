const capitalize: <S extends string>(str: S) => Capitalize<S> = (str) =>
    str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : "";

export default capitalize;
