import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Platform, ScrollView} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
  ChannelProfile,
  ClientRole,
} from 'react-native-agora';
import Styles from '@style/Styles';
import requestCameraAndAudioPermission from '@components/Permission';
import axiosInstance from '@api/axios';
import {CREATECHANNEL} from '@api/Endpoint';
const Live = ({route, navigation}) => {
  const {_id, tourName, tourToken} = route.params.item;
  const {userType} = route.params;
  const appId = 'e2168f29e26546e6b16b92e31a9b643f';
  const [channelName, setChannelName] = useState('');
  const [token, setToken] = useState(tourToken);
  const [userAccount, setUid] = useState('');

  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([]);
  const [_engine, setEngine] = useState(undefined);
  const init = async () => {
    const eng = await RtcEngine.create(appId);
    await eng.enableVideo();

    eng.addListener('Warning', warn => {
      // console.log('Warning', warn);
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
    eng.addListener('JoinChannelSuccess', (channel, uid, elapsed, role) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed, role);
      // Set state variable to true
      setJoinSucceed(true);
    });
    setEngine(eng);
  };
  const startCall = async () => {
    try {
      await _engine?.joinChannelWithUserAccount(
        token,
        channelName,
        userAccount,
      );
    } catch (error) {
      console.log('error ', error);
    }
  };

  const endCall = async () => {
    await _engine?.leaveChannel();
    setJoinSucceed(false);
    setPeerIds([]);
  };
  const handleCreateChannel = async () => {
    // await _engine.setChannelProfile(
    //     ChannelProfile.LiveBroadcasting,
    //   );
    console.log(
      'profile ',
      await _engine.setChannelProfile(ChannelProfile.LiveBroadcasting),
    );
    console.log('userType', userType);
    if (userType == 'host') {
      await _engine?.setClientRole(ClientRole.Broadcaster);
    }
    let r = (Math.random() + 1).toString(36).substring(7);
    console.log('random', r);
    const url = CREATECHANNEL;
    axiosInstance
      .patch(url, {_id: r, tourName, userType})
      .then(res => {
        console.log('res ', res.data);
        setToken(res.data.data.token);
        setChannelName(res.data.data.channelName);
        setUid(res.data.data.uid);
      })
      .catch(error => {
        console.log('error ', error);
      });
  };
  if (Platform.OS === 'android') {
    // Request required permissions from Android
    requestCameraAndAudioPermission().then(() => {
      // console.log('requested!');
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
        {/* {_renderRemoteVideos()} */}
      </View>
    ) : null;
  };

  // const _renderRemoteVideos = () => {
  //   return (
  //     <ScrollView
  //       style={Styles.remoteContainer}
  //       contentContainerStyle={{paddingHorizontal: 2.5}}
  //       horizontal={true}>
  //       {peerIds.map(value => {
  //         console.log('peerIds ', value);
  //         return (
  //           <RtcRemoteView.SurfaceView
  //             key={value}
  //             style={Styles.remote}
  //             uid={value}
  //             channelId={channelName}
  //             renderMode={VideoRenderMode.Hidden}
  //             zOrderMediaOverlay={true}
  //           />
  //         );
  //       })}
  //     </ScrollView>
  //   );
  // };
  const _renderRemoteVideos = () => {
    return (
      <View style={Styles.fullView}>
        {peerIds.map(value => {
          console.log('_renderRemoteVideos peerIds ', value);
          return (
            <RtcRemoteView.SurfaceView
              key={value}
              style={Styles.remote}
              uid={value}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
          );
        })}
      </View>
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
      {userType == 'host' ? _renderVideos() : _renderRemoteVideos()}
    </View>
  );
};
export default Live;
