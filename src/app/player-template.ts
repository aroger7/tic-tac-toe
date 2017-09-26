import { Marker } from './marker.enum';
import { AiDifficulty } from './ai-difficulty.enum';

export class PlayerTemplate {
	public name: string = "";
	public marker: Marker = Marker.None;
	public isHumanPlayer: boolean = true;
	public difficulty: AiDifficulty = AiDifficulty.Normal;
	public difficulties: AiDifficulty[] = [
		AiDifficulty.Normal,
		AiDifficulty.Hard,
		AiDifficulty.Impossible
	];
	public markers: Marker[] = [
		Marker.Circle,
		Marker.Cross
	];

}
