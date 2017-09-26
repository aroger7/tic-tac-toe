import { Injectable } from '@angular/core';
import { Game } from './game';
import { MessageService } from './message.service';

@Injectable()
export class GameUpdateService extends MessageService<Game>{
}
