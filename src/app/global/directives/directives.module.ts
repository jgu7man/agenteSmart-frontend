import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { lowecaseDirective } from 'gdev-text/directives/lowercase.directive';
import { NormalizeDirective } from 'gdev-text/directives/normalize.directive';
import { ResponsiveDirective } from '../../Gdev-Tools/gdev-responsive/directives/responsive.directive';
import { StretchHeightDirective } from '../../Gdev-Tools/gdev-responsive/directives/stretchHeight.directive';



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
