import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import Styles from '@style/Styles';
import axiosInstance from '@api/axios';
import {CREATETOUR} from '@api/Endpoint';
const Create = ({route, navigation}) => {
  const [tourName, setTourName] = useState('');
  const [tourImage, settourImage] = useState('');

  const handleCreateTour = async () => {
    const url = CREATETOUR;
    axiosInstance
      .post(url, {tourName, tourImage})
      .then(res => {
        console.log('res ', res.data);
        setTourName('');
        settourImage('');
      })
      .catch(error => {
        console.log('error ', error);
        alert('Error Occured');
      });
  };
  useEffect(() => {}, []);

  return (
    <View style={Styles.max}>
      <View style={Styles.inputData}>
        <TextInput
          style={Styles.textInput}
          placeholder="Tour Name"
          value={tourName}
          onChangeText={text => setTourName(text)}
        />
        <TextInput
          style={Styles.textInput}
          placeholder="Image Url"
          value={tourImage}
          onChangeText={text => settourImage(text)}
        />

        <TouchableOpacity
          onPress={() => handleCreateTour()}
          style={Styles.button}>
          <Text style={Styles.buttonText}> Create Tour </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Create;
