//
// This is only a SKELETON file for the 'Bowling' exercise. It's been provided as a
// convenience to get you started writing code faster.
//

// import { set } from "core-js/fn/dict";

export class Bowling {
  constructor(){
    this.isFillRoll = [];
    this.awaitingTotals = [];
    this.rolls = [];
    this.total = 0;
    this.totalIsFinal = false;
    this.frames = [];
    this.index = 0;
    this.handleFrameEnd = this.handleFrameEnd.bind(this)
    this.handleAwaitingTotals = this.handleAwaitingTotals.bind(this)
  }
  roll(roll) {
    //checks if a roll is negative 
    if(roll < 0){
      throw new Error('Negative roll is invalid')
    }
    //checked if more then 10
    if(roll >= 11){
      throw new Error('Pin count exceeds pins on the lane')
    }
    // console.log("length", this.frames.length)
    //end of game score
    if(this.frames.length >= 10 && !this.isFillRoll){ 
      throw new Error('Cannot roll after game is over')  
    }
    //  console.log(roll) 
    this.rolls.push(roll)
    this.handleAwaitingTotals(roll)
    if(this.isFillRoll)
    //reset rolls
    // if(rolls.length === 10){
    //   frames.push(rolls)
      
    // }
    //checking if its a strike 
    if(roll === 10 && this.rolls.length === 1){
      this.frames.push(roll)
      this.handleFrameEnd();
      if(this.frames.length === 9){
        if(!this.isFillRoll){
          const endGameStrikeObject = {
            endGame: true, 
            rollsToAdd: 2,
          }
          this.awaitingTotals.push(endGameStrikeObject)
          this.total += roll  
       
        }
      }else
    {
      const strikeObject = {
        strike: true,
        rollsToAdd: 2
      }
      this.awaitingTotals.push(strikeObject)
      this.total += roll
    }
      // console.log(strikeObject)
    }
 
//checking if its a second roll 
    if(this.rolls.length === 2){
      const sum = this.rolls[0] + roll;
      if(sum > 10){
        throw new Error('Pin count exceeds pins on the lane') 
      }
      this.frames.push(sum)
      this.rolls = [];
      this.index += 1;
      
      //check if its a spare
      if(sum === 10){
        if(this.frames.length >= 10){
          if(!this.isFillRoll){
            const endGameStrikeObject = {
              endGame: true, 
              rollsToAdd: 2,
            }
            this.awaitingTotals.push(endGameStrikeObject)
          }
       
        }else{

          const spareObject = {
            strike: false,
            rollsToAdd: 1
            
            
          }
          this.awaitingTotals.push(spareObject)
        }
        // console.log(spareObject)
      }
        this.total += sum
      

    }
    console.log("score", this.total)
  }
  
  
  //total score
  score() {
    // console.log("scoreLegnth" , this.frames.length)
    if(this.frames.length < 10){
      throw new Error('Score cannot be taken until the end of the game')  
    }
    return this.total
    
  }
  handleFrameEnd() {
    this.rolls = [];
    this.index += 1;
  }
  handleAwaitingTotals(roll) {
    const updatingAwaitingTotals = [];
    this.awaitingTotals.forEach((awaitingTotal)=> {
      const endGame = awaitingTotal.endGame
      if(endGame){
        this.isFillRoll = true;
      }
      let rollsToAdd = awaitingTotal.rollsToAdd;
      this.total += roll 
      rollsToAdd -= 1  
      if(rollsToAdd <= 0){
        this.isFillRoll = false;
        return 
      } 
      const updatedObject = {...awaitingTotal}
      updatedObject.rollsToAdd = rollsToAdd;
      updatingAwaitingTotals.push(updatedObject)
    })
    this.awaitingTotals = updatingAwaitingTotals
  }
}
