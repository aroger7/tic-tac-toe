import { Injectable } from '@angular/core';
import { TurnService } from './turn.service';
import { SpaceSelectionService } from './space-selection.service';
import { Player } from './player';
import { AiPlayer } from './ai-player';
import { HumanPlayer } from './human-player';
import { Marker } from './marker.enum';
import { AiDifficulty } from './ai-difficulty.enum';
import { PlayerTemplate } from './player-template';

@Injectable()
export class PlayerFactoryService {

	constructor(private _turnService: TurnService,
		private _spaceSelectionService: SpaceSelectionService) { }

	public getPlayer(template: PlayerTemplate): Player {
		if (template.isHumanPlayer) {
			return new HumanPlayer(this._turnService, this._spaceSelectionService, template.name, template.marker);
		} else {
			return new AiPlayer(this._turnService, template.name, template.marker, template.difficulty);
		}
	}
}
