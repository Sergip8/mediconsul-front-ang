import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PublicRoutingModule } from './public-routing.module';

import { HomeComponent } from './views/home/home.component';
import { PublicComponent } from './public.component';
import { PublicHeaderComponent } from './layouts/header/header.component';
import { PublicFooterComponent } from './layouts/footer/footer.component';
import { CardComponent } from '../shared/components/card/card.component';
import { AuthModule } from './views/auth/auth.module';
import { SelectComponent } from '../shared/components/select/select-check';




@NgModule({
  declarations: [PublicComponent, HomeComponent],
  imports: [
    CommonModule,
    PublicRoutingModule,
    PublicHeaderComponent,
    PublicFooterComponent,
    RouterOutlet,
    CardComponent,
    AuthModule,
    SelectComponent
  ]

})
export class PublicModule {}
