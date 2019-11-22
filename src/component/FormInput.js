import React from 'react'
import { Input } from 'react-native-elements'
import { StyleSheet, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { isTSExpressionWithTypeArguments } from '@babel/types'
const FormInput = ({
  iconName,
  iconColor,
  returnKeyType,
  keyboardType,
  name,
  placeholder,
  value,
  ...rest
}) => (
  <View style={styles.inputContainer}>
    <Input
      {...rest}
      leftIcon={<Ionicons name={iconName} size={24} color={"white"} />}
      leftIconContainerStyle={styles.iconStyle}
      placeholderTextColor="white"
      name={name}
      value={value}
      placeholder={placeholder}
      style={styles.input}
      
    />
  </View>
)
const styles = StyleSheet.create({
  inputContainer: {
    width: 350,
    height: 30,
    borderRadius: 25,
    paddingHorizontal: 18,
    fontSize: 15,
    margin: 10,
    color:'white'
  },
  iconStyle: {
    marginRight: 10
  },
  input:
  {
    color:'white'
  }
})
export default FormInput