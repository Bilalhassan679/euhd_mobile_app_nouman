import React, { Component } from 'react';
import { Platform, SafeAreaView, StatusBar, View, ScrollView, Image, RefreshControl, FlatList, TouchableOpacity } from 'react-native';
import { styles, noDataStyles } from './styles';
import Text from '../../components/CustomText';
import CustomHeader from '../CustomHeader';
import colors from '../../constants/colors';
import localImages from '../../constants/localImages';
import RNFS from 'react-native-fs';
import { LOCAL_DOWNLOAD_PATH } from '../../helper/Download';
import { emptyValidate } from '../../helper/genericFunctions';
import FileViewer from 'react-native-file-viewer';
//end of IMPORT's

export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            data: []
        };//end of INITIALIZING STATE's
    }//end of CONSTRUCTOR

    componentDidMount = async () => {
        this.load();

    }//end of COMPONENT_DID_MOUNT

    componentWillUnmount = async () => {
    }//end of COMPONENT_WILL_UNMOUNT

    load = async () => {
        if (Platform.OS === "ios") {
            this.getIOSDocuments();
        }
    }//end of LOAD FUNCTION

    getIOSDocuments = async () => {
        RNFS.readDir(LOCAL_DOWNLOAD_PATH)
            .then((result) => {
                console.log('GOT RESULT', JSON.stringify(result));
                if (emptyValidate(result) && result.length > 0) {
                    result = result.sort(function (a, b) {
                        let aDate = a.mtime;
                        let bDate = b.mtime;

                        return new Date(bDate) - new Date(aDate);
                    });
                    this.setState({
                        data: result
                    })
                }
                // stat the first file

            }).catch((err) => {
                console.log(err.message, err.code);
            });
    }//end of getIOSDocuments

    backPress = () => {
        this.props.navigation.pop() && this.props.navigation.goBack();
    }//end of BACK PRESS

    _renderHeader = () => {
        return (
            <>
                {Platform.OS === "ios" ?
                    <>
                        <SafeAreaView style={{ backgroundColor: colors.header }} />
                        <StatusBar backgroundColor={colors.header} barStyle={"dark-content"} />
                        <CustomHeader backVisible backPress={this.backPress} />
                    </>
                    :
                    <>
                        <SafeAreaView />
                        <StatusBar backgroundColor={colors.statusbar} barStyle={"dark-content"} />
                    </>
                }
            </>
        )
    }//end of _renderHeader

    _renderEmpty = () => {
        return (
            <View style={noDataStyles.container}>
                <Image source={localImages.noDownload} style={{ ...noDataStyles.image }} />
                <Text style={noDataStyles.heading}>
                    {`No downloads yet`}
                </Text>
                <Text style={noDataStyles.text}>
                    {"Any new downloads will appear here."}
                </Text>
            </View>
        )
    }//end of _renderEmpty

    renderSeparator = () => {
        return <View style={styles.separator} />
    };//end of renderSeparator

    formatDate = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    }//end of formatDate

    humanFileSize = (bytes, si = false, dp = 1) => {
        const thresh = si ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10 ** dp;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


        return bytes.toFixed(dp) + ' ' + units[u];
    }//end of humanFileSize

    render = () => {
        let NAME_LENGTH = 200;
        return (
            <View style={styles.primaryContainer}>
                {this._renderHeader()}
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={this.state.data.length > 0 ? {} : {
                        flexGrow: 1,
                    }}
                    bounces
                    refreshControl={<RefreshControl
                        colors={["#3cba54", "#f4c20d", "#db3236", "#4885ed"]}
                        refreshing={this.state.refreshing}
                        onRefresh={this.load} />
                    }>
                    {this.state.data.length > 0 ?
                        <FlatList
                            data={this.state.data}
                            ItemSeparatorComponent={this.renderSeparator}

                            renderItem={data => {
                                let { item, index } = data;
                                return (
                                    <>
                                        <TouchableOpacity style={styles.card} onPress={() => { this.itemPress(data) }}>
                                            {emptyValidate(item.mtime) &&
                                                // <Text style={styles.dateTime}>{new Date(item.mtime).toLocaleDateString()} {new Date(item.mtime).toLocaleTimeString()}</Text>
                                                <Text style={styles.dateTime}>{this.formatDate(item.mtime)}</Text>
                                            }
                                            {emptyValidate(item.name) &&
                                                <Text style={styles.name}> {item.name.length < NAME_LENGTH
                                                    ? `${item.name}`
                                                    : `${item.name.substring(0, NAME_LENGTH)}...`}
                                                </Text>
                                            }
                                            {emptyValidate(item.size) &&
                                                <Text style={styles.size}>{`${this.humanFileSize(item.size)}`}</Text>
                                            }
                                            {emptyValidate(item.body) &&
                                                <Text style={styles.body}>{item.body.length < BODY_LENGTH
                                                    ? `${item.body}`
                                                    : `${item.body.substring(0, BODY_LENGTH)}...`}</Text>
                                            }
                                        </TouchableOpacity>
                                        {index === this.state.data.length - 1 &&
                                            this.renderSeparator()
                                        }
                                    </>

                                )
                            }}
                        />

                        : this._renderEmpty()}
                </ScrollView>
            </View>
        );
    }//end of RENDER

    itemPress = async (data) => {
        let { item, index } = data;

        let path = item.path
        // let url = "/var/mobile/Containers/Data/Application/A592CCFD-8C99-4BC1-AC72-CC313427524A/Library/Caches/EUHD/UTF-8''05-Lesson%2002-Search%20Minimax.mp4"
        // let url = "/var/mobile/Containers/Data/Application/A592CCFD-8C99-4BC1-AC72-CC313427524A/Library/Caches/EUHD/UTF-8''Phlebotomy%20Lect.%205.pdf"
        // let url = "/Users/adeel/Library/Developer/CoreSimulator/Devices/FBA80209-A16C-465B-8023-096202030FB9/data/Media/DCIM/100APPLE/IMG_0001.JPG"
        // let url = "/var/mobile/Containers/Data/Application/5A945C5A-54F1-4C95-B864-016324A99E3E/Downloads/UTF-8''Phlebotomy%20Lect.%205.pdf"
        // let url = "https://github.com/vinzscam/react-native-file-viewer"

        FileViewer.open(path, { showOpenWithDialog: true, showAppsSuggestions: true })
            .then(() => {
                // success
            })
            .catch(error => {
                // error
                console.warn("ERROR WHILE OPENING", error);
            });

    }//end of itemPress

}//end of CLASSS index