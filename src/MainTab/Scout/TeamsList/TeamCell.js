import { ListItem } from 'native-base';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Globals from '../../../GlobalDefinitions';

export default class TeamCell extends React.Component {

    static propTypes = {
        number: PropTypes.number.isRequired,
        isBlue: PropTypes.bool.isRequired,
        scouterDescription: PropTypes.string,
        onPress: PropTypes.func.isRequired,
        showRefresh: PropTypes.func.isRequired,
    };

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handlePress = async () => {
        this.props.showRefresh(true);
        await this.props.onPress(this.props.number, this.props.isBlue);
        if (this._isMounted) {
            this.props.showRefresh(false);
        }
        
    };

    render () {
        return (
            
            <TouchableWithoutFeedback onPress={this.handlePress}>
                <ListItem style={styles.cell}>
                    <View backgroundColor={this.props.isBlue ? Globals.colors.blue : Globals.colors.red} style={styles.ribbon}/>
                    <View width={10}/>
                    <View style={styles.scouter}>
                        <View>
                            <Text style={styles.team}>{"Team "+this.props.number}</Text>
                        </View>
                        <Text style={styles.scouter}>{this.props.scouterDescription ? "Covered by "+this.props.scouterDescription : "Open"}</Text>
                    </View>
               </ListItem>
            </TouchableWithoutFeedback>

        );
    }
}

const styles = StyleSheet.create({
    ribbon: {
        width: 15,
        height: 40,
    },
    team: {
      color: 'black',
      fontSize: 18,
      flex: 1,
    },
    type: {
      color: 'black',
      fontSize: 16,
      flex: 1,
    },
    scouter: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    cell: {
        flexDirection: 'row'
    }
});
