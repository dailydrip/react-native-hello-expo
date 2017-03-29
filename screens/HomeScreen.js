import React from "react";
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  ListView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Exponent from "expo";
import { Contacts, Constants, Location, Permissions } from "expo";

import { MonoText } from "../components/StyledText";

export default class HomeScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false
    }
  };

  constructor(props) {
    super(props);
    let contacts = [{ name: "Loading..." }];
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: this.ds.cloneWithRows(contacts),
      location: null,
      errorMessage: null
    };
  }

  showFirstContactAsync = () => {
    Exponent.Contacts.getContactsAsync().then(contacts => {
      if (contacts.length > 0) {
        let dataSource = this.ds.cloneWithRows(contacts);
        console.log(contacts);
        this.setState({ dataSource });
      }
    });
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  componentWillMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage: "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      this._getLocationAsync();
    }
  }

  render() {
    this.showFirstContactAsync();

    let location = "Waiting..";
    if (this.state.errorMessage) {
      location = this.state.errorMessage;
    } else if (this.state.location) {
      location = JSON.stringify(this.state.location);
    }

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.welcomeContainer}>
            <Image
              source={require("../assets/images/expo-wordmark.png")}
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>

            <MonoText style={styles.getStartedText}>
              Get Contacts and Location
            </MonoText>

            <ListView
              dataSource={this.state.dataSource}
              renderRow={rowData => <Text>{rowData.name}</Text>}
            />
          </View>
          <Text>{location}</Text>
        </ScrollView>
      </View>
    );
  }

  _handleLearnMorePress = () => {
    Linking.openURL("https://docs.expo.io/versions/latest/guides/development-mode");
  };

  _handleHelpPress = () => {
    Linking.openURL(
      "https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes"
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 15,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 80
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 140,
    height: 38,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 23,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
