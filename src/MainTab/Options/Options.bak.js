import React, {Component} from 'react';
import {
  Container,
  Card,
  CardItem,
  StyleProvider,
  Header,
  Title,
  Content,
  Button,
  Right,
  Body,
  Text,
} from 'native-base';
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ajax from '../../ajax';

export default class Strategies extends Component {
  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <Header>
            <Body
              // eslint-disable-next-line react-native/no-inline-styles
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Title>Options</Title>
            </Body>
          </Header>
          <Content>
            <Card>
              <CardItem>
                <Text>Google Account</Text>
                <Right>
                  <Button hasText onPress={ajax.signOut}>
                    <Text>Switch User</Text>
                  </Button>
                </Right>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Text>The Red Alliance App — v{DeviceInfo.getVersion()}</Text>
              </CardItem>
              <CardItem>
                <Text>
                  Made with <Icon name="cards-heart" /> by Titan Scouting
                </Text>
              </CardItem>
            </Card>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}
