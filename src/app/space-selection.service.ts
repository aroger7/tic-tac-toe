import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { Space } from './space';

@Injectable()
export class SpaceSelectionService extends MessageService<Space>{
}
