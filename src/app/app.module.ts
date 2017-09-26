import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';

import { GameService } from './game.service';
import { GameUpdateService } from './game-update.service';
import { TurnService } from './turn.service';
import { PlayerFactoryService } from './player-factory.service';
import { SpaceSelectionService } from './space-selection.service';
import { GameComponent } from './game/game.component';
import { SettingsComponent } from './settings/settings.component';
import { PlayerSettingsComponent } from './player-settings/player-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    GameComponent,
    SettingsComponent,
    PlayerSettingsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    GameService,
    GameUpdateService,
    TurnService,
    PlayerFactoryService,
    SpaceSelectionService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
