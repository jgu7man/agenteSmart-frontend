import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { lowecaseDirective } from './lowercase.directive';
import { NormalizeDirective } from './normalize.directive';
import { ResponsiveDirective } from './responsive.directive';
import { StretchHeightDirective } from './stretchHeight.directive';



@NgModule({
  declarations: [
    lowecaseDirective,
    NormalizeDirective,
    ResponsiveDirective,
    StretchHeightDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    lowecaseDirective,
    NormalizeDirective,
    ResponsiveDirective,
    StretchHeightDirective,
  ]
})
export class DirectivesModule { }
