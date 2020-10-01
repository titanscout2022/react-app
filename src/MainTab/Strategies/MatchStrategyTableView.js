import React, { Component } from 'react';
import { Container, Textarea, StyleProvider, Header, Title, View, Button, Left, Right, Body, Text, Icon} from 'native-base';
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material';
import { RefreshControl, FlatList, StyleSheet, ScrollView, BackHandler} from 'react-native'


import ajax from '../../ajax'
import Globals from '../../GlobalDefinitions'
import PropTypes from 'prop-types';
import SubmittedStrategyCell from './SubmittedStrategyCell';
import MatchStrategyHeader from './MatchStrategyHeader';

export default class MatchStrategyTableView extends Component {


  static propTypes = {
    match: PropTypes.number.isRequired,
    teams: PropTypes.array.isRequired,
    onBack: PropTypes.func.isRequired,
    nicknames: PropTypes.object,
  };
  
  state = {
    strats: null,
    refreshing: true,
    ideas: null,
    submittedStrat: null,
  }

  componentDidMount() {
    this.getSubmittedStrategy();
    this.refreshStrats();
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

  }

  getSubmittedStrategy = async () => {
    let submittedStrat = await ajax.getUserStrategy(Globals.data.competition, this.props.match);
    this.setState({submittedStrat: submittedStrat[0]})
  }

  refreshStrats = async () => {
    let strats = await ajax.getStrategiesForMatch(Globals.data.competition, this.props.match);
    this.setState({strats: strats, refreshing:false});
  }


  onSave = async () => {
    await ajax.submitStrategy(Globals.data.competition, this.props.match, this.state.ideas);
    this.props.onBack()
  }
  componentWillUnmount() {
    this.backHandler.remove()
  }

  handleBackPress = () => {
    this.props.onBack()
    return true;
  }
  theList = () => {
    return (<FlatList
      data = {this.state.strats}
      renderItem={({item}) => 
          <SubmittedStrategyCell scouter={item.scouter} strategy={item.data}/>
      }
      keyExtractor= {(item, index) => String(index)}
      refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshStrats} />
      }
      showsVerticalScrollIndicator={false}
  />);
  }
  renderStrategyList = () => {
    if (this.state.strats == null) {
      return this.theList();
    } else if (this.state.strats.length === 0){

      return (
        <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshStrats} />}>
          <View style={styles.noStrats}>
            <Text>No submitted strategies</Text>
          </View>
        </ScrollView>
      );
    }
    return this.theList();
  }

  handleText = (text) => {
    this.state.ideas = text;
  }

  render() {
      return (
      <StyleProvider style={getTheme(material)}>
        <Container>
         <Header>
            <Left style={{ paddingLeft: 10, justifyContent: 'center', alignItems: 'flex-start' }}>
                <Button transparent onPress={this.props.onBack}>
                      <Icon name='arrow-back' />
                </Button>
            </Left>
            <Body >
                <Title>{"Match "+this.props.match}</Title>
            </Body>
            <Right>
                <Button transparent onPress={this.onSave}>
                        <Icon name='save' />
                </Button>
            </Right>
          </Header>
          <MatchStrategyHeader teams={this.props.teams} nicknames={this.props.nicknames}/>
          <Textarea defaultValue={this.state.submittedStrat} style={styles.textarea} rowSpan={3} bordered placeholder={"Detail your own match strategy here. How should we work with the teams on our alliance and work against the teams on the opposing alliance?"} onChangeText={this.handleText} />
            {this.renderStrategyList()}
        </Container>
      </StyleProvider>
    );
    
    
  } 
}

const styles = StyleSheet.create({
  noStrats: {
    paddingTop: 10,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
  },
  stepper: {
    flex: 1,
  },
  tabStyle: {
    borderColor: Globals.colors[Globals.brand.primary],
  },
  activeTabStyle: {
    backgroundColor: Globals.colors[Globals.brand.primary],
  },
  tabTextStyle: {
    color: Globals.colors[Globals.brand.primary],
  },
  textarea: {
    height: 120,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
  }
});