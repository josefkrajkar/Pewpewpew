import React, { Component } from 'react';
import './game.css';

function Starship(props) {
        let stats = {
            left: props.x,
            top: props.y,
        };
        return <div draggable="false" style={stats} className="ship"/>;
}

function Bonus(props) {
    let stats = {
        left: props.x,
        top: props.y,
        visibility: props.visibility,
    };
    return <div draggable="false" style={stats} className="bonus"/>
}

function Evil(props) {
    let stats = {
        left: props.x,
        top: props.y,
        visibility: props.visibility,
    };
    return <div draggable="false" style={stats} className="evil"/>
}

function Beam(props) {
    let stats = {
        left: props.x,
        top: props.y,
        visibility: props.visibility,
    };
    return <div draggable="false" style={stats} className="beam"/>
}

function Asteroid(props) {
    let stats = {
        left: props.x,
        top: props.y,
    };
    return <div draggable="false" style={stats} className="asteroid"/>;
}

class Game extends Component {
    constructor() {
        super();
        this.state = {
            parent_width: 300,
            parent_height: 480,
            score_text: "Score: ",
            score: 0,
            ship_x: 135,
            ship_y: 440,
            fired: false,
            cooling: 0,
            beam_x: 310,
            beam_y: 0,
            beam_visibility: 'hidden',
            asteroid_x: 125,
            asteroid_y: 0,
            asteroid_speed: 1,
            bonus_x: 310,
            bonus_y: 0,
            bonus_visibility: 'hidden',
            game_over: false,
            evil_speed: 0,
            evil_size: 0,
            evil_x: 310,
            evil_y: 0,
            evil_visibility: 'hidden',
        };
    }

    componentDidMount() {
        this.intervalId = setInterval(this.checkStatus.bind(this), 10);
    }

    componentWillUnmount(){
        clearInterval(this.intervalId);
    }

    handleMove(e) {
        if (!this.state.game_over) {
            let x_coord=e.clientX, //- parseInt(document.defaultView.getComputedStyle(e.target).left,10),
                y_coord=e.clientY; //- parseInt(document.defaultView.getComputedStyle(e.target).top,10);
            if (x_coord <= 270) {
                this.setState({
                    ship_x: x_coord,
                });
            }
            if (y_coord <= 450) {
                this.setState({
                    ship_y: y_coord,
                });
            }
        }
    }

    fire(e) {
        if (this.state.cooling === 0) {
            let x=e.clientX,// - parseInt(document.defaultView.getComputedStyle(e.target).left,10),
                y=e.clientY;// - parseInt(document.defaultView.getComputedStyle(e.target).top,10);
            if (x <= 270 && y <= 450) {
                this.setState({
                    beam_visibility: 'visible',
                    beam_x: e.clientX + 15,
                    beam_y: e.clientY,
                    cooling: 50,
                });
            }
        }
    }

