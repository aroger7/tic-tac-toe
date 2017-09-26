import { Marker } from './marker.enum';
import { Game } from './game';

export interface Player {
	name: string;
	marker: Marker;
	isHumanPlayer: boolean;
	
	startTurn(game: Game);
}
