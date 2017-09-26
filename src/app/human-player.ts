import { Game } from './game';
import { Player } from './player';
import { Marker } from './marker.enum';
import { Turn } from './turn';
import { TurnService } from './turn.service';
import { Space } from './space';
import { SpaceSelectionService } from './space-selection.service';
import { Subscription } from 'rxjs';

export class HumanPlayer implements Player {
	private _spaceSelectionStream: Subscription;

	constructor(private _turnService: TurnService,
		private _spaceSelectionService: SpaceSelectionService,
		public name: string,
		public marker: Marker) {
	}

	public get isHumanPlayer(): boolean {
		return true;
	}

	public startTurn(game: Game): void {
		console.log(this.name + '\'s turn is starting')
		this._spaceSelectionStream =
			this._spaceSelectionService
				.get()
				.subscribe(space => this.processSpaceSelection(space));
	}

	private processSpaceSelection(space: Space) {
		if (!space.claimedBy) {
			this._turnService.send(new Turn(this, space));
			this._spaceSelectionStream.unsubscribe();
		}
	}
}
