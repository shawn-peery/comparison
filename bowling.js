import { timingSafeEqual } from "crypto";

export class Bowling {
  constructor() {
    this.toSetNotFillRoll = false;
    this.isFillRoll = false;
    this.awaitingTotals = [];
    this.rolls = [];
    this.total = 0;
    this.frames = [];
    this.totalIsFinal = false;
    this.handleFrameEnd = this.handleFrameEnd.bind(this);
    this.handleAwaitingTotals = this.handleAwaitingTotals.bind(this);
    this.handleStrike = this.handleStrike.bind(this);
    this.handleSecondRoll = this.handleSecondRoll.bind(this);
    this.handleSpare = this.handleSpare.bind(this);
    this.validateInput = this.validateInput.bind(this);
  }
  roll(roll) {
    // Validates input (not negative. Logical)
    this.validateInput(roll);

    // Pushes roll to rolls array
    this.rolls.push(roll);

    // Handles any awaiting totals from strikes/spares
    const handleFillFunction = this.handleAwaitingTotals(roll);

    // Handles strikes
    if (roll === 10 && this.rolls.length === 1) {
      this.handleStrike(roll);
    }

    // Handles spares & open frames
    if (this.rolls.length === 2 && !this.isFillRoll && !this.totalIsFinal) {
      this.handleSecondRoll(roll);
    }

    // Used to set isFillRoll afterwards
    if (handleFillFunction) {
      handleFillFunction();
    }
  }

  //total score
  score() {
    // console.log("scoreLegnth" , this.frames.length)
    if (this.frames.length < 10) {
      throw new Error("Score cannot be taken until the end of the game");
    }

    if (this.awaitingTotals.length > 0) {
      throw new Error("Score cannot be taken until the end of the game");
    }

    return this.total;
  }
  handleFrameEnd() {
    this.rolls = [];
  }

  validateInput(roll) {
    //checks if a roll is negative
    if (roll < 0) {
      throw new Error("Negative roll is invalid");
    }
    //checks if a roll is more then 10
    if (roll >= 11) {
      throw new Error("Pin count exceeds pins on the lane");
    }
    //Checks if the game is over (Frames are 10 or greater and isFillRoll is false)
    if (this.frames.length >= 10 && !this.isFillRoll) {
      throw new Error("Cannot roll after game is over");
    }
  }

  handleStrike(roll) {
    this.frames.push(roll);
    this.handleFrameEnd();

    const strikeObject = {
      strike: true,
      rollsToAdd: 2,
    };

    if (this.frames.length >= 10) {
      if (!this.isFillRoll && !this.totalIsFinal) {
        const endGameStrikeObject = { ...strikeObject, endGame: true };
        this.awaitingTotals.push(endGameStrikeObject);
        this.isFillRoll = true;
        this.total += roll;
      }
    } else {
      this.awaitingTotals.push(strikeObject);
      this.total += roll;
    }
  }

  handleSecondRoll(roll) {
    const sum = this.rolls[0] + roll;
    if (sum > 10) {
      throw new Error("Pin count exceeds pins on the lane");
    }
    this.frames.push(sum);
    this.rolls = [];
    this.index += 1;

    //check if its a spare
    if (sum === 10) {
      this.handleSpare(roll);
    }
    this.total += sum;
  }

  handleSpare(roll) {
    if (this.frames.length >= 10) {
      if (!this.isFillRoll) {
        const endGameSpareObject = {
          endGame: true,
          rollsToAdd: 1,
        };
        this.awaitingTotals.push(endGameSpareObject);
        this.isFillRoll = true;
      }
    } else {
      const spareObject = {
        strike: false,
        rollsToAdd: 1,
      };
      this.awaitingTotals.push(spareObject);
    }
    // console.log(spareObject)
  }

  handleAwaitingTotals(roll) {
    if (this.rolls.length == 2) {
      const sum = this.rolls.reduce((sumA, roll) => (sumA += roll));

      if (sum > 10) {
        throw new Error("Pin count exceeds pins on the lane");
      }
    }

    const updatingAwaitingTotals = [];
    let isFillRoll = this.isFillRoll;
    this.awaitingTotals.forEach((awaitingTotal) => {
      const endGame = awaitingTotal.endGame;

      let rollsToAdd = awaitingTotal.rollsToAdd;
      this.total += roll;
      rollsToAdd -= 1;
      if (rollsToAdd <= 0) {
        if (endGame) {
          this.isFillRoll = false;
          this.totalIsFinal = true;
        }
        return;
      }
      const updatedObject = { ...awaitingTotal };
      updatedObject.rollsToAdd = rollsToAdd;
      updatingAwaitingTotals.push(updatedObject);
    });

    this.awaitingTotals = updatingAwaitingTotals;

    // if (isFillRoll !== this.isFillRoll) {
    //   return () => {
    //     this.isFillRoll = isFillRoll;
    //   };
    // }
  }
}
