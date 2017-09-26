import { Player } from './player';

export class Space {
	public claimedBy: Player = null;
	public row: number;
	public column: number;
}
