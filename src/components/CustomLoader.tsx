import React, { Component } from "react";
import { View, StyleSheet, ActivityIndicator, StyleProp, ViewStyle } from "react-native";

interface CLInterface {
    style: StyleProp<ViewStyle>;
    color: string;
    size: "large" | "small";
}

export default class CustomLoader extends Component<CLInterface, any> {
    public static defaultProps = {
        type: "MaterialIndicator",
        color: "#000",
        size: "large",
        containerStyle: null,
        mainContainerStyle: null
    };


    render() {
        //@ts-ignore
        let { style, color, size } = this.props;
        return (
            <View style={[styles.contaniner, style]}>
                <ActivityIndicator color={color} size={size} />
            </View>
        );
    } // end of Function Render
} //end of class CustomTextInput

const styles = StyleSheet.create({
    contaniner: {
        padding: 16,
        alignSelf: 'center',
    }
}); //end of StyleSheet STYLES
