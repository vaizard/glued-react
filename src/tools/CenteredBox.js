import Box from "@material-ui/core/Box";

const CenteredBox = (props) => {
    return <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        width="100%"
    >
        {props?.children}
    </Box>
};

const marginCss = {
    marginTop: "10px",
    marginBottom: "10px",
}

const HorizontalCenteredBox = (props) => {
    return <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        style={marginCss}
    >
        {props?.children}
    </Box>
};

export default CenteredBox;
export {HorizontalCenteredBox}