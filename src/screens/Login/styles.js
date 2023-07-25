import { StyleSheet } from "react-native";
import colors from "../../constants/colors";
import { heightSize, marginSizesHeight, marginSizesWidth } from "../../constants/sizes";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: marginSizesWidth._16,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: "center"
    },

    textInput: {
        paddingVertical: marginSizesHeight._16,
        marginVertical: marginSizesHeight._8,

    },
    button: {
        marginTop: marginSizesHeight._30,
        marginVertical: marginSizesHeight._16
    },
    logoContainer: {
        alignSelf: 'center',
    },
    logo: {
        width: heightSize._20,
        height: heightSize._20,
        marginVertical: marginSizesHeight._16
    },

});//end of Styles