import * as React from "react";
import {
    NativeSyntheticEvent,
    StyleSheet,
    TextInput,
    TextInputFocusEventData,
    TextInputProps,
    ViewStyle,
    View,
    StyleProp
} from "react-native";
import CustomText from "./CustomText";
import { emptyValidate } from "../helper/genericFunctions";
import { marginSizesHeight } from "../constants/sizes";

interface State {
    isFocused?: boolean;
}

interface customStates {
    bottomText?: any;
    errorText?: any;
    error?: boolean;
    textInputStyle?: StyleProp<ViewStyle>;
}

interface allInterface extends State, customStates, TextInputProps {

}

// const BLUE = "#428AF8";
// const BLUE = "#616161";
// const LIGHT_GRAY = "#D3D3D3";
// const ERROR = "#BB0000";
// const TEXT = "#bbbbbd"
//ABOVE ARE OLD

const BLUE = "#616161";
const LIGHT_GRAY = "#D3D3D3";
const ERROR = "#F32013";
const TEXT = "#000000"

// export default class CustomTextInput extends React.Component<TextInputProps, State> {
export default class CustomTextInput extends React.Component<allInterface, any> {
    state = {
        isFocused: false,
        error: false
    };

    handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        this.setState({ isFocused: true });
        if (this.props.onFocus) {
            this.props.onFocus(e);
        }
    };

    handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        this.setState({ isFocused: false });
        if (this.props.onBlur) {
            this.props.onBlur(e);
        }
    };

    render() {
        const { isFocused } = this.state;
        const { onFocus, onBlur, error, errorText, bottomText, textInputStyle, ...otherProps } = this.props;
        if (this.props.style) {
            console.error("Cannot use Style in custom textinput");
            return;
        }
        return (
            <View>
                <TextInput
                    selectionColor={BLUE}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    placeholderTextColor={error ? ERROR : TEXT}
                    style={[styles.textInput, textInputStyle,
                    {
                        color: TEXT,
                        borderColor: error ? ERROR : isFocused ? BLUE : LIGHT_GRAY,

                    }
                    ]}
                    {...otherProps}
                />
                {emptyValidate(bottomText) || emptyValidate(errorText) &&
                    <CustomText style={{
                        marginTop: -5,
                        color: error ? ERROR : TEXT
                    }} >{error ? errorText : bottomText}</CustomText>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        height: "auto",
        paddingHorizontal: marginSizesHeight._16,
        borderWidth: 2,
        borderRadius: 5,
    }
});