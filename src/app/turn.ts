import { Player } from './player';
import { Space } from './space';

export class Turn {
	constructor(public sourcePlayer: Player, public space: Space) {
	}
}
