//@ts-ignore
import React, { Component } from 'react';
//@ts-ignore
import { StyleSheet, View, TouchableOpacity, StyleProp, TouchableOpacityProps, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import Text from './CustomText';
import { fontSizes } from '../constants/sizes';
//END OF IMPORT's


interface componentInterface {
    styleButton?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>;
    title?: any;
    mode?: "default" | "text";
    disabled?: boolean;
    textColor?: any;
    backgroundColor?: any;
    loading: boolean;
}//end of INTERFACE 

const colors = {
    background: "#fc5356",
    text: "#FFFFFF",
    shadow: "#fff",

    backgroundDisable: "#dbdbdb",
    textDisable: "#fc5356",

    backgroundTransparent: "rgba(0,0,0,0)",
    textTransparent: "#fc5356",
}

interface allInterface extends componentInterface, TouchableOpacityProps {

}

export default class CustomButton extends Component<allInterface, any> {

    public static defaultProps = {
        mode: "default",
        disabled: false,
        textColor: colors.text,
        backgroundColor: colors.background,
        loading: false
    };//end of DEFAULT PROPS DECLARATION

    render() {
        //@ts-ignore
        let { styleButton, textStyle, title, disabled, mode, backgroundColor, textColor, loading, ...OtherProps } = this.props;
        return (
            <TouchableOpacity disabled={disabled} style={[styles.button, styleButton, {
                backgroundColor: disabled ? colors.backgroundDisable : mode === "default" ? backgroundColor : backgroundColor !== colors.background ? backgroundColor : colors.backgroundTransparent
            }]} {...OtherProps}>
                {loading ?
                    <ActivityIndicator color={
                        disabled ? colors.textDisable : mode === "default" ? textColor : textColor !== colors.text ? textColor : colors.textTransparent
                    } size="small" />
                    :
                    <Text style={[styles.text, textStyle, {
                        color: disabled ? colors.textDisable : mode === "default" ? textColor : textColor !== colors.text ? textColor : colors.textTransparent
                    }]}>{title}</Text>
                }
            </TouchableOpacity>
        )
    } // end of Function Render

} //end of class CustomButton


const styles = StyleSheet.create({
    button: {
        display: 'flex',
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: colors.shadow,
        // backgroundColor: '#2AC062',
        // shadowColor: '#2AC062',
        shadowOpacity: 0.4,
        shadowOffset: { height: 10, width: 0 },
        shadowRadius: 20,
    },

    text: {
        fontSize: fontSizes._16,
        textTransform: 'uppercase',
        // color: '#FFFFFF',
    },
}); //end of StyleSheet STYLES
