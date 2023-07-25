import NetInfo from "@react-native-community/netinfo";

export function InternetCheck() {
    return new Promise(async resolve => {
        NetInfo.fetch().then(state => {
            if (
                (state.isConnected && state.isInternetReachable) ||
                state.isInternetReachable === null
            ) {
                resolve(true);
                return;
            } else {
                if (!state.isConnected) {
                    // ErrorSnackBar("Internet is not connected!");

                    resolve(false);
                    return;
                } else if (!state.isInternetReachable) {
                    // ErrorSnackBar("Internet is not Reachable!");

                    resolve(false);
                    return;
                } else {
                    // ErrorSnackBar("Something went wrong with your Internet Connection!");

                    resolve(false);
                    return;
                }
            }
        });
    });
}

export function subscribeInternetConnectivity() {
    NetInfo.addEventListener(state => {
        if (
            (state.isConnected && state.isInternetReachable) ||
            state.isInternetReachable === null
        ) {
            return;
        } else {
            if (!state.isConnected) {
                // ErrorSnackBar("Internet is not connected!");

                return;
            } else if (!state.isInternetReachable) {
                // ErrorSnackBar("Internet is not Reachable!");

                return;
            } else {
                // ErrorSnackBar("Something went wrong with your Internet Connection!");

                return;
            }
        }
    });
}


export function fetchInternetDetails() {
    return new Promise(async resolve => {
        NetInfo.fetch().then(state => {
            if (
                (state.isConnected && state.isInternetReachable) ||
                state.isInternetReachable === null
            ) {
                resolve(true);
                return;
            } else {
                if (!state.isConnected) {
                    resolve(false);
                    return;
                } else if (!state.isInternetReachable) {
                    resolve(false);
                    return;
                } else {
                    resolve(false);
                    return;
                }
            }
        });
    });
}