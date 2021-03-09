// Container for Sudoku solving strategies

export function isfinished(newMap) {
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
}

export function alreadyContain(element, array) {
    let answer = false;
        for (let i = 0; i < array.length; i++){
            if (array[i] === element){
                answer = true;
            }
        }//end for
        return answer;
}

export function oneRule(newMap, i, j) {
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
}


 //given a grid, and a set of coords returns a guaranteed answer or leaves space blank
    //oneRule checks vertical, horizontal and 3x3 and holds an array of possibilites based on what it finds...
    //if there is only possibilty it pushes that answer into the cell   
export function deduction(newMap, i, j, possible) {
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
                        let newarray = oneRule(newMap, counter1, counter2);
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


export function closerLook(newMap) {
    let allpossibilities = [];

            for(let i = 0; i < newMap.length; i++){
                allpossibilities[i] = [];
                for (let j = 0; j < newMap.length; j++){
                    allpossibilities[i][j] = [];
                    if(newMap[i][j] === 0){
                        allpossibilities[i][j][0] = 0;  //found a cell not filled
                        allpossibilities[i][j][1] = oneRule(newMap, i, j); //call oneRule
                    }
                    else{
                        allpossibilities[i][j][0] = newMap[i][j];   //cell already filled
                        allpossibilities[i][j][1] = 0;  //zero possibilities
                    }
                }
            }
            console.log("called");
    return allpossibilities;
}

export function reducePossibilities(allpossibilities, newMap) {
    for (let i = 0; i < allpossibilities.length; i++){
        for (let j = 0; j < allpossibilities[i].length; j++){
            if(allpossibilities[i][j][0] === 0){             //identifies cell to be checked if it is empty
               //look at indexes directly above, below, left and right for a similar possibility
                let originalPo = allpossibilities[i][j][1];
         
                allpossibilities = verticalMatch(originalPo, i, j, allpossibilities, newMap); //look for vertical matches
                allpossibilities = horizontalMatch(originalPo, i, j, allpossibilities, newMap); //look for horizontal matches      
                
            }
            else{
                continue;
            }
        }
    }

    return allpossibilities;
}

export function horizontalMatch(originalPo, i, j, allpossibilities, newMap){
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
                if(alreadyContain(originalPo[count1], allpossibilities[i][column][1]) !== true){
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
                            if(alreadyContain(originalPo[count1], allpossibilities[count2][count3][1]) === true){ 
                                setValue.push(originalPo[count1]);
                            }
                            
                        }// end for w/ count3
                    }// end for w/ count2
                }
                if(alreadyContain(originalPo[count1], setValue) === false){
                    let iterate = 0;
                    while(iterate !== 9){
                        if(alreadyContain(originalPo[count1], allpossibilities[i][iterate][1]) === true){
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
}

export function verticalMatch(originalPo, i, j, allpossibilities, newMap) {
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
                    if(alreadyContain(originalPo[count1], allpossibilities[row][j][1]) !== true){
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
                                if(alreadyContain(originalPo[count1], allpossibilities[count2][count3][1]) === true){ 
                                    setValue.push(originalPo[count1]);
                                }
                                
                            } //end for w/ count3
                        }// end for w/ count2
                    }
                    if(alreadyContain(originalPo[count1], setValue) === false){
                        
                        let iterate = 0;
                        while(iterate !== 9){
                            if(alreadyContain(originalPo[count1], allpossibilities[iterate][j][1]) === true){
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
}
