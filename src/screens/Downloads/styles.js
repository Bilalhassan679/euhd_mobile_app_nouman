import { StyleSheet, } from 'react-native';
import colors from '../../constants/colors';
import { hexToRgbA } from "../../helper/genericFunctions";

export const styles = StyleSheet.create({
    primaryContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    separator: {
        width: "100%",
        height: 1,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
        // marginBottom: 16,
        // marginTop: marginSizesHeight._8,
    },
    card: {
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        padding: 16,
        backgroundColor: colors.card,
        // shadowColor: colors.shadow,
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 3,
    },
    dateTime: {
        color: hexToRgbA(colors.text969696, 90),
        fontSize: 8,
        marginBottom: -2,
        fontStyle: "italic"
    },
    name: {
        fontWeight: 'bold',
        color: colors.text212121,
        fontSize: 16,
        marginBottom: 6,
        marginLeft: -6,
        marginTop: 6,
    },
    size: {
        color: hexToRgbA(colors.text212121, 30),
        fontSize: 12,
    },
});//end of styles

const globalStyle = {
    screenPadding: 16,
    heading: {
        fontWeight: 'bold',
        color: colors.text212121,
        fontSize: 22,
        lineHeight: 27,
        letterSpacing: -0.78
    },
    cardTitleStyle: {
        fontWeight: 'bold',
        color: colors.text212121,
        fontSize: 14,
        lineHeight: 24,
        letterSpacing: -0.48,
        marginBottom: 16
    },
}

export const noDataStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: globalStyle.screenPadding
    },
    containerWithOutCenter: {
        flex: 1,
        paddingHorizontal: globalStyle.screenPadding
    },
    image: {
        // width: "100%",
        // height: "30%",
        width: 120,
        height: 120,
        resizeMode: "stretch"
    },
    heading: {
        ...globalStyle.heading,
        color: hexToRgbA(colors.text212121, 50),
        textAlign: "center"
    },
    text: {
        ...globalStyle.cardTitleStyle,
        color: hexToRgbA(colors.text212121, 40),
        textAlign: "center",
        fontWeight: "500"
    }
})