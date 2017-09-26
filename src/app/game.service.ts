import { Injectable } from '@angular/core';
import { Marker } from './marker.enum';
import { Game } from './game';
import { GameState } from './game-state.enum';
import { Turn } from './turn';
import { TurnService } from './turn.service';
import { Subscription } from 'rxjs';
import { Space } from './space';
import { Player } from './player';
import { AiPlayer } from './ai-player';
import { HumanPlayer } from './human-player';
import { AiDifficulty } from './ai-difficulty.enum';
import { Subject, Observable } from 'rxjs';
import { PlayerFactoryService } from './player-factory.service';
import { GameUpdateService } from './game-update.service';
import { PlayerTemplate } from './player-template';
import { Winner } from './winner';

@Injectable()
export class GameService {
	constructor(private _turnService: TurnService,
		private _playerFactoryService: PlayerFactoryService,
		private _gameUpdateService: GameUpdateService) { }

	private _activePlayerIndex: number = undefined;
	private _state: GameState = GameState.NotStarted;
	private _grid: Space[][] = [
		[new Space(), new Space(), new Space()],
		[new Space(), new Space(), new Space()],
		[new Space(), new Space(), new Space()]
	];
	private _playerOne: Player;
	private _playerTwo: Player;
	private _playerOneTemplate: PlayerTemplate;
	private _playerTwoTemplate: PlayerTemplate;
	private _turnStream: Subscription;
	private _turnCallbacks: (() => boolean)[] = [];

	public get activePlayer(): Player {
		if (this._activePlayerIndex >= 0) {
			return this.players[this._activePlayerIndex];
		} else {
			return undefined;
		}
	}

	public get grid(): Space[][] {
		return this._grid;
	}

	public get players(): Player[] {
		return [this.playerOne, this.playerTwo];
	}

	public get playerOne(): Player {
		return this._playerOne;
	}

	public get playerTwo(): Player {
		return this._playerTwo;
	}

	public get playerOneTemplate(): PlayerTemplate {
		if (!this._playerOneTemplate) {
			this._playerOneTemplate = new PlayerTemplate();
			this._playerOneTemplate.name = "Player 1";
			this._playerOneTemplate.marker = Marker.Circle;
			this._playerOneTemplate.isHumanPlayer = true;
		}
		return this._playerOneTemplate;
	}

	public get playerTwoTemplate(): PlayerTemplate {
		if (!this._playerTwoTemplate) {
			this._playerTwoTemplate = new PlayerTemplate();
			this._playerTwoTemplate.name = "Player 2";
			this._playerTwoTemplate.marker = Marker.Cross;
			this._playerTwoTemplate.isHumanPlayer = false;
			this._playerTwoTemplate.difficulty = AiDifficulty.Normal;
		}

		return this._playerTwoTemplate;
	}

	public get playerTemplates(): PlayerTemplate[] {
		return [this.playerOneTemplate, this.playerTwoTemplate];
	}

	public get state(): GameState {
		return this._state;
	}

	public startGame(): void {
		if (!this._turnStream || this._turnStream.closed) {
			this._turnStream = this._turnService
				.get()
				.subscribe(turn => this.processTurn(turn));
		}

		this.clearGrid(this.grid);

		this._playerOne = this._playerFactoryService.getPlayer(this.playerOneTemplate);
		this._playerTwo = this._playerFactoryService.getPlayer(this.playerTwoTemplate);
		this._state = GameState.NotStarted;
		this._gameUpdateService.send(this.getInstance());

		this._activePlayerIndex =
			this.players
				.findIndex(player => player.marker === Marker.Circle);
		this._state = GameState.WaitingForTurn;
		this._gameUpdateService.send(this.getInstance());
		this.activePlayer.startTurn(this.getInstance());
	}

	public canStartGame(): boolean {
		return true;
	}

	public getInstance(): Game {
		let game: Game = new Game(this.getWinner);
		game.activePlayer = this.activePlayer;
		game.grid = this.grid;
		game.players = this.players;
		game.playerOne = this.playerOne;
		game.playerTwo = this.playerTwo;
		game.state = this._state;
		return game;
	}

	public updates(): Observable<Game> {
		return this._gameUpdateService.get();
	}

	private processTurn(turn: Turn): void {
		if (turn.sourcePlayer === this.activePlayer) {
			console.log("processing turn from " + turn.sourcePlayer.name);

			this._state = GameState.ProcessingTurn;
			turn.space.claimedBy = turn.sourcePlayer;

			let winner = this.getWinner();

			if (winner || this.isDraw(this.grid)) {
				this._state = GameState.Complete;
				let logMessage = winner
					? 'game ended, ' +
					winner.player.name +
					' won'
					: 'game ended in draw';
				console.log(logMessage);
			}

			this._gameUpdateService.send(this.getInstance())
		}
	}

	public nextTurn(): void {
		this._activePlayerIndex++;
		if (this._activePlayerIndex === this.players.length) {
			this._activePlayerIndex = 0;
		}

		this._state = GameState.WaitingForTurn;
		this._gameUpdateService.send(this.getInstance());
		this.activePlayer.startTurn(this.getInstance());
	}

	private clearGrid(grid: Space[][]): void {
		grid
			.forEach((row, rowInd) => row
				.forEach((space, colInd) => {
					space.claimedBy = undefined;
					space.row = rowInd;
					space.column = colInd;
				}));
	}

	private areAllSquaresClaimed(): boolean {
		return this.grid
			.every(row => row
				.every(space => Boolean(space.claimedBy)));
	}

	public isDraw(grid: Space[][]): boolean {
		return !this.getWinner(grid)
			&& this.areAllSquaresClaimed();
	}

	public getWinner(grid?: Space[][]): Winner {
		if (!grid) {
			grid = this.grid;
		}

		let winner: Winner = undefined;
		let winningCombinationIndices = [
			[
				[0, 0],
				[0, 1],
				[0, 2]
			],
			[
				[1, 0],
				[1, 1],
				[1, 2]
			],
			[
				[2, 0],
				[2, 1],
				[2, 2]
			],
			[
				[0, 0],
				[1, 0],
				[2, 0]
			],
			[
				[0, 1],
				[1, 1],
				[2, 1]
			],
			[
				[0, 2],
				[1, 2],
				[2, 2]
			],
			[
				[0, 0],
				[1, 1],
				[2, 2]
			],
			[
				[2, 0],
				[1, 1],
				[0, 2]
			],
		];

		let winningCombinationSpaces =
			winningCombinationIndices
				.map(combo =>
					combo
						.map(space => this.grid[space[0]][space[1]]));
		let winningCombo =
			winningCombinationSpaces
				.find(combo =>
					combo
						.every(space =>
							space.claimedBy
							&& space.claimedBy === combo[0].claimedBy));
		if (winningCombo) {
			winner = new Winner();
			winner.player = winningCombo[0].claimedBy;
			winner.spaces = winningCombo;
		}

		return winner;
	}
}
