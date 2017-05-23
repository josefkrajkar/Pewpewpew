import React, { Component } from 'react';
import './game.css';

//function for proper positioning of the "Starship" - the small blue square
function Starship(props) {
        let stats = {
            left: props.x,
            top: props.y,
        };
        return <div draggable="false" style={stats} className="ship"/>;
}

//function for proper positioning of the Bonus container - very small rotating green square
function Bonus(props) {
    let stats = {
        left: props.x,
        top: props.y,
        visibility: props.visibility,
    };
    return <div draggable="false" style={stats} className="bonus"/>
}

//function for proper positioning of the Anti-Bonus container - very small rotating black square
function Evil(props) {
    let stats = {
        left: props.x,
        top: props.y,
        visibility: props.visibility,
    };
    return <div draggable="false" style={stats} className="evil"/>
}

//function for proper positioning of the laser beam
function Beam(props) {
    let stats = {
        left: props.x,
        top: props.y,
        visibility: props.visibility,
    };
    return <div draggable="false" style={stats} className="beam"/>
}

//function for proper positioning of the asteroid - large red square
function Asteroid(props) {
    let stats = {
        left: props.x,
        top: props.y,
    };
    return <div draggable="false" style={stats} className="asteroid"/>;
}

//main class 
class Game extends Component {
    //constructor method with 'declaration' of all important variables (and some unused test-variables) 
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

    //method for starting the timer with 10 miliseconds interval, calling the checkStatus method
    componentDidMount() {
        this.intervalId = setInterval(this.checkStatus.bind(this), 10);
    }
    
    //method for stoping the timer
    componentWillUnmount(){
        clearInterval(this.intervalId);
    }

    //method for moving the "Starship" according to the mouse coordinates inside of the play area
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

    //method for controling the starship weaponry - the mighty laser beam :)
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

    //method containing tests for all kinds of events - collisions, score events etc.
    checkStatus() {
        //Controls the cooling of the weapon
        if (this.state.cooling > 0) {
            this.setState({
                cooling: this.state.cooling - 1,
            })
        }

        //Controls the laser beam. If it is out of the play area, it will hide it. Otherwise it will animate it.
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

        //Controls the asteroid. If it is out of the play area, it will remove it onto the top. Otherwise it will animate it.
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

        //Checks the collision of the starship and the asteroid
        if (this.state.ship_x < (this.state.asteroid_x + 50) && (this.state.ship_x + 30) > this.state.asteroid_x &&
            this.state.ship_y < (this.state.asteroid_y + 50) && (this.state.ship_y + 30) > this.state.asteroid_y) {
            this.setState({
                score_text: "Game over! Your score is: ",
                game_over: true,
            });
            clearInterval(this.intervalId);
        }

        //Checks the collision of the laser beam and the asteroid
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

        //Checks the score and raises the difficulty
        this.setState({
            asteroid_speed: Math.floor((this.state.score/200)+1),
        });

        //Adds the small chance that the bonus will appear
        if (this.state.bonus_visibility==='hidden') {
            if (Math.floor(Math.random() * 500) < 1) {
                this.setState({
                    bonus_x: (Math.floor(Math.random() * 30) * 10),
                    bonus_y: 0,
                    bonus_visibility: 'visible',
                })
            }
        }

        //Controls the bonus container. If it is out of the play area, it will hide it. Otherwise it will animate it.
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

        //Checks the collision of the starship and the bonus container
        if (this.state.ship_x < (this.state.bonus_x + 10) && (this.state.ship_x + 30) > this.state.bonus_x &&
            this.state.ship_y < (this.state.bonus_y + 10) && (this.state.ship_y + 30) > this.state.bonus_y) {
            this.setState({
                score: this.state.score + 100,
                bonus_x: 310,
                bonus_y: 0,
                bonus_visibility: 'hidden',
            })
        }

        //Adds the chance that the anti-bonus will appear
        if (this.state.evil_visibility==='hidden') {
            if (Math.floor(Math.random() * 100) < 1) {
                this.setState({
                    evil_x: (Math.floor(Math.random() * 30) * 10),
                    evil_y: 0,
                    evil_visibility: 'visible',
                })
            }
        }

        //Controls the bonus container. If it is out of the play area, it will hide it. Otherwise it will animate it.
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

        //Checks the collision of the starship and the anti-bonus container
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

    //render the play area    
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

