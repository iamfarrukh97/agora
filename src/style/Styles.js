import {Dimensions, StyleSheet} from 'react-native';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

export default StyleSheet.create({
  max: {
    flex: 1,
  },
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height - 100,
  },
  remoteContainer: {
    width: '100%',
    height: 150,
    position: 'absolute',
    top: 5,
  },
  remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
  main: {flex: 1, alignItems: 'center'},
  tile: {
    width: '40%',
    height: 200,
    marginHorizontal: 20,
    marginTop: 15,
  },
  backImage: {width: '100%', height: '100%'},
  title: {color: 'white', fontWeight: 'bold', fontSize: 20},
  ///////////      Create   \\\\\\\\\\\\\\\\\\
  inputData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 2,
    borderRadius: 20,
    paddingLeft: 15,
    height: 40,
    width: '80%',
    marginVertical: 15,
  },
});
