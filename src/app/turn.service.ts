import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { Turn } from './turn';

@Injectable()
export class TurnService extends MessageService<Turn>{
}
