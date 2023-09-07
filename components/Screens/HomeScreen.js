import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, ToastAndroid, ImageBackground, StatusBar, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import Wave from '../../assets/wave.jpg';

import { NativeModules } from 'react-native';
const DirectSms = NativeModules.DirectSms;

const { width, height } = Dimensions.get('screen');
export default function HomeScreen({ navigation }) {
    const googleApi = 'https://script.google.com/macros/s/AKfycbz1Z91319TcOQZyBfpkxh3Z0scaqK4dgpvuV7AQF3ipAUAPP2P5UqGYH9LPmSyQUqlR/exec';

    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [validName, setValidName] = useState(false);
    // const [email, setEmail] = useState('');
    // const [validEmail, setValidEmail] = useState(false);
    const [mobile, setMobile] = useState('');
    const [validMobile, setValidMobile] = useState(false);
    const [otp, setOtp] = useState('');
    const [actionOtp, setActionOtp] = useState(false);
    const [validOtp, setValidOtp] = useState(false);
    const [validateOtp, setValidateOtp] = useState('');


    const nameHandler = (val) => {
        if (isNaN(val) && val.length > 2) {
            setValidName(true);
        }
        else {
            setValidName(false);
        }
        setName(val)
    }

    // const emailHandler = (val) => {
    //     const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //     if (reg.test(val)) {
    //         setValidEmail(true);
    //     }
    //     else {
    //         setValidEmail(false);
    //     }
    //     setEmail(val);
    // }

    const phoneHandler = (val) => {
        if (!isNaN(val) && val >= 4000000000 && val <= 9999999999) {
            setValidMobile(true);
        }
        else {
            setValidMobile(false);
        }
        setMobile(val);
        setActionOtp(false)
    }

    const otpHandler = (val) => {
        if (!isNaN(val) && val >= 1000 && val <= 9999) {
            setValidOtp(true);
        }
        else {
            setValidOtp(false);
        }
        setOtp(val);
    }

    const handleGenerateOtp = async () => {
        try {
            const generatedOtp = 1000 + Math.floor(Math.random() * 9000);
            setValidateOtp(generatedOtp);
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.SEND_SMS
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                DirectSms.sendDirectSms(mobile, `Your Unique Number is ${generatedOtp} and is valid till 10 minutes.`);
                ToastAndroid.show('OTP Send Successfully', ToastAndroid.LONG, ToastAndroid.BOTTOM);
            } else {
                console.log('SMS permission denied');
                ToastAndroid.show('Please Give us the required Permission First!', ToastAndroid.LONG, ToastAndroid.BOTTOM);
            }
        } catch (err) {
            console.warn(err);
        }
        setActionOtp(true);
    }



    const submitForm = async () => {
        if (otp == validateOtp) {
            setLoading(true)
            var date = new Date().toLocaleString();

            let formData = new FormData();
            formData.append('Name', name);
            // formData.append('Email', email);
            formData.append('Mobile', mobile);
            formData.append('Created On', date);

            var response;

            await fetch(googleApi, {
                method: 'POST',
                body: formData
            }).then(res => res.json())
                .then(data => {
                    response = data.result;
                    ToastAndroid.show('Data Saved Successfully', ToastAndroid.LONG, ToastAndroid.BOTTOM);
                })
                .catch(e => {
                    response = e.result;
                })
            navigation.navigate('Success', { result: response });
            setLoading(false)

            setName('');
            setValidName(false);
            setMobile('');
            setValidMobile(false);
            setOtp('');
            setValidOtp(false);
            setActionOtp(false);
        }
        else {
            ToastAndroid.show('Invalid OTP', ToastAndroid.LONG, ToastAndroid.BOTTOM);
        }
    }

    return (
        <View style={styles.HomeScreen}>
            <ImageBackground
                source={Wave}
                resizeMode="cover"
                style={styles.container}
            >
                {loading && <View style={styles.loader}>
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color='blue' />
                    </View>
                </View>}

                <Text style={styles.heading}>Log Book</Text>
                <TextInput
                    style={[styles.input, { borderColor: validName ? 'green' : 'black' }]}
                    value={name}
                    onChangeText={(val) => nameHandler(val)}
                    placeholder="Enter Your Name"
                />
                {/* <TextInput
                    style={[styles.input, { borderColor: validEmail ? 'green' : 'black' }]}
                    value={email}
                    onChangeText={(val) => emailHandler(val)}
                    placeholder="Enter Your Email"
                /> */}
                <View style={styles.mobile}>
                    <TextInput
                        style={[styles.input, { borderColor: validMobile ? 'green' : 'black' }]}
                        value={mobile}
                        onChangeText={(val) => phoneHandler(val)}
                        placeholder="Enter Your Phone"
                    />
                    {validMobile &&
                        <AntDesign name="rightcircle" size={32} color={!actionOtp ? "green" : 'grey'} style={{ position: 'absolute', right: 0, bottom: 6 }} onPress={handleGenerateOtp} disabled={actionOtp} />
                    }
                </View>
                {actionOtp &&
                    <TextInput
                        style={[styles.input, { borderColor: validOtp ? 'green' : 'black' }]}
                        value={otp}
                        onChangeText={(val) => otpHandler(val)}
                        placeholder="Enter the OTP"
                        keyboardType='numeric'
                    />
                }

                <View style={styles.buttonContainer}>
                    <TouchableOpacity disabled={!validName || !validMobile || !validOtp} onPress={submitForm}>
                        <Text style={[styles.button, { backgroundColor: !validName || !validMobile || !validOtp ? 'grey' : 'green' }]}>
                            Submit
                        </Text>
                    </TouchableOpacity>
                </View>

            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    HomeScreen: {
        flex: 1,
    },
    container: {
        position: 'relative',
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: height / 7,
        gap: 9,
        height: height,
        width: width
    },
    heading: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 20,
        marginLeft: -4
    },
    input: {
        height: 42,
        borderBottomWidth: 1.6,
        paddingHorizontal: 12,
        fontSize: 18,
        width: '100%',
        borderRadius: 6
    },
    mobile: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    buttonContainer: {
        top: 50,
        alignItems: 'flex-end'
    },
    button: {
        backgroundColor: 'green',
        paddingHorizontal: 30,
        paddingVertical: 10,
        color: 'white',
        fontWeight: '600',
        fontSize: 18,
        borderRadius: 6
    },
    loader: {
        width: width,
        height: height,
        position: 'absolute',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    loaderContainer: {
        width: 90,
        height: 90,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
});