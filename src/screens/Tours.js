import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from 'react-native';
import axiosInstance from '@api/axios';
import {CREATECHANNEL} from '@api/Endpoint';
import Styles from '@style/Styles';

const Tours = ({navigation}) => {
  const [newChannelName, setNewChannelName] = useState('');
  const handleCreateChannel = async item => {
    const url = CREATECHANNEL;
    axiosInstance
      .post(url, item)
      .then(res => {
        console.log('res ', res.data);
        navigation.navigate('Live', {data: res.data});
      })
      .catch(error => {
        console.log('error ', error);
      });
  };
  const image = {
    uri: 'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg',
  };
  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'Islamabad',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Rawalpindi',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Lahore',
    },
    {
      id: '58694a0f-3da1-sase-bd96-145571e29d72',
      title: 'Karachi',
    },
    {
      id: '58694a0f-3da1-471f-1qww-145571e29d72',
      title: 'Peshawar',
    },
  ];
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={Styles.tile}
      onPress={() => handleCreateChannel(item)}>
      <ImageBackground source={image} style={Styles.backImage}>
        <Text style={Styles.title}>{item.title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
  return (
    <View style={Styles.main}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
      />
    </View>
  );
};
export default Tours;
