import React, { Component } from "react";
import ReactDOM from 'react-dom';
import '../App.css';

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

    isfinished = (newMap) => {  //returns true if puzzle is finished, else false... ie checks for any values of 0 in grid
        let answer = true;
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if(newMap[i][j] === 0){
                    answer = false;
                }
                else{
                    continue;
                }
            }// end for w/ j
        }//end for w/ i
        return answer;
    }// end of isFinished

    printMap = () => {  //prints the current state and the possible answers if any cells are unfilled
        console.log(this.state.map);
        let allposibilities = this.closerLook(this.state.map);
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

    alreadyContain = (element, array) => {  //looks for a particular element in an array, returns true if it's there
        let answer = false;
        for (let i = 0; i < array.length; i++){
            if (array[i] === element){
                answer = true;
            }
        }//end for
        return answer;
    }//end of alreadyContain

    horizontalMatch = (originalPo, i, j, allpossibilities, newMap) => {
        let x = (Math.trunc(i/3))*3;
        let y = (Math.trunc(j/3))*3;
        for (let column = y; column !== y+3; column++){
            if (j === column){  //if cell is the same
                continue;
            }
            else if (allpossibilities[i][column][1] === 0){ //if cell has zero possibilities... aka already filled
                continue;
            }
            else {      //confirmed the comparing cell is empty and not the same as cell [i][j]
                for (let count1 = 0; count1 < originalPo.length; count1++){
                    let setValue = [];
                    if(this.alreadyContain(originalPo[count1], allpossibilities[i][column][1]) !== true){
                        continue;
                    }
                    else{
                        //check to make sure no indices not in this horizontal (i) have this particular possibility
                        for (let count2 = x; count2 !== x+3; count2++){
                            for (let count3 = y; count3 !== y+3; count3++){
                                if(count2 === i){ // don't look in the same row to determine if to eliminate
                                    continue;
                                }
                                if(allpossibilities[count2][count3][1] === 0){   // don't look at already filled cells to determine if to eliminate
                                    continue;
                                }
                                if(this.alreadyContain(originalPo[count1], allpossibilities[count2][count3][1]) === true){ 
                                    setValue.push(originalPo[count1]);
                                }
                                
                            }// end for w/ count3
                        }// end for w/ count2
                    }
                    if(this.alreadyContain(originalPo[count1], setValue) === false){
                        let iterate = 0;
                        while(iterate !== 9){
                            if(this.alreadyContain(originalPo[count1], allpossibilities[i][iterate][1]) === true){
                                if(iterate !== y && iterate !== y+1 && iterate !== y+2){
                                    //remove originalPo[count1] from allpossibilities[iterate][j][1]
                                    let remove = allpossibilities[i][iterate][1].indexOf(originalPo[count1]);
                                    if (remove > -1){
                                        allpossibilities[i][iterate][1].splice(remove, 1);
                                        console.log("Horizontal Match found at " + i + " " + j + " to reduce possibilities at " + i + " " + iterate + " to be " + allpossibilities[i][iterate][1]);
                                    }
                                    if (allpossibilities[i][iterate][1].length === 1){
                                        newMap[i][iterate] = allpossibilities[i][iterate][1][0];
                                        console.log("Horizontal Match found " + i + " " + iterate + " to be " + allpossibilities[i][iterate][1][0]);
                                    }
                                }
                            }
                            iterate++;
                        }
                        //iterate through column (j) and eliminate content from other possibility arrays


                    }
                    
                }// end for w/ count1

            }
        

        }//end for w/ column
        return allpossibilities; //return the row if there is a vertical match (new i)
    }// end of horizontalMatch

    verticalMatch = (originalPo, i, j, allpossibilities, newMap) => {
        
        let x = (Math.trunc(i/3))*3;
        let y = (Math.trunc(j/3))*3;
        for (let row = x; row !== x+3; row++){
            if (i === row){  //if cell is the same
                continue;
            }
            else if (allpossibilities[row][j][1] === 0){ //if cell has zero possibilities... aka already filled
                continue;
            }
            else {      //confirmed the comparing cell is empty and not the same as cell [i][j]
                for (let count1 = 0; count1 < originalPo.length; count1++){
                    let setValue = [];
                    if(this.alreadyContain(originalPo[count1], allpossibilities[row][j][1]) !== true){
                        continue;
                    }
                    else{
                        //check to make sure no indices not in this vertical (j) have this particular possibility
                        for (let count2 = x; count2 !== x+3; count2++){
                            for (let count3 = y; count3 !== y+3; count3++){
                                if(count3 === j){ // don't look in the same column to determine if to eliminate
                                    continue;
                                }
                                if(allpossibilities[count2][count3][1] === 0){   // don't look at already filled cells to determine if to eliminate
                                    continue;
                                }
                                if(this.alreadyContain(originalPo[count1], allpossibilities[count2][count3][1]) === true){ 
                                    setValue.push(originalPo[count1]);
                                }
                                
                            } //end for w/ count3
                        }// end for w/ count2
                    }
                    if(this.alreadyContain(originalPo[count1], setValue) === false){
                        
                        let iterate = 0;
                        while(iterate !== 9){
                            if(this.alreadyContain(originalPo[count1], allpossibilities[iterate][j][1]) === true){
                                if(iterate !== x && iterate !== x+1 && iterate !== x+2){
                                    //remove originalPo[count1] from allpossibilities[iterate][j][1]
                                    let remove = allpossibilities[iterate][j][1].indexOf(originalPo[count1]);
                                    if (remove > -1){
                                        allpossibilities[iterate][j][1].splice(remove, 1);
                                        console.log("Vertical Match found at " + i + " " + j + " to reduce possibilities at " + iterate + " " + j + " to be " + allpossibilities[iterate][j][1]);
                                    }
                                    if (allpossibilities[iterate][j][1].length === 1){
                                        newMap[iterate][j] = allpossibilities[iterate][j][1][0];
                                        console.log("Vertical Match found " + iterate + " " + j + " to be " + allpossibilities[iterate][j][1][0]);
                                    }
                                }
                            }
                            iterate++;
                        }
                        //iterate through column (j) and eliminate content from other possibility arrays


                    }
                    
                }// end for w/ count1

            }

        }//end for w/ row
        return allpossibilities; //return the row if there is a vertical match (new i)
    }//end verticalMatch

    
    //given a grid, and a set of coords returns a guaranteed answer or leaves space blank
    //oneRule checks vertical, horizontal and 3x3 and holds an array of possibilites based on what it finds...
    //if there is only possibilty it pushes that answer into the cell
    oneRule = (newMap, i, j) => {    
        let possible = [];
        for(let solution = 1; solution !== 10; solution++){
//            console.log("possible array contains " + possible);
            let column = 0;
            let row = 0;
            let isProper = true;
            

            while (column !== 9){               //check if current column contains number already
                if (newMap[i][column] === solution){
                    isProper = false;
                    break;
                }
                else if (isProper === false){
                    break;
                }
                column++;
            }  //end while w/ column

            while (row !== 9){
                if(newMap[row][j] === solution){
                    isProper = false;
                    break;
                }
                else if(isProper === false){
                    break;
                }
                row++;
            }  //end while w/ row
                
            let x = (Math.trunc(i/3))*3;
            for (let counter1 = x; counter1 !== x+3; counter1++){
                let y = (Math.trunc(j/3))*3;
                for(let counter2 = y; counter2 !== y+3; counter2++){
                    if (newMap[counter1][counter2] === solution){
                        isProper = false; 
                        break;
                    }
                }//end for w/ counter2
                if (isProper === false){
                    break;
                }
            }  //end for w/ counter1 
            
            if(isProper !== false){
                possible.push(solution);
            }
          
        }   //end for w/ solution     
            return possible;       
        
    }   //end oneRule

    //scan other empty cells in 3x3 to determine if current cell is the only possible fit for a number
    deduction = (newMap, i, j, possible) => {
        let oldarray = [];
        let x = (Math.trunc(i/3))*3;
            for (let counter1 = x; counter1 !== x+3; counter1++){
                let y = (Math.trunc(j/3))*3;
                for(let counter2 = y; counter2 !== y+3; counter2++){
                   
                    if (newMap[counter1][counter2] !== 0){
                        continue;
                    }
                    else if(counter1 === i && counter2 === j){
                        continue;
                    }
                    else {               
                        let newarray = this.oneRule(newMap, counter1, counter2);
                        oldarray = newarray.concat(oldarray);

                    }
                }
            }

        for(let value1 = 0; value1 < possible.length; value1++){    //iterating through what possibilities are in either array
            for(let value2 = 0; value2 < oldarray.length; value2++){
                if(possible[value1] === oldarray[value2]){
                    break;
                }
                if(possible[value1] !== oldarray[value2] && value2 === oldarray.length - 1){
                    return possible[value1];                        //if given index value has one differing value, it is the only possible value
                }
            }
        }
        return 0; //placeholder
    }

//similar to penciling in the possible solutions in the corner of a cell
//creates 3d array called allpossibilities... i = rows, j = columns and 
//the next number determines if you want the cell's contents or possibilities
//allposibilities[i][j][0] = a cell's existing number or a zero... not an array
//allposibilities[i][j][1] = a zero or an array of the possibilities this cell has... 
//if the cell is empty it goes through oneRule to get this array
    closerLook = (newMap) => {
        let allpossibilities = [];

            for(let i = 0; i < newMap.length; i++){
                allpossibilities[i] = [];
                for (let j = 0; j < newMap.length; j++){
                    allpossibilities[i][j] = [];
                    if(newMap[i][j] === 0){
                        allpossibilities[i][j][0] = 0;  //found a cell not filled
                        allpossibilities[i][j][1] = this.oneRule(newMap, i, j); //call oneRule
                    }
                    else{
                        allpossibilities[i][j][0] = newMap[i][j];   //cell already filled
                        allpossibilities[i][j][1] = 0;  //zero possibilities
                    }
                }
            }

        return allpossibilities;

    }

    reducePossibilities = (allpossibilities, newMap) => {
        
        for (let i = 0; i < allpossibilities.length; i++){
            for (let j = 0; j < allpossibilities[i].length; j++){
                if(allpossibilities[i][j][0] === 0){             //identifies cell to be checked if it is empty
                   //look at indexes directly above, below, left and right for a similar possibility
                    let originalPo = allpossibilities[i][j][1];
             
                    allpossibilities = this.verticalMatch(originalPo, i, j, allpossibilities, newMap); //look for vertical matches
                    allpossibilities = this.horizontalMatch(originalPo, i, j, allpossibilities, newMap); //look for horizontal matches      
                    
                }
                else{
                    continue;
                }
            }
        }

        return allpossibilities;
    }

    solve = () => {       
        let newMap = this.state.map.slice();
        let change = !this.isfinished(newMap);
        let waschanged = false;  //variable change will allow at least 10 cycles to execute and beyond if cells continue to be changed
        //double for-loop iterates through matrix checking for empty spaces

            for(let i = 0; i < 9; i++){
                for(let j = 0; j < 9; j++){
                    if(newMap[i][j] === 0){      //if cell is empty, put correct answer in
                        
                        let possible = this.oneRule(newMap, i, j); //set possible to the total possible number that could fit in this cell
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
                            let temp = this.deduction(newMap, i, j, possible);
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
        change = !this.isfinished(newMap);
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
            let allpossibilities = this.closerLook(newMap);
            //console.log(allpossibilities);
            allpossibilities = this.reducePossibilities(allpossibilities, newMap);
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
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 0)} maxLength = "1" placeholder = {this.state.map[0][0]} /> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 1)} maxLength = "1" placeholder = {this.state.map[0][1]} /> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 2)} maxLength = "1" placeholder = {this.state.map[0][2]} /> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 3)} maxLength = "1" placeholder = {this.state.map[0][3]} /> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 4)} maxLength = "1" placeholder = {this.state.map[0][4]} /> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 5)} maxLength = "1" placeholder = {this.state.map[0][5]} /> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 6)} maxLength = "1" placeholder = {this.state.map[0][6]} /> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 7)} maxLength = "1" placeholder = {this.state.map[0][7]} /> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 0, 8)} maxLength = "1" placeholder = {this.state.map[0][8]} /> </td>
                </tr>
                  
                <tr>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 0)} maxLength = "1" placeholder = {this.state.map[1][0]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 1)} maxLength = "1" placeholder = {this.state.map[1][1]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 2)} maxLength = "1" placeholder = {this.state.map[1][2]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 3)} maxLength = "1" placeholder = {this.state.map[1][3]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 4)} maxLength = "1" placeholder = {this.state.map[1][4]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 5)} maxLength = "1" placeholder = {this.state.map[1][5]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 6)} maxLength = "1" placeholder = {this.state.map[1][6]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 7)} maxLength = "1" placeholder = {this.state.map[1][7]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 1, 8)} maxLength = "1" placeholder = {this.state.map[1][8]}/> </td>
                </tr>
                <tr>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 0)} maxLength = "1" placeholder = {this.state.map[2][0]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 1)} maxLength = "1" placeholder = {this.state.map[2][1]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 2)} maxLength = "1" placeholder = {this.state.map[2][2]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 3)} maxLength = "1" placeholder = {this.state.map[2][3]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 4)} maxLength = "1" placeholder = {this.state.map[2][4]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 5)} maxLength = "1" placeholder = {this.state.map[2][5]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 6)} maxLength = "1" placeholder = {this.state.map[2][6]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 7)} maxLength = "1" placeholder = {this.state.map[2][7]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 2, 8)} maxLength = "1" placeholder = {this.state.map[2][8]}/> </td>
                </tr>
                  
                <tr>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 0)} maxLength = "1" placeholder = {this.state.map[3][0]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 1)} maxLength = "1" placeholder = {this.state.map[3][1]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 2)} maxLength = "1" placeholder = {this.state.map[3][2]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 3)} maxLength = "1" placeholder = {this.state.map[3][3]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 4)} maxLength = "1" placeholder = {this.state.map[3][4]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 5)} maxLength = "1" placeholder = {this.state.map[3][5]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 6)} maxLength = "1" placeholder = {this.state.map[3][6]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 7)} maxLength = "1" placeholder = {this.state.map[3][7]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 3, 8)} maxLength = "1" placeholder = {this.state.map[3][8]}/> </td>
                </tr>
                <tr>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 0)} maxLength = "1" placeholder = {this.state.map[4][0]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 1)} maxLength = "1" placeholder = {this.state.map[4][1]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 2)} maxLength = "1" placeholder = {this.state.map[4][2]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 3)} maxLength = "1" placeholder = {this.state.map[4][3]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 4)} maxLength = "1" placeholder = {this.state.map[4][4]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 5)} maxLength = "1" placeholder = {this.state.map[4][5]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 6)} maxLength = "1" placeholder = {this.state.map[4][6]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 7)} maxLength = "1" placeholder = {this.state.map[4][7]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 4, 8)} maxLength = "1" placeholder = {this.state.map[4][8]}/> </td>
                </tr>
                  
                <tr>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 0)} maxLength = "1" placeholder = {this.state.map[5][0]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 1)} maxLength = "1" placeholder = {this.state.map[5][1]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 2)} maxLength = "1" placeholder = {this.state.map[5][2]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 3)} maxLength = "1" placeholder = {this.state.map[5][3]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 4)} maxLength = "1" placeholder = {this.state.map[5][4]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 5)} maxLength = "1" placeholder = {this.state.map[5][5]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 6)} maxLength = "1" placeholder = {this.state.map[5][6]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 7)} maxLength = "1" placeholder = {this.state.map[5][7]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 5, 8)} maxLength = "1" placeholder = {this.state.map[5][8]}/> </td>
                </tr>
                <tr>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 0)} maxLength = "1" placeholder = {this.state.map[6][0]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 1)} maxLength = "1" placeholder = {this.state.map[6][1]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 2)} maxLength = "1" placeholder = {this.state.map[6][2]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 3)} maxLength = "1" placeholder = {this.state.map[6][3]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 4)} maxLength = "1" placeholder = {this.state.map[6][4]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 5)} maxLength = "1" placeholder = {this.state.map[6][5]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 6)} maxLength = "1" placeholder = {this.state.map[6][6]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 7)} maxLength = "1" placeholder = {this.state.map[6][7]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 6, 8)} maxLength = "1" placeholder = {this.state.map[6][8]}/> </td>
                </tr>
                  
                <tr>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 0)} maxLength = "1" placeholder = {this.state.map[7][0]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 1)} maxLength = "1" placeholder = {this.state.map[7][1]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 2)} maxLength = "1" placeholder = {this.state.map[7][2]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 3)} maxLength = "1" placeholder = {this.state.map[7][3]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 4)} maxLength = "1" placeholder = {this.state.map[7][4]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 5)} maxLength = "1" placeholder = {this.state.map[7][5]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 6)} maxLength = "1" placeholder = {this.state.map[7][6]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 7)} maxLength = "1" placeholder = {this.state.map[7][7]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 7, 8)} maxLength = "1" placeholder = {this.state.map[7][8]}/> </td>
                </tr>
                <tr>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 0)} maxLength = "1" placeholder = {this.state.map[8][0]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 1)} maxLength = "1" placeholder = {this.state.map[8][1]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 2)} maxLength = "1" placeholder = {this.state.map[8][2]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 3)} maxLength = "1" placeholder = {this.state.map[8][3]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 4)} maxLength = "1" placeholder = {this.state.map[8][4]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 5)} maxLength = "1" placeholder = {this.state.map[8][5]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 6)} maxLength = "1" placeholder = {this.state.map[8][6]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 7)} maxLength = "1" placeholder = {this.state.map[8][7]}/> </td>
                <td> <input type = "text" onInput = {(ev) => this.handleInput(ev, 8, 8)} maxLength = "1" placeholder = {this.state.map[8][8]}/> </td>
                </tr>
               
            </tbody>

            <th colSpan="9">
                    <button onClick = {this.solve}> Solve </button> <br/>
                    <button onClick = {this.clearPuzzle}> Erase Board </button> <br/> 
                    <button onClick = {this.printMap}> Print to Console </button> <br/>
                    <button onClick = {this.resetTest}> Reset Test </button>
                </th>
                
            </table>
            
            </div>
           
        );
    }
}

export default Home;