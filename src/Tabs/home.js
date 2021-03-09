import React, { Component } from "react";
import ReactDOM from 'react-dom';
import '../App.css';
import {oneRule, deduction, closerLook, reducePossibilities, isfinished} from './utility';

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            map :   [[1,1,1,    1,1,1,   1,1,1],
                     [1,1,1,    1,1,1,   1,1,1],
                     [1,1,1,    1,1,1,   1,1,1],//top 3 blocks ([0][0-8] thru [2][0-8])
                     
                     [1,1,1,    1,1,1,   1,1,1],
                     [1,1,1,    1,1,1,   1,1,1],
                     [1,1,1,    1,1,1,   1,1,1],//middle 3 blocks ([3][0-8] thru [5][0-8])

                     [1,1,1,    1,1,1,   1,1,1],
                     [1,1,1,    1,1,1,   1,1,1],
                     [1,1,1,    1,1,1,   1,1,1]],//bottom 3 blocks ([6][0-8] thru [8][0-8])

            cycleCount: 0
        };
    } //end constructor

    resetTest = () => {

        let test = [[3,5,9,    8,0,0,   0,0,0],
                    [0,0,0,    0,4,0,   0,0,0],
                    [0,0,0,    0,0,0,   0,7,9],
        
                    [0,6,0,    4,0,0,   0,0,0],
                    [0,0,0,    0,0,0,   0,0,8],
                    [0,3,0,    2,6,0,   0,0,0],

                    [0,0,8,    3,0,9,   2,0,7],
                    [0,0,0,    0,0,8,   5,0,0],
                    [0,0,1,    0,0,0,   6,0,0]];/*

        let test = [[0,9,0,    4,7,0,   0,0,0],
                    [0,0,3,    0,5,0,   0,0,7],
                    [0,5,1,    0,0,6,   0,0,0],
        
                    [0,0,0,    9,8,3,   0,0,0],
                    [0,0,0,    0,0,0,   0,2,6],
                    [3,0,0,    0,0,0,   0,7,0],

                    [0,0,6,    0,0,0,   0,0,0],
                    [0,4,0,    0,0,5,   9,0,0],
                    [0,0,0,    3,0,1,   5,0,0]];
        
        let test = [[1,0,0,    0,0,7,   0,9,0],
                    [0,3,0,    0,2,0,   0,0,8],
                    [0,0,9,    6,0,0,   5,0,0],
        
                    [0,0,5,    3,0,0,   9,0,0],
                    [0,1,0,    0,8,0,   0,0,2],
                    [6,0,0,    0,0,4,   0,0,0],

                    [3,0,0,    0,0,0,   0,1,0],
                    [0,4,0,    0,0,0,   0,0,7],
                    [0,0,7,    0,0,0,   3,0,0]];*/

        this.setState({cycleCount : 0});
        this.setState({map: test});
    } //end of resetTest

    handleInput = (event, index1, index2) =>{
       
        if(isNaN(event.target.value)){
            alert("Sudoku only uses numbers");
        }
        else{

            let newMap = this.state.map.slice();
            newMap[index1][index2] = Number(event.target.value);
            this.setState({ map: newMap});
            
            this.printMap();  
        }      
    }// end of handleInput


    printMap = () => {  //prints the current state and the possible answers if any cells are unfilled
        console.log(this.state.map);
        let allposibilities = closerLook(this.state.map);
        console.log(allposibilities);
    }//end of printMap

    clearPuzzle = () => {
        let clear = [[0,0,0,    0,0,0,   0,0,0],
                    [0,0,0,    0,0,0,   0,0,0],
                    [0,0,0,    0,0,0,   0,0,0],
        
                    [0,0,0,    0,0,0,   0,0,0],
                    [0,0,0,    0,0,0,   0,0,0],
                    [0,0,0,    0,0,0,   0,0,0],

                    [0,0,0,    0,0,0,   0,0,0],
                    [0,0,0,    0,0,0,   0,0,0],
                    [0,0,0,    0,0,0,   0,0,0]];
        
        this.setState({ map: clear});
    }
 

    solve = () => {       
        let newMap = this.state.map.slice();
        let change = !isfinished(newMap);
        let waschanged = false;  //variable change will allow at least 10 cycles to execute and beyond if cells continue to be changed
        //double for-loop iterates through matrix checking for empty spaces

            for(let i = 0; i < 9; i++){
                for(let j = 0; j < 9; j++){
                    if(newMap[i][j] === 0){      //if cell is empty, put correct answer in
                        
                        let possible = oneRule(newMap, i, j); //set possible to the total possible number that could fit in this cell
                        if (possible.length === 1){ // if there is only one possibiliyt set it
                            waschanged = true;
                            newMap[i][j] = possible[0];
                            console.log("One Rule Found at " + i + " " + j + " to be " + possible[0]);
                        }
                        else if (possible.length === 0){ //any empty cell should always have some list of possible numbers
                            alert("Unsolvable");
                            return;
                        }
                        else if (possible.length > 1){
                            let temp = deduction(newMap, i, j, possible);
                            if(temp !== 0){
                                waschanged = true;                               
                                console.log("Deduction Found at " + i + " " + j + " to be " + temp);
                                newMap[i][j] = temp;
                            }                    
                            
                        }
                        else{
                            if(this.state.cycleCount < 11){
                                waschanged = true;
                            }
                            continue;
                        }
                            
                    }
                }
            }
        

        this.setState({map : newMap});
        change = !isfinished(newMap);
        if(waschanged === true && change === true ){
            this.setState({cycleCount: 0});
            //this.state.cycleCount = 0;
            this.solve();
        }
        else if (change === true && this.state.cycleCount < 3 && waschanged === false){
            this.state.cycleCount += 1;
            console.log("cycleCount increased = " + this.state.cycleCount);
            this.solve();
        }
        else if (change === true && waschanged === false && this.state.cycleCount < 10){
            this.state.cycleCount += 1;
            console.log("Initiating closer look");
            let allpossibilities = closerLook(newMap);
            //console.log(allpossibilities);
            allpossibilities = reducePossibilities(allpossibilities, newMap);
            console.log(allpossibilities);
            this.solve();
            //this.setState({map: newMap});
            //return;
        }
        else if (change === false){
            console.log("Solved ");
            return;
        }
    }

    
    //<input onChange = {this.handleInput} placeholder="Enter Number"></input>
    //<button onClick={this.logValue}>Log value</button>
    render() {
        return(
            <div>
                <div id="title">
                    <div className = "head">
                        Sudoku Solver
                    </div>
                    
                </div>


            <table>
                <tbody>
                <tr>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 0)} maxLength = "1" placeholder = {this.state.map[0][0]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 1)} maxLength = "1" placeholder = {this.state.map[0][1]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 2)} maxLength = "1" placeholder = {this.state.map[0][2]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 3)} maxLength = "1" placeholder = {this.state.map[0][3]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 4)} maxLength = "1" placeholder = {this.state.map[0][4]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 5)} maxLength = "1" placeholder = {this.state.map[0][5]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 6)} maxLength = "1" placeholder = {this.state.map[0][6]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 7)} maxLength = "1" placeholder = {this.state.map[0][7]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 8)} maxLength = "1" placeholder = {this.state.map[0][8]} id="myInput"/> </td>
                </tr>
                  
                <tr>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 0)} maxLength = "1" placeholder = {this.state.map[1][0]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 1)} maxLength = "1" placeholder = {this.state.map[1][1]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 2)} maxLength = "1" placeholder = {this.state.map[1][2]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 3)} maxLength = "1" placeholder = {this.state.map[1][3]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 4)} maxLength = "1" placeholder = {this.state.map[1][4]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 5)} maxLength = "1" placeholder = {this.state.map[1][5]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 6)} maxLength = "1" placeholder = {this.state.map[1][6]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 7)} maxLength = "1" placeholder = {this.state.map[1][7]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 8)} maxLength = "1" placeholder = {this.state.map[1][8]} id="myInput"/> </td>
                </tr>
                <tr>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 0)} maxLength = "1" placeholder = {this.state.map[2][0]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 1)} maxLength = "1" placeholder = {this.state.map[2][1]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 2)} maxLength = "1" placeholder = {this.state.map[2][2]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 3)} maxLength = "1" placeholder = {this.state.map[2][3]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 4)} maxLength = "1" placeholder = {this.state.map[2][4]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 5)} maxLength = "1" placeholder = {this.state.map[2][5]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 6)} maxLength = "1" placeholder = {this.state.map[2][6]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 7)} maxLength = "1" placeholder = {this.state.map[2][7]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 8)} maxLength = "1" placeholder = {this.state.map[2][8]} id="myInput"/> </td>
                </tr>
                  
                <tr>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 0)} maxLength = "1" placeholder = {this.state.map[3][0]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 1)} maxLength = "1" placeholder = {this.state.map[3][1]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 2)} maxLength = "1" placeholder = {this.state.map[3][2]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 3)} maxLength = "1" placeholder = {this.state.map[3][3]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 4)} maxLength = "1" placeholder = {this.state.map[3][4]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 5)} maxLength = "1" placeholder = {this.state.map[3][5]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 6)} maxLength = "1" placeholder = {this.state.map[3][6]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 7)} maxLength = "1" placeholder = {this.state.map[3][7]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 8)} maxLength = "1" placeholder = {this.state.map[3][8]} id="myInput"/> </td>
                </tr>
                <tr>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 0)} maxLength = "1" placeholder = {this.state.map[4][0]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 1)} maxLength = "1" placeholder = {this.state.map[4][1]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 2)} maxLength = "1" placeholder = {this.state.map[4][2]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 3)} maxLength = "1" placeholder = {this.state.map[4][3]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 4)} maxLength = "1" placeholder = {this.state.map[4][4]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 5)} maxLength = "1" placeholder = {this.state.map[4][5]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 6)} maxLength = "1" placeholder = {this.state.map[4][6]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 7)} maxLength = "1" placeholder = {this.state.map[4][7]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 8)} maxLength = "1" placeholder = {this.state.map[4][8]} id="myInput"/> </td>
                </tr>
                  
                <tr>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 0)} maxLength = "1" placeholder = {this.state.map[5][0]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 1)} maxLength = "1" placeholder = {this.state.map[5][1]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 2)} maxLength = "1" placeholder = {this.state.map[5][2]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 3)} maxLength = "1" placeholder = {this.state.map[5][3]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 4)} maxLength = "1" placeholder = {this.state.map[5][4]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 5)} maxLength = "1" placeholder = {this.state.map[5][5]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 6)} maxLength = "1" placeholder = {this.state.map[5][6]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 7)} maxLength = "1" placeholder = {this.state.map[5][7]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 8)} maxLength = "1" placeholder = {this.state.map[5][8]} id="myInput"/> </td>
                </tr>
                <tr>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 0)} maxLength = "1" placeholder = {this.state.map[6][0]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 1)} maxLength = "1" placeholder = {this.state.map[6][1]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 2)} maxLength = "1" placeholder = {this.state.map[6][2]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 3)} maxLength = "1" placeholder = {this.state.map[6][3]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 4)} maxLength = "1" placeholder = {this.state.map[6][4]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 5)} maxLength = "1" placeholder = {this.state.map[6][5]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 6)} maxLength = "1" placeholder = {this.state.map[6][6]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 7)} maxLength = "1" placeholder = {this.state.map[6][7]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 8)} maxLength = "1" placeholder = {this.state.map[6][8]} id="myInput"/> </td>
                </tr>
                  
                <tr>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 0)} maxLength = "1" placeholder = {this.state.map[7][0]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 1)} maxLength = "1" placeholder = {this.state.map[7][1]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 2)} maxLength = "1" placeholder = {this.state.map[7][2]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 3)} maxLength = "1" placeholder = {this.state.map[7][3]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 4)} maxLength = "1" placeholder = {this.state.map[7][4]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 5)} maxLength = "1" placeholder = {this.state.map[7][5]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 6)} maxLength = "1" placeholder = {this.state.map[7][6]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 7)} maxLength = "1" placeholder = {this.state.map[7][7]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 8)} maxLength = "1" placeholder = {this.state.map[7][8]} id="myInput"/> </td>
                </tr>
                <tr>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 0)} maxLength = "1" placeholder = {this.state.map[8][0]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 1)} maxLength = "1" placeholder = {this.state.map[8][1]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 2)} maxLength = "1" placeholder = {this.state.map[8][2]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 3)} maxLength = "1" placeholder = {this.state.map[8][3]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 4)} maxLength = "1" placeholder = {this.state.map[8][4]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 5)} maxLength = "1" placeholder = {this.state.map[8][5]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 6)} maxLength = "1" placeholder = {this.state.map[8][6]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 7)} maxLength = "1" placeholder = {this.state.map[8][7]} id="myInput"/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 8)} maxLength = "1" placeholder = {this.state.map[8][8]} id="myInput"/> </td>
                </tr>
               
            </tbody>

            <th colSpan="9">
                    <button onClick = {this.solve}> Solve </button> <br/>
                    <button onClick = {this.clearPuzzle}> Erase Board </button> <br/> 
                    <button onClick = {this.printMap}> Print to Console </button> <br/>
                    <button onClick = {this.resetTest} > Reset Test </button>
                </th>
                
            </table>
            
            </div>
           
        );
    }
}

export default Home;