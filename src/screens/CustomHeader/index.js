import React, { Component } from "react";
import { StyleSheet, View, Text, ViewStyle, StyleProp, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import localImages from "../../constants/localImages";
import { getStatusBarHeight } from "../../helper/GetStatusBarHeight";
import colors from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
//END OF IMPORT's

export default class CustomHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }//end of CONSTRUCTOR

    render = () => {
        let { containerStyle, downloadVisible = false, downloadPress, backVisible = false, backPress, } = this.props;

        return (

            <LinearGradient start={{ x: 0, y: 3 }} end={{ x: 1, y: 0 }} colors={[colors.header2, colors.header, colors.header3]}
                style={[styles.containerStyle, containerStyle]}>


                {backVisible &&
                    <TouchableOpacity onPress={() => { backPress() }} style={styles.backImageContainer}>
                        <Image source={localImages.arrowBack} style={styles.backImage} />
                    </TouchableOpacity>
                }

                {downloadVisible &&
                    <TouchableOpacity onPress={() => { downloadPress() }} style={styles.downloadImageContainer}>
                        <Image source={localImages.download} style={styles.downloadImage} />
                    </TouchableOpacity>
                }
            </LinearGradient>
        )
    }

} //end of class Header


const styles = StyleSheet.create({
    containerStyle: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.header,
        // zIndex: 1,
        // position: "absolute",
        // top: getStatusBarHeight(),
        // left: 0,
    },
    backImageContainer: {

    },
    backImage: {
        width: 30,
        resizeMode: "contain",
        height: 30,
    },
    downloadImageContainer: {
        alignSelf: "flex-end",

    },
    downloadImage: {
        width: 30,
        resizeMode: "contain",
        height: 30,
    },
}); //end of StyleSheet STYLES
