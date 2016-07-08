import React from 'react';

import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import DevicesIcon from 'material-ui/svg-icons/hardware/developer-board';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import IconButton from 'material-ui/IconButton';
import ActionClear from 'material-ui/svg-icons/content/clear';
import SignalIcon from 'material-ui/svg-icons/device/network-wifi';
import InfoIcon from 'material-ui/svg-icons/action/info';
import Divider from 'material-ui/Divider';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import {blue500, red500, green500} from 'material-ui/styles/colors';

import CommonAppService from '../services/CommonAppService';
import AppConstants from '../utils/AppConstants';
import NavLink from './NavLink';
import BrokerSettingsService from '../services/BrokerSettingsService';
import BrokerConnectionService from '../services/BrokerConnectionService';

class AppDrawer extends React.Component {

    constructor(props) {
        super(props);

        this.onShowHideAppDrawer = this.onShowHideAppDrawer.bind(this);
        this.navigateToAddEditBrokerPage = this.navigateToAddEditBrokerPage.bind(this);
        this.navigateToBrokerPage = this.navigateToBrokerPage.bind(this);
        this.onBrokerSettingsChanged = this.onBrokerSettingsChanged.bind(this);

        var bsList = BrokerSettingsService.getAllBrokerSettingData();
        this.state = {open:true,bsList:bsList}
    }

    onShowHideAppDrawer(open) {
        this.setState({open:open});
    }

    navigateToAddEditBrokerPage() {
        this.onShowHideAppDrawer(false);
        window.location.hash = AppConstants.PAGE_URL_ADD_EDIT_CLIENT_BROKER_SETTINGS;
    }

    navigateToBrokerPage(bsId) {
        this.onShowHideAppDrawer(false);
        window.location.hash = AppConstants.PAGE_URL_CLIENT_CONNECTION_DETAILS+bsId;
    }

    onBrokerSettingsChanged(bsId) {
        var bsList = BrokerSettingsService.getAllBrokerSettingData();
        this.setState({bsList:bsList});
    }

    componentDidMount() {
        CommonAppService.addChangeListener(AppConstants.EVENT_OPEN_CLOSE_APP_DRAWER,this.onShowHideAppDrawer);
        BrokerSettingsService.addChangeListener(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,this.onBrokerSettingsChanged);
        BrokerConnectionService.addChangeListener(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,this.onBrokerSettingsChanged);
        if(this.state.bsList==null || this.state.bsList.length<=0) {
           this.navigateToAddEditBrokerPage();
        }
    }

    componentWillUnmount() {
        CommonAppService.removeChangeListener(AppConstants.EVENT_OPEN_CLOSE_APP_DRAWER,this.onShowHideAppDrawer);
        BrokerSettingsService.removeChangeListener(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,this.onBrokerSettingsChanged);
        BrokerConnectionService.removeChangeListener(AppConstants.EVENT_BROKER_SETTINGS_CHANGED,this.onBrokerSettingsChanged);
    }

    render() {
        var brokerList = this.state.bsList.map(function(brokerSetting,index) {
            var connState = red500;
            if(BrokerConnectionService.getBrokerState(brokerSetting.bsId) == AppConstants.ONLINE) {
                connState = green500;
            }

            return (<ListItem leftIcon={<SignalIcon color={connState}/>} onClick={this.onShowHideAppDrawer.bind(this,false)} key={brokerSetting.bsId} primaryText={brokerSetting.brokerName} containerElement={<NavLink key={brokerSetting.bsId} to={"/broker/"+brokerSetting.bsId}/>}></ListItem>);
        }.bind(this));

        brokerList.push(<ListItem primaryText="Add New Client" onClick={this.onShowHideAppDrawer.bind(this,false)} key="addEditNewBroker" leftIcon={<AddIcon/>}
            containerElement={<NavLink key="addEditNewBroker" to="/addedit"/>}></ListItem>);

        return (
            <Drawer
              docked={true}
              open={this.state.open}
              onRequestChange={this.onShowHideAppDrawer}
            >
                <Toolbar>
                    <ToolbarGroup float='left'/>
                    <ToolbarGroup float='right'>
                        <IconButton onTouchTap={this.onShowHideAppDrawer.bind(this,false)}>
                            <ActionClear/>
                        </IconButton>
                    </ToolbarGroup>
                </Toolbar>
                <Divider/>
                <List>
                    <ListItem
                      primaryText="MQTT Clients"
                      leftIcon={<DevicesIcon/>}
                      initiallyOpen={true}
                      primaryTogglesNestedList={true}
                      nestedItems={brokerList}
                    />
                    <ListItem
                      primaryText="About"
                      leftIcon={<InfoIcon/>}
                      initiallyOpen={true}
                      primaryTogglesNestedList={true}
                      onClick={this.onShowHideAppDrawer.bind(this,false)}
                      containerElement={<NavLink key="aboutapp" to="/aboutapp"/>}
                    />
                </List>
            </Drawer>
        );
    }
}

export default AppDrawer;
