import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import Styles from '@style/Styles';
import requestCameraAndAudioPermission from '@components/Permission';
import axiosInstance from '@api/axios';
import {CREATECHANNEL} from '@api/Endpoint';
const Live = ({route, navigation}) => {
  console.log('route.params ', route.params.item);
  const {_id, tourName, tourToken} = route.params.item;
  const appId = 'e2168f29e26546e6b16b92e31a9b643f';

  const [channelName, setChannelName] = useState(tourName);
  const [token, setToken] = useState(tourToken);
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([]);
  const [_engine, setEngine] = useState(undefined);
  const init = async () => {
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
  const handleCreateChannel = async () => {
    const url = CREATECHANNEL;
    axiosInstance
      .patch(url, {_id, tourName})
      .then(res => {
        console.log('res ', res.data);
        setToken(res.data.data.tour.tourToken);
        setChannelName(res.data.data.tour.tourName);
      })
      .catch(error => {
        console.log('error ', error);
      });
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
      {token ? (
        <View style={Styles.buttonHolder}>
          <TouchableOpacity onPress={() => startCall()} style={Styles.button}>
            <Text style={Styles.buttonText}> Start Call </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => endCall()} style={Styles.button}>
            <Text style={Styles.buttonText}> End Call </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={Styles.buttonHolder}>
          <TouchableOpacity
            onPress={() => handleCreateChannel()}
            style={Styles.button}>
            <Text style={Styles.buttonText}> Get Token </Text>
          </TouchableOpacity>
        </View>
      )}
      {_renderVideos()}
    </View>
  );
};
export default Live;
