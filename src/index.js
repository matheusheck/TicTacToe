import { borderRadius } from "@material-ui/system";
import React, { useState } from "react";
import ReactDOM from "react-dom";

const rowStyle = {
  display: "flex"
};

const squareStyle = {
  width: "60px",
  height: "60px",
  backgroundColor: "b68973",
  margin: "4px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "30px",
  borderRadius: "5px"
};

const boardStyle = {
  backgroundColor: "eabf9f",
  width: "208px",
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  flexDirection: "column",
  borderRadius: "5px"
};

const containerStyle = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  backgroundColor: "#1e212d",

  position: "fixed",
  right: "0",
  bottom: "0",
  width: "100%",
  height: "100%"
};

const instructionsStyle = {
  marginTop: "5px",
  marginBottom: "5px",
  fontWeight: "bold",
  fontSize: "16px",
  color: "#eabf9f",
  fontFamily: "Verdana, sans-serif"
};

const buttonStyle = {
  marginTop: "15px",
  marginBottom: "16px",
  width: "80px",
  height: "40px",
  backgroundColor: "eabf9f",
  color: "#1e212d",
  fontSize: "16px",
  fontFamily: "Verdana, sans-serif",
  borderRadius: "5px"
};

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content,
      reset: this.props.reset
    };
    this.handleClick = this.handleClick.bind(this);
    this.showPoint = this.showPoint.bind(this);
    this.clearScreen = this.clearScreen.bind(this);
  }

  handleClick() {
    if (!this.props.filled && !this.props.block) {
      this.props.handleTurn(this.props.id);
      this.showPoint(this.props.player);
    }
  }

  showPoint(player) {
    this.setState({
      content: player ? "🐱" : "🥕"
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.reset !== prevProps.reset) {
      this.clearScreen();
    }
  }

  clearScreen() {
    this.setState({
      content: ""
    });
  }

  render() {
    return (
      <div className="square" style={squareStyle} onClick={this.handleClick}>
        {this.state.content}
      </div>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      togglePlayer: true,
      moves: { true: [], false: [] },
      winner: "None",
      block: false,
      reset: false,
      nextPlayer: "🐱"
    };

    this.checkWin = this.checkWin.bind(this);
    this.handleTurn = this.handleTurn.bind(this);
    this.handleReset = this.handleReset.bind(this);

    this.square = React.createRef();
  }

  handleTurn(clickedSquare) {
    const player = this.state.togglePlayer;
    const oldMoves = this.state.moves;
    const oldPlayerMoves = player ? oldMoves.true : oldMoves.false;
    const notPlayerMoves = player ? oldMoves.false : oldMoves.true;

    const playerMoves = [clickedSquare, ...oldPlayerMoves];

    if (player) {
      this.setState({
        moves: {
          true: playerMoves,
          false: notPlayerMoves,
          [clickedSquare]: this.state.togglePlayer
        },
        togglePlayer: !this.state.togglePlayer,
        nextPlayer: this.state.togglePlayer ? "🥕" : "🐱"
      });
    }

    if (!player) {
      this.setState({
        moves: {
          true: notPlayerMoves,
          false: playerMoves,
          [clickedSquare]: this.state.togglePlayer
        },
        togglePlayer: !this.state.togglePlayer,
        nextPlayer: this.state.togglePlayer ? "🥕" : "🐱"
      });
    }

    const winner = this.checkWin(playerMoves);
    this.checkGameOver();

    if (winner) {
      this.setState({
        winner: this.state.togglePlayer ? "🐱" : "🥕",
        block: true,
        nextPlayer: ""
      });
    }
  }

  handleReset() {
    this.setState({
      togglePlayer: true,
      moves: { true: [], false: [] },
      winner: "None",
      block: false,
      reset: !this.state.reset,
      nextPlayer: "🐱"
    });
  }

  checkGameOver() {
    const secondPlayerMoves = this.state.moves.false.length;

    if (secondPlayerMoves === 4) {
      this.setState({
        winner: "Game Over",
        block: true,
        nextPlayer: ""
      });
    }
  }

  checkWin(playerMoves) {
    const winOptions = [
      ["aa", "ab", "ac"],
      ["ba", "bb", "bc"],
      ["ca", "cb", "cc"],
      ["aa", "bb", "cc"],
      ["ca", "bb", "ac"],
      ["aa", "ba", "ca"],
      ["ab", "bb", "cb"],
      ["ac", "bc", "cc"]
    ];

    const winner = winOptions.map((winOption) => {
      if (playerMoves.includes(winOption[0])) {
        if (
          playerMoves.includes(winOption[1]) &&
          playerMoves.includes(winOption[2])
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });

    const result = winner.includes(true) ? true : false;
    return result;
  }

  render() {
    return (
      <div style={containerStyle} className="gameBoard">
        <div id="statusArea" className="status" style={instructionsStyle}>
          Next player: <span>{this.state.nextPlayer}</span>
        </div>
        <div id="winnerArea" className="winner" style={instructionsStyle}>
          Winner: <span>{this.state.winner}</span>
        </div>
        <button style={buttonStyle} onClick={this.handleReset}>
          Reset
        </button>
        <div style={boardStyle}>
          <div className="board-row" style={rowStyle}>
            <Square
              id="aa"
              handleTurn={this.handleTurn}
              togglePlayer={this.state.togglePlayer}
              block={this.state.block}
              filled={this.state.moves.aa ? true : false}
              player={this.state.togglePlayer}
              board={this.state.moves}
              reset={this.state.reset}
            />
            <Square
              id="ab"
              handleTurn={this.handleTurn}
              togglePlayer={this.state.togglePlayer}
              block={this.state.block}
              filled={this.state.moves.ab ? true : false}
              player={this.state.togglePlayer}
              board={this.state.moves}
              reset={this.state.reset}
            />
            <Square
              id="ac"
              handleTurn={this.handleTurn}
              togglePlayer={this.state.togglePlayer}
              block={this.state.block}
              filled={this.state.moves.ac ? true : false}
              player={this.state.togglePlayer}
              board={this.state.moves}
              reset={this.state.reset}
            />
          </div>
          <div className="board-row" style={rowStyle}>
            <Square
              id="ba"
              handleTurn={this.handleTurn}
              togglePlayer={this.state.togglePlayer}
              block={this.state.block}
              filled={this.state.moves.ba ? true : false}
              player={this.state.togglePlayer}
              board={this.state.moves}
              reset={this.state.reset}
            />
            <Square
              id="bb"
              handleTurn={this.handleTurn}
              togglePlayer={this.state.togglePlayer}
              block={this.state.block}
              filled={this.state.moves.bb ? true : false}
              player={this.state.togglePlayer}
              board={this.state.moves}
              reset={this.state.reset}
            />
            <Square
              id="bc"
              handleTurn={this.handleTurn}
              togglePlayer={this.state.togglePlayer}
              block={this.state.block}
              filled={this.state.moves.bc ? true : false}
              player={this.state.togglePlayer}
              board={this.state.moves}
              reset={this.state.reset}
            />
          </div>
          <div className="board-row" style={rowStyle}>
            <Square
              id="ca"
              handleTurn={this.handleTurn}
              togglePlayer={this.state.togglePlayer}
              block={this.state.block}
              filled={this.state.moves.ca ? true : false}
              player={this.state.togglePlayer}
              board={this.state.moves}
              reset={this.state.reset}
            />
            <Square
              id="cb"
              handleTurn={this.handleTurn}
              togglePlayer={this.state.togglePlayer}
              block={this.state.block}
              filled={this.state.moves.cb ? true : false}
              player={this.state.togglePlayer}
              board={this.state.moves}
              reset={this.state.reset}
            />
            <Square
              id="cc"
              handleTurn={this.handleTurn}
              togglePlayer={this.state.togglePlayer}
              block={this.state.block}
              filled={this.state.moves.cc ? true : false}
              player={this.state.togglePlayer}
              board={this.state.moves}
              reset={this.state.reset}
            />
          </div>
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
