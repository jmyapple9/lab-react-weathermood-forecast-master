import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import {
    withCookies, Cookies
} from 'react-cookie';
import { instanceOf } from 'prop-types';

import Today from 'components/Today.jsx';
import Forecast from 'components/Forecast.jsx';

import './Main.css';

class Main extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {
            unit: 'metric',
            city: 'na',
            navbarToggle: false,
            favoriteCities: cookies.get('cities')?cookies.get('cities').split(';'):[]
        };

        this.handleNavbarToggle = this.handleNavbarToggle.bind(this);
        this.handleUnitChange = this.handleUnitChange.bind(this);
        this.handleFavoriteCities = this.setFavoriteCities.bind(this);
        this.clearFavoriteCities = this.clearFavoriteCities.bind(this);
        this.handleFormQuery = this.handleFormQuery.bind(this);

    }

    render() {
        return (
            <Router>
                <div className={`main bg-faded ${this.state.group}`}>
                    <div className='container'>
                        <Navbar color="faded" light expand="md">
                            <NavbarBrand className='text-info' href="/">WeatherMood</NavbarBrand>
                            <NavbarToggler onClick={this.handleNavbarToggle}/>
                            <Collapse isOpen={this.state.navbarToggle} navbar>
                                <Nav navbar>
                                    <NavItem>
                                        <NavLink tag={Link} to='/'>Today</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink tag={Link} to='/forecast'>Forecast</NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown>
                                        <DropdownToggle nav caret>
                                            Favorite City
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            {
                                                this.state.favoriteCities.map((item)=><DropdownItem key={item} onClick = {()=>this.handleFormQuery(item, this.state.unit)}>{item}</DropdownItem>)
                                            }
                                            <DropdownItem divider />
                                            <DropdownItem onClick={this.clearFavoriteCities}>
                                                clear
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Nav>
                                <span className='navbar-text ml-auto'>DataLab</span>
                            </Collapse>
                        </Navbar>
                    </div>

                    <Route exact path="/" render={() => (
                        <Today unit={this.state.unit} onUnitChange={this.handleUnitChange} onQuery={this.handleFormQuery}/>
                    )}/>
                    <Route exact path="/forecast" render={() => (
                        <Forecast unit={this.state.unit} onUnitChange={this.handleUnitChange} />
                    )}/>
                </div>
            </Router>
        );
    }

    handleNavbarToggle() {
        this.setState((prevState, props) => ({
            navbarToggle: !prevState.navbarToggle
        }));
    }

    handleUnitChange(unit) {
        this.setState({
            unit: unit
        },()=>{}); //Unused call back function after update state
    }
    setFavoriteCities(city){
        const cookies = this.props;
        let FavoriteCity = this.state.favoriteCities;
        if(!(FavoriteCity.indexOf(city)>=0))
            FavoriteCity.push(city)

        this.setState({favoriteCities: FavoriteCity});
        cookies.set("cities", FavoriteCity.join(';'));
        // console.log('set cookie: ',cookies);
    }
    clearFavoriteCities(){
        const cookies = this.props;
        this.setState({
            favoriteCities: [],
        },()=>{});
        cookies.set('cities',"");
    }
    handleFormQuery(city, unit){
        this.setState({
            city: city,
            unit: unit,
        });
        this.setFavoriteCities(city);
    }
}

export default withCookies(Main);