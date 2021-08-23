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
import {GETALLTOURS} from '@api/Endpoint';
import Styles from '@style/Styles';

const Tours = ({navigation}) => {
  const [tours, setTours] = useState([]);
  useEffect(() => {
    const url = GETALLTOURS;
    axiosInstance
      .get(url)
      .then(res => {
        // console.log('res ', JSON.stringify(res.data.data.tours));
        setTours(res.data.data.tours);
      })
      .catch(error => {
        console.log('error ', error);
      });
  }, []);
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={Styles.tile}
        onPress={() => navigation.navigate('Live', {item})}>
        <ImageBackground
          source={{uri: item.tourImage}}
          style={Styles.backImage}>
          <Text style={Styles.title}>{item.tourName}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={Styles.main}>
      <FlatList
        data={tours}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        numColumns={2}
      />
    </View>
  );
};
export default Tours;
