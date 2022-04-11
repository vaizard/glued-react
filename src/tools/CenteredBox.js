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


export default CenteredBox;