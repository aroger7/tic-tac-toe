import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AnimationEvent } from '@angular/animations';
import { Marker } from '../marker.enum';
import { Game } from '../game';
import { GameService } from '../game.service';
import { GameState } from '../game-state.enum';
import { Space } from '../space';
import { Subscription } from 'rxjs';
import { Player } from '../player';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
	constructor(private _gameService: GameService) { }

	public isSettingsMenuActive: boolean = false;
	public isMessageVisible: boolean = true;
	public canGridDrawMarkers: boolean = false;
	public message: string = 'Let\'s play a game!';
	public nextMessage: string = '';
	private _gameStream: Subscription;
	private _lastActivePlayer: Player;

	public get isGameInProgress(): boolean {
		return this._gameService.activePlayer && this._gameService.state !== GameState.Complete;
	}

	public get isGameComplete(): boolean {
		return this._gameService.state === GameState.Complete;
	}

	ngOnInit() {
		this._gameService
			.updates()
			.subscribe(game => this.processUpdate(game));
	}

	public start(): void {
		this._lastActivePlayer = undefined;
		this.message = '';
		this._gameService.startGame();
	}

	public onMessageVisibilityChanged(e: TransitionEvent) {
		if (!this.isMessageVisible) {
			this.message = this.nextMessage;
			this.isMessageVisible = true;
		} else {
			setTimeout(() => {
				this.canGridDrawMarkers = true;
				console.log('grid can now draw markers');
			}, 200);
		}
	}

	private processUpdate(game: Game): void {
		let nextMessage: string;
		if (game.state === GameState.WaitingForTurn || game.state === GameState.ProcessingTurn) {
			nextMessage = game.activePlayer.isHumanPlayer
				? 'Go ' + game.activePlayer.name + '!'
				: game.activePlayer.name + ' is thinking...';
			this._lastActivePlayer = game.activePlayer;
		} else if (game.state === GameState.Complete) {
			this.canGridDrawMarkers = true;
			if (game.winner) {
				nextMessage = game.activePlayer.name + ' wins!';
			} else {
				nextMessage = 'Draw!';
			}
		} else {
			nextMessage = '';
		}

		if (nextMessage !== undefined && this.message.localeCompare(nextMessage) !== 0) {
			if (game.state !== GameState.Complete) {
				this.canGridDrawMarkers = false;
				console.log('grid can no longer draw markers');
			}
			this.nextMessage = nextMessage;
			this.isMessageVisible = false;
		}
	}
}