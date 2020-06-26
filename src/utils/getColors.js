const getColors = (param) => {
    const colors = ["var(--very_good)", "var(--good)", "var(--norm)", "var(--bad)", "var(--very_bad)"];
    if (param === "mood") colors.reverse();
    return colors;
};

export default getColors;
