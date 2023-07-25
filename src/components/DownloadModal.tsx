import React, { Component } from 'react';
import { ActivityIndicator, Modal, StatusBar, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Language } from '../locales';
import CustomButton from './CustomButton';


interface DMInterface {
    style?: StyleProp<ViewStyle>;
    modalStyle: object;
    innerModalStyle: object;
    progress: number;
    visible: boolean;
    onPress(): any;

    progressVisible?: boolean;
    title?: any;
    buttonTitle?: any;

    buttonVisible?: boolean;

    download?: boolean;
}

export default class DownloadModal extends Component<DMInterface, any> {
    constructor(props: DMInterface) {
        super(props);
        this.state = {};
    }

    public static defaultProps = {
        style: null,
        modalStyle: null,
        innerModalStyle: null,
        progress: 0,
        visible: false,
        progressVisible: false,

        title: Language["69"],
        buttonTitle: Language["36"],

        buttonVisible: true,
        download: false
    };

    render() {
        let { style, modalStyle, innerModalStyle, progress, visible, progressVisible, title, buttonTitle, buttonVisible
        } = this.props;

        var modalBackgroundStyle = {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        };

        return (
            <View style={[styles.mainContainer, style]}>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={visible}
                    onRequestClose={() => { }}>
                    <View style={[styles.container, modalBackgroundStyle, { ...modalStyle }]}>
                        <View style={[styles.innerContainerTransparentStyle, { ...innerModalStyle }]}>

                            <ActivityIndicator color={"#000"} size={40} />

                            {progressVisible &&
                                <Text style={styles.percentageText}>{progress} / {Language["9"]}</Text>}
                            <Text style={styles.downloadText}>{title}</Text>
                            {buttonVisible &&

                                <CustomButton title={buttonTitle} onPress={() => { this.props.onPress(); }} />}
                        </View>
                    </View>
                </Modal>
            </View>
        );
    } // end of Function Render
} //end of class CustomTextInput

const styles = StyleSheet.create({
    mainContainer: {
        // paddingBottom: StatusBar.currentHeight,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: StatusBar.currentHeight,
        backgroundColor: '#ecf0f1',

    },
    innerContainerTransparentStyle: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        width: "60%",
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 5
    },
    percentageText: {
        alignSelf: 'center',
        fontWeight: "bold",
        fontSize: 20,
        paddingVertical: 10
    },
    downloadText: {
        alignSelf: 'center',
        fontSize: 17,
        paddingVertical: 10
    }


}); //end of StyleSheet STYLES
