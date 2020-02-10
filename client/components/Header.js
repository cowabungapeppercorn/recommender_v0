import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Header = ({title}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

Header.defaultProps = {
  title: 'Shopping List',
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    padding: 15,
    backgroundColor: '#193be3',
  },
  text: {
    color: '#1ce6b1',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default Header;
