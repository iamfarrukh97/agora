import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import RtcEngine, {
  RtcChannel,
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import requestCameraAndAudioPermission from './components/Permission';
import styles from './components/Style';
import axiosInstance from '@api/axios';
import {CREATECHANNEL} from '@api/Endpoint';
const App = () => {
  const appId = 'e2168f29e26546e6b16b92e31a9b643f';
  const token =
    '006e2168f29e26546e6b16b92e31a9b643fIABfcViLPJSJEnUhh9PLxFUfKiYRd0OVtcKEiTtO/xD7XhOsjjwAAAAAEAAZkwHZv7wkYQEAAQC+vCRh';
  const channelName = 'new';
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');

  const [peerIds, setPeerIds] = useState([]);
  const [_engine, setEngine] = useState(undefined);
  const [_channel, setChannel] = useState(undefined);

  const init = async () => {
    const eng = await RtcEngine.create(appId);
    await eng.enableVideo();

    eng.addListener('Warning', warn => {
      console.log('Warning', warn);
    });

    eng.addListener('Error', err => {
      console.log('Error', err);
    });

    eng.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      // Get current peer IDs
      // If new user
      if (peerIds.indexOf(uid) === -1) {
        // Add peer ID to state array
        setPeerIds([...peerIds, uid]);
      }
    });

    eng.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);

      // Remove peer ID from state array
      setPeerIds(peerIds.filter(id => id !== uid));
    });

    // If Local user joins RTC channel
    eng.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      // Set state variable to true
      setJoinSucceed(true);
    });
    setEngine(eng);
  };

  const handleCreateChannel = async () => {
    // Join Channel using null token and channel name
    // const chan = await RtcChannel.create(newChannelName);
    // setChannel(chan);
    // console.log('chan ', chan);
    const url = CREATECHANNEL;
    console.log('newChannelName', newChannelName);
    axiosInstance
      .post(url, {newChannelName})
      .then(res => {
        console.log('res ', res.data);
      })
      .catch(error => {
        console.log('error ', error);
      });
  };
  const startCall = async () => {
    // Join Channel using null token and channel name
    await _engine?.joinChannel(token, channelName, null, 0);
  };

  const endCall = async () => {
    await _engine?.leaveChannel();
    setJoinSucceed(false);
    setPeerIds([]);
  };
  if (Platform.OS === 'android') {
    // Request required permissions from Android
    requestCameraAndAudioPermission().then(() => {
      console.log('requested!');
    });
  }
  useEffect(() => {
    init();
  }, []);
  const _renderVideos = () => {
    return joinSucceed ? (
      <View style={styles.fullView}>
        <RtcLocalView.SurfaceView
          style={styles.max}
          channelId={newChannelName}
          renderMode={VideoRenderMode.Hidden}
        />
        {_renderRemoteVideos()}
      </View>
    ) : null;
  };

  const _renderRemoteVideos = () => {
    return (
      <ScrollView
        style={styles.remoteContainer}
        contentContainerStyle={{paddingHorizontal: 2.5}}
        horizontal={true}>
        {peerIds.map(value => {
          return (
            <RtcRemoteView.SurfaceView
              style={styles.remote}
              uid={value}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
          );
        })}
      </ScrollView>
    );
  };
  return (
    <SafeAreaView style={styles.max}>
      <TextInput
        style={styles.channelInput}
        onChangeText={text => setNewChannelName(text)}
        value={newChannelName}
      />
      <TouchableOpacity
        onPress={() => handleCreateChannel()}
        style={styles.button}>
        <Text style={styles.buttonText}> Create Channel </Text>
      </TouchableOpacity>
      <View style={styles.buttonHolder}>
        <TouchableOpacity onPress={() => startCall()} style={styles.button}>
          <Text style={styles.buttonText}> Start Call </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => endCall()} style={styles.button}>
          <Text style={styles.buttonText}> End Call </Text>
        </TouchableOpacity>
      </View>
      {_renderVideos()}
    </SafeAreaView>
  );
};

export default App;
