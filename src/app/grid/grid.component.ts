import { Component, OnInit, Input, ElementRef, ViewChildren } from '@angular/core';
import { Marker } from '../marker.enum';
import { Game } from '../game';
import { GameState } from '../game-state.enum';
import { GameService } from '../game.service';
import { Space } from '../space';
import { SpaceSelectionService } from '../space-selection.service';
import { Subscription } from 'rxjs';
import { Winner } from '../winner';

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
	constructor(private _gameService: GameService,
		private _spaceSelectionService: SpaceSelectionService) { }

	public Marker = Marker;
	public grid: Marker[][];
	public canDrawWinningLine: boolean = false;
	public winningLineCoordinates: number[][] = [];
	public winningLineLength: number = undefined;
	private _gameStream: Subscription;
	private _queuedSelections: Space[] = [];
	private _canDrawMarkers: boolean = true;

	public get winner(): Winner {
		return this._gameService.getWinner();
	}

	public get isWinner(): boolean {
		return Boolean(this._gameService.getWinner());
	}

	public get canDrawMarkers(): boolean {
		return this._canDrawMarkers;
	}

	@Input('can-draw-markers')
	public set canDrawMarkers(canDraw: boolean) {
		if (canDraw) {
			this.clearQueuedSelections();
		}

		this._canDrawMarkers = canDraw;
	}

	ngOnInit() {
		this.clearGrid();
		this._gameStream =
			this._gameService
				.updates()
				.subscribe(game => this.processUpdate(game));
	}

	private clearQueuedSelections(): void {
		this._queuedSelections
			.forEach(space => {
				if (this.grid[space.row][space.column] === Marker.None) {
					this.grid[space.row][space.column] = space.claimedBy
						? space.claimedBy.marker
						: Marker.None;
				}
			});
		console.log('grid has cleared ' + this._queuedSelections.length + ' queued selections');
		this._queuedSelections = [];
	}

	private clearGrid(): void {
		this.grid = [
			[
				Marker.None,
				Marker.None,
				Marker.None
			],
			[
				Marker.None,
				Marker.None,
				Marker.None
			],
			[
				Marker.None,
				Marker.None,
				Marker.None
			],
		];
	}

	private trackMarker(index: number, value: number) {
		return index;
	}

	private updateGrid(game: Game) {
		game.grid
			.forEach((row) => row
				.forEach((space) => {
					let newMarker = Marker.None;
					if (space.claimedBy) {
						newMarker = space.claimedBy.marker;
					}

					if (this.grid[space.row][space.column] !== newMarker) {
						if (this.canDrawMarkers) {
							console.log('drawing marker '
								+ Marker[newMarker]
								+ ' at space '
								+ space.row
								+ ','
								+ space.column);

							this.grid[space.row][space.column] = newMarker;
						} else {
							console.log('selection of '
								+ Marker[newMarker]
								+ ' at space '
								+ space.row
								+ ','
								+ space.column
								+ ' is being queued');
							this._queuedSelections.push(space);
						}
					}
				})
			);
	}

	private setWinningLine(winner: Winner): void {
		let x1, x2, y1, y2: number;
		let isRow: boolean =
			winner
				.spaces
				.every(space => space.row === winner.spaces[0].row);
		let isColumn: boolean =
			winner
				.spaces
				.every(space => space.column === winner.spaces[0].column);
		if (isRow) {
			let row = winner.spaces[0].row;
			x1 = 0;
			y1 = (row * 104) + 50;
			x2 = 308;
			y2 = (row * 104) + 50;
		} else if (isColumn) {
			let column = winner.spaces[0].column;
			x1 = (column * 104) + 50;
			y1 = 0;
			x2 = (column * 104) + 50;
			y2 = 308;
		} else if (winner.spaces.some(space => space.row === 0 && space.column === 0)) {
			x1 = 0;
			y1 = 0;
			x2 = 308;
			y2 = 308;
		} else {
			x1 = 0;
			y1 = 308;
			x2 = 308;
			y2 = 0;
		}

		this.winningLineCoordinates = [[x1, y1], [x2, y2]];
		this.winningLineLength = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
	}

	private processUpdate(game: Game): void {
		if (game.state === GameState.NotStarted) {
			this.clearGrid();
			this._queuedSelections = [];
			this.canDrawWinningLine = false;
		} else if (game.state === GameState.Complete) {
			this.updateGrid(game);
			let winner: Winner = game.winner;
			if (winner && winner.spaces.length === 3) {
				this.setWinningLine(winner);
			}
		} else {
			this.canDrawWinningLine = false;
			this.updateGrid(game);
		}
	}

	onSpaceClick(row: number, column: number) {
		let space: Space = this._gameService.grid[row][column];
		if (space) {
			this._spaceSelectionService.send(space);
		}
	}

	private onDrawEnd(e: Event) {
		if (this._gameService.state !== GameState.Complete) {
			this._gameService.nextTurn();
		} else {
			this.canDrawWinningLine = true;
		}
	}
}


