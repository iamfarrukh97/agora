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

const UserType = ({navigation}) => {
  const [tours, setTours] = useState([]);

  return (
    <View style={Styles.main}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home', {userType: 'host'})}>
          <View
            style={{
              backgroundColor: 'orange',
              width: 100,
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 10,
            }}>
            <Text>Host</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home', {userType: 'guest'})}>
          <View
            style={{
              backgroundColor: 'green',
              width: 100,
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 10,
            }}>
            <Text>Guest</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default UserType;
