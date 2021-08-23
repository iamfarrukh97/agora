import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import Styles from '@style/Styles';
import requestCameraAndAudioPermission from '@components/Permission';
const Live = ({route, navigation}) => {
  const {appId, channelName, token} = route.params.data.data;
  console.log('route.params', route.params.data.data);
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([]);
  const [_engine, setEngine] = useState(undefined);
  const init = async () => {
    console.log('appid ', appId);
    const eng = await RtcEngine.create(appId);
    console.log('eng ', eng);
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
      <View style={Styles.fullView}>
        <RtcLocalView.SurfaceView
          style={Styles.max}
          channelId={channelName}
          renderMode={VideoRenderMode.Hidden}
        />
        {_renderRemoteVideos()}
      </View>
    ) : null;
  };

  const _renderRemoteVideos = () => {
    return (
      <ScrollView
        style={Styles.remoteContainer}
        contentContainerStyle={{paddingHorizontal: 2.5}}
        horizontal={true}>
        {peerIds.map(value => {
          return (
            <RtcRemoteView.SurfaceView
              style={Styles.remote}
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
    <View style={Styles.max}>
      <View style={Styles.buttonHolder}>
        <TouchableOpacity onPress={() => startCall()} style={Styles.button}>
          <Text style={Styles.buttonText}> Start Call </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => endCall()} style={Styles.button}>
          <Text style={Styles.buttonText}> End Call </Text>
        </TouchableOpacity>
      </View>
      {_renderVideos()}
    </View>
  );
};
export default Live;
