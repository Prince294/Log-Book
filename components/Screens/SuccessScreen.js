import { View, Text, StyleSheet, ImageBackground, Dimensions, ScrollView } from 'react-native'
import React from 'react'
import Wave from '../../assets/wave.jpg';

const { width, height } = Dimensions.get('screen');
export default function SuccessScreen({ route, navigation }) {
    return (
        <View style={styles.success}>
            <ImageBackground
                source={Wave}
                resizeMode="cover"
                style={styles.container}
            >
                {route.params.result == 'success' ?
                    <Text style={styles.text}>Data Saved Successfully</Text> :
                    <Text style={[styles.text, { color: 'red' }]}>Something Went Wrong</Text>
                }
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    success: {
        flex: 1
    },
    container: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        height: height,
        width: width
    },
    text: {
        fontSize: 30,
        fontWeight: '600',
        marginTop: -2 * height / 5
    }
});