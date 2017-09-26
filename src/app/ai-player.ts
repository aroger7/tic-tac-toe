import { Game } from './game';
import { GameState } from './game-state.enum';
import { Player } from './player';
import { Marker } from './marker.enum';
import { Turn } from './turn';
import { TurnService } from './turn.service';
import { AiDifficulty } from './ai-difficulty.enum';
import { Space } from './space';
import { SpaceSelectionService } from './space-selection.service';


export class AiPlayer implements Player {

	constructor(private _turnService: TurnService,
		public name: string,
		public marker: Marker,
		public difficulty: AiDifficulty = AiDifficulty.Normal) {

	}

	public get isHumanPlayer(): boolean {
		return false;
	}

	public startTurn(game: Game): void {
		console.log(this.name + '\'s turn is starting')
		if (game && game.state === GameState.WaitingForTurn) {
			this.getMove(game);
		} else {
			console.log("Error choosing grid space, " + this.name);
		}
	}

	private getMove(game: Game): void {
		let availableSpaces =
			game.grid
				.map(row => row
					.filter(space => !space.claimedBy))
				.reduce((acc, row) => acc.concat(row), []);
		let scores = [];
		for (let i = 0; i < availableSpaces.length; i++) {
			let score =
				this.alphaBeta(game,
					availableSpaces.length - 1,
					this,
					availableSpaces[i],
					Number.NEGATIVE_INFINITY,
					Number.POSITIVE_INFINITY);
			scores.push({
				space: availableSpaces[i],
				value: score
			});
		}

		scores.sort((a, b) => {
			if (a.value < b.value) {
				return 1;
			} else if (a.value > b.value) {
				return -1;
			}

			return 0;
		});

		let divider: number;
		switch (this.difficulty) {
			case AiDifficulty.Normal:
				divider = 2;
				break;
			case AiDifficulty.Hard:
				divider = scores.length > 2
					? (scores.length + 1) / 2
					: 1;
				break;
			case AiDifficulty.Impossible:
				divider = scores.length + 1;
				break;
		}

		let scoreSubset =
			scores
				.slice(0, Math.floor((scores.length) / divider) + 1);
		let move: Space = scoreSubset[Math.floor(Math.random() * scoreSubset.length)].space;


		setTimeout(() => this._turnService.send(new Turn(this, move)), 0);
	}

	private alphaBeta(game: Game, depth: number, currentPlayer: Player, currentSpace: Space, alpha: number, beta: number): number {
		currentSpace.claimedBy = currentPlayer;
		let bestScore: number;
		let score: number;
		let nextPlayer =
			game.players
				.find(player => player !== currentPlayer);
		let availableSpaces =
			game.grid
				.map(row => row
					.filter(space => !space.claimedBy))
				.reduce((acc, row) => acc.concat(row), []);
		let winner = game.winner;
		if (winner) {
			score = winner.player === this
				? 10
				: -10;
		} else if (game.isDraw) {
			score = 0;
		} else {
			score = nextPlayer === this
				? Number.NEGATIVE_INFINITY
				: Number.POSITIVE_INFINITY;
			for (var i = 0; i < availableSpaces.length; i++) {
				if (nextPlayer === this) {
					score = Math.max(score, this.alphaBeta(game, depth - 1, nextPlayer, availableSpaces[i], alpha, beta));
					alpha = Math.max(alpha, score);
				} else {
					score = Math.min(score, this.alphaBeta(game, depth - 1, nextPlayer, availableSpaces[i], alpha, beta));
					beta = Math.min(beta, score);
				}

				if (beta <= alpha) {
					break;
				}
			}
		}

		currentSpace.claimedBy = undefined;
		return score;
	}
}