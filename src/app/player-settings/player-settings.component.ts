import { Component, OnInit, Input } from '@angular/core';
import { PlayerTemplate } from '../player-template';
import { Marker } from '../marker.enum';
import { AiDifficulty } from '../ai-difficulty.enum';

@Component({
	selector: 'app-player-settings',
	templateUrl: './player-settings.component.html',
	styleUrls: ['./player-settings.component.scss']
})
export class PlayerSettingsComponent implements OnInit {
	@Input('player')
	public player: PlayerTemplate;
	@Input('group-var')
	public groupVar: string = "";
	public Marker = Marker;
	public AiDifficulty = AiDifficulty;

	private _lastName: string = "";
	private _isNameEditable: boolean = false;

	public get isNameEditable(): boolean {
		return this._isNameEditable;
	}

	public set isNameEditable(value: boolean) {
		if (value) {
			this._lastName = this.player.name;
		}

		this._isNameEditable = value;
	}

	public confirmNameEdit(): void {
		if(this.player.name) {
			this._isNameEditable = false;
		}
	}

	public cancelNameEdit(): void {
		this.player.name = this._lastName;
		this._lastName = "";
		this.isNameEditable = false;
	}

	ngOnInit() {
	}
}
