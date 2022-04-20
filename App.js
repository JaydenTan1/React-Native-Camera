import React, {useState,useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image } from 'react-native';
import {Camera} from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

export default function App(){
  const [hasCameraPermission, setHasCameraPermission] = useState(null); 
  const [hasSavePermission, setHasSavePermission] = useState(null); 
  const [camera, setCamera] = useState(null); 
  const [status, setrequestPermission] = MediaLibrary.usePermissions();
  // const [status, setrequestPermission] = useState(MediaLibrary.usePermissions(null));
  const [image,setImage] = useState(null); 
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const  CameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(CameraStatus.status === 'granted');

      const SaveStatus = await MediaLibrary.requestPermissionsAsync();
      setrequestPermission(SaveStatus.status === 'granted');
    })();
  }, []);
  
  const takePicture = async () => {
    if (camera){
      const options = {quality: 1, skipProcessing:true}
      let data = await camera.takePictureAsync(options);
      console.log(data.uri)
      setImage(data.uri);
      // const status = await MediaLibrary.getPermissionsAsync(true);//Question!!！Why can't get the permission of saving.
      console.log(status);
      if (status === null){
          return;
        }
      else{
        if (status.status === "granted"){
        const assert = await MediaLibrary.saveToLibraryAsync(data.uri);
        console.log("picture:", assert)
        }else{
        console.log("miss a permission")
        }
      }
    } 
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      console.log("111");
    }
  };

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
  <View style = {{ flex : 1 }}>
    <View style = {styles.container}>
      <Camera
        ref= {ref => setCamera(ref)}
        style = {styles.fixedRatio}
        type = {type}
        ratio = {'1 : 1'}/>
    </View>
    
    <Button 
      title = "Flip"
      onPress={() => {
          setType(
            type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
             );
           }}>
           <Text style={styles.text}> Flip </Text>
         </Button>
         <Button title = "take picture" onPress = {() => takePicture()}/>
         <Button title = "take image" onPress = {() => pickImage()}/>
        {image && <Image source = {{uri: image}} style = {{flex : 1 }}/>}
    </View>
  
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   flexDirection: 'row',
 },
 fixedRatio:{
  flex : 1,
  aspectRatio : 1
 },
 camera: {
   flex: 1,
 },
 buttonContainer: {
   flex: 1,
   backgroundColor: 'transparent',
   flexDirection: 'row',
   margin: 20,
 },
 button: {
   flex: 0.1,
   alignSelf: 'flex-end',
   alignItems: 'center',
 },
 text: {
   fontSize: 18,
   marginBottom: 10,
   color: 'white',
 },
});