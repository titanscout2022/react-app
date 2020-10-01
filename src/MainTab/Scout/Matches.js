import { StyleProvider } from 'native-base';
import React from 'react';
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material';
import ajax from '../../ajax';
import GLOBAL from '../../GlobalDefinitions';
import Eval from './Evaluation/Eval';
import MatchList from './MatchList/MatchList';
import TeamList from './TeamsList/TeamList';


export default class Matches extends React.Component {
  _isMounted = false;
  state = {
    matches: [],
    currentMatchNumber: null,

    teams: null,
    currentTeamNumber: null,
    isBlue: null,

    configuration: {},
  };

  componentDidMount() {
    this._isMounted = true;
    this.refreshMatches();
    this.pullConfiguration();
  }

  refreshMatches = async () => {
    const matches = await ajax.fetchMatches(GLOBAL.data.competition);
    this.state.matches = matches;
    this.forceUpdate();
  };

  currentMatch = () => {
    return this.matches.find(match => match.key === this.currentMatchNumber);
  };

  async componentWillUnmount() {
    this._isMounted = false;
  }

  setCurrentMatch = number => {
    this.state.currentMatchNumber = number;
    this.state.teams = [];
    this.forceUpdate();
    this.refreshTeams();
  };

  unsetCurrentMatch = () => {
    this.state.currentMatchNumber = null;
    this.state.teams = null;
    this.forceUpdate();
  };

  getTeams = async () => {
    const teams = await ajax.fetchTeamsForMatch(
      GLOBAL.data.competition,
      this.state.currentMatchNumber,
    );
    return teams;
  };
  refreshTeams = async () => {
    let teams = await this.getTeams();
    this.state.teams = teams;
    this.forceUpdate();
  };

  setCurrentTeam = async (teamNumber, isBlue) => {
    let teams = await this.getTeams();
    for (var team in teams) {
      let number = teams[team].teamNumber;
      if (number === teamNumber && teams[team].scouterDescription != null) {
        this.refreshTeams();
        return;
      }
    }
    ajax.addScouterToMatch(teamNumber, this.state.currentMatchNumber, GLOBAL.data.competition);
    this.state.currentTeamNumber = teamNumber;
    this.state.isBlue = isBlue;
    this.forceUpdate();
    this.pullConfiguration();
  };
  unsetCurrentTeam = () => {
    this.state.currentTeamNumber = null;
    this.forceUpdate();
  };

  pullConfiguration = async () => {
    if (
      !this.state.configuration ||
      Object.keys(this.state.configuration).length === 0
    ) {
      const config = await ajax.fetchMatchConfig();
      this.setState({configuration: config});
    }
  };

  popEval = () => {
    this.state.currentTeamNumber = null;
    this.forceUpdate();
  };

  saveScouting = vals => {
    ajax.submitMatchData(
      GLOBAL.data.competition,
      this.state.currentTeamNumber,
      this.state.currentMatchNumber,
      vals,
    );
    this.setState({
      currentMatchNumber: null,
      teams: null,
      currentTeamNumber: null,
      isBlue: null,
    });
    this.forceUpdate();
  };

  render() {
    if (this.state.currentTeamNumber != null) {
      return (
        <StyleProvider style={getTheme(material)}>
          <Eval
            configuration={this.state.configuration}
            onBack={this.popEval}
            onSave={this.saveScouting}
            matchNumber={this.state.currentMatchNumber}
            teamNumber={this.state.currentTeamNumber}
            isBlue={this.state.isBlue}
          />
        </StyleProvider>
      );
    } else if (
      this.state.currentMatchNumber != null &&
      this.state.teams != null
    ) {
      return (
        <StyleProvider style={getTheme(material)}>
          <TeamList
            teams={this.state.teams}
            refreshTeams={this.refreshTeams}
            matchNumber={this.state.currentMatchNumber}
            onBack={this.unsetCurrentMatch}
            onItemPress={this.setCurrentTeam}
          />
        </StyleProvider>
      );
    } else {
      return (
        <StyleProvider style={getTheme(material)}>
          <MatchList
            matches={this.state.matches}
            onItemPress={this.setCurrentMatch}
            refreshMatches={this.refreshMatches}
          />
        </StyleProvider>
      );
    }
  }
}
