import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameService } from '../game.service';
import { PlayerTemplate } from '../player-template';
import { Marker } from '../marker.enum';
import { AiDifficulty } from '../ai-difficulty.enum';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

	constructor(private _gameService: GameService) { }

	public Marker = Marker;
	public markers: Marker[] = [
		Marker.Circle,
		Marker.Cross
	];
	public AiDifficulty = AiDifficulty;
	private _playerTemplates: PlayerTemplate[] = [];
	private _isActive: boolean = false;

	@Output('settings-inactive')
	settingsInactive = new EventEmitter();

	public get isActive(): boolean {
		return this._isActive;
	}

	@Input('is-active')
	public set isActive(value: boolean) {
		if (value && !this._isActive) {
			this._playerTemplates = [];
			this._gameService
				.playerTemplates
				.forEach(template => {
					let editableTemplate = new PlayerTemplate();
					editableTemplate.name = template.name;
					editableTemplate.marker = template.marker;
					editableTemplate.isHumanPlayer = template.isHumanPlayer;
					editableTemplate.difficulty = template.difficulty;

					this._playerTemplates.push(editableTemplate);
				});
		}

		this._isActive = value;
	}

	public get arePlayersSameMarkers(): boolean {
		return this.players
			.every(player => player.marker === this.players[0].marker);
	}

	public get arePlayersSameName(): boolean {
		return this.players
			.every(player => player.name === this.players[0].name);
	}

	public get areAnyPlayerNamesEmpty(): boolean {
		return this.players
			.some(player => !Boolean(player.name));
	}

	public get players(): PlayerTemplate[] {
		return this._playerTemplates;
	}

	ngOnInit() {
	}

	public get canConfirm(): boolean {
		return !this.arePlayersSameMarkers
			&& !this.areAnyPlayerNamesEmpty
			&& !this.arePlayersSameName;
	}

	public confirm(): void {
		if (this.canConfirm) {
			this._playerTemplates
				.forEach((editableTemplate, index) => {
					let playerTemplate = this._gameService.playerTemplates[index];
					playerTemplate.name = editableTemplate.name;
					playerTemplate.marker = editableTemplate.marker;
					playerTemplate.isHumanPlayer = editableTemplate.isHumanPlayer;
					playerTemplate.difficulty = editableTemplate.difficulty;
				});

			this.settingsInactive.emit();
		}
	}

	public cancel() {
		this.settingsInactive.emit();
	}
}