    checkStatus() {
        //Zajisti chlazeni zbrane
        if (this.state.cooling > 0) {
            this.setState({
                cooling: this.state.cooling - 1,
            })
        }

        //Zajisti aby nebyl paprsek videt mimo herni plochu, jinak paprsek animuje
        if (this.state.beam_y <= 0) {
            this.setState ({
                beam_x: 310,
                beam_y: 0,
                beam_visibility: 'hidden',
            });
        }
        else {
            this.setState ({
                beam_y: this.state.beam_y - 10,
            })
        }

        //Zajisti pohyb asteroidu
        if (this.state.asteroid_y >= (430)) {
            this.setState ({
                asteroid_x: Math.floor(Math.random()*6)*50,
                asteroid_y: 0,
                score: this.state.score + 10,
            })
        }
        else {
            this.setState ({
                asteroid_y: this.state.asteroid_y + this.state.asteroid_speed,
            })
        }

        //Zkontroluje kolizi s lodi
        if (this.state.ship_x < (this.state.asteroid_x + 50) && (this.state.ship_x + 30) > this.state.asteroid_x &&
            this.state.ship_y < (this.state.asteroid_y + 50) && (this.state.ship_y + 30) > this.state.asteroid_y) {
            this.setState({
                score_text: "Game over! Your score is: ",
                game_over: true,
            });
            clearInterval(this.intervalId);
        }

        //Zkontroluje kolizi se strelou a v pripade zasahu pripocte body
        if (this.state.beam_x < (this.state.asteroid_x + 50) && (this.state.beam_x + 5) > this.state.asteroid_x &&
            this.state.beam_y < (this.state.asteroid_y + 50) && (this.state.beam_y + 20) > this.state.asteroid_y) {
            this.setState({
                score: this.state.score + 30,
                beam_x: 310,
                beam_y: 0,
                beam_visibility: 'hidden',
                asteroid_x: (Math.floor(Math.random()*6))*50,
                asteroid_y: 0,
            })
        }

        //Zkontroluje skore a v pripade delitelnosti 200 zvysuje obtiznost
        this.setState({
            asteroid_speed: Math.floor((this.state.score/200)+1),
        });

        //Prida malou sanci na objeveni bonusu
        if (this.state.bonus_visibility==='hidden') {
            if (Math.floor(Math.random() * 500) < 1) {
                this.setState({
                    bonus_x: (Math.floor(Math.random() * 30) * 10),
                    bonus_y: 0,
                    bonus_visibility: 'visible',
                })
            }
        }

        //Zajisti pohyb bonusu
        if (this.state.bonus_visibility==='visible') {
            if (this.state.bonus_y >= (450)) {
                this.setState ({
                    bonus_x: 310,
                    bonus_y: 0,
                    bonus_visibility: 'hidden',
                })
            }
            else {
                this.setState ({
                    bonus_y: this.state.bonus_y + 1,
                })
            }
        }

        //Zkontroluje kolizi lodi s bonusem
        if (this.state.ship_x < (this.state.bonus_x + 10) && (this.state.ship_x + 30) > this.state.bonus_x &&
            this.state.ship_y < (this.state.bonus_y + 10) && (this.state.ship_y + 30) > this.state.bonus_y) {
            this.setState({
                score: this.state.score + 100,
                bonus_x: 310,
                bonus_y: 0,
                bonus_visibility: 'hidden',
            })
        }

        //Prida sanci na objeveni anti-bonusu
        if (this.state.evil_visibility==='hidden') {
            if (Math.floor(Math.random() * 100) < 1) {
                this.setState({
                    evil_x: (Math.floor(Math.random() * 30) * 10),
                    evil_y: 0,
                    evil_visibility: 'visible',
                })
            }
        }

        //Zajisti pohyb anti-bonusu
        if (this.state.evil_visibility==='visible') {
            if (this.state.evil_y >= (450)) {
                this.setState ({
                    evil_x: 310,
                    evil_y: 0,
                    evil_visibility: 'hidden',
                })
            }
            else {
                this.setState ({
                    evil_y: this.state.evil_y + 2,
                })
            }
        }

        //Zkontroluje kolizi lodi s anti-bonusem
        if (this.state.ship_x < (this.state.evil_x + 10) && (this.state.ship_x + 30) > this.state.evil_x &&
            this.state.ship_y < (this.state.evil_y + 10) && (this.state.ship_y + 30) > this.state.evil_y) {
            this.setState({
                score: this.state.score < 100 ? 0 : this.state.score - 100,
                evil_x: 310,
                evil_y: 0,
                evil_visibility: 'hidden',
            })
        }

    }

    render() {
        return  <div unselectable="on" draggable="false" className="arena" onClick={(e) => this.fire(e)} onMouseMove={(e) => this.handleMove(e)}>
                    <p unselectable='true'>{this.state.score_text+this.state.score}</p>
                    <Asteroid x={this.state.asteroid_x} y={this.state.asteroid_y}/>
                    <Bonus x={this.state.bonus_x} y={this.state.bonus_y} visibility={this.state.bonus_visibility}/>
                    <Evil x={this.state.evil_x} y={this.state.evil_y} visibility={this.state.evil_visibility}/>
                    <Beam x={this.state.beam_x} y={this.state.beam_y} visibility={this.state.beam_visibility}/>
                    <Starship x={this.state.ship_x} y={this.state.ship_y}/>
                </div>;
    }
}

export default Game;

