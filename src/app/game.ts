import { Player } from './player';
import { GameState } from './game-state.enum';
import { Space } from './space';
import { Winner } from './winner';

export class Game {
	public activePlayer: Player;
	public grid: Space[][] = [];
	public players: Player[] = [];
	public playerOne: Player;
	public playerTwo: Player;
	public state: GameState = GameState.NotStarted;

	public get isDraw(): boolean {
		return !this.winner
			&& this.grid
				.every(row => row
					.every(space => Boolean(space.claimedBy)));
	}

	public get winner(): Winner {
		return this._winnerEvaluator(this.grid);
	}

	constructor(private _winnerEvaluator: (grid: Space[][]) => Winner) {
	}
}
