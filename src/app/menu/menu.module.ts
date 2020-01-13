import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    redirectTo:'/menu/login',
    pathMatch:'full'
  },
  {
    path: '',
    component: MenuPage,
    children: [
      {path:'home', loadChildren:'../home/home.module#HomePageModule'},
      {path:'login', loadChildren:'../login/login.module#LoginPageModule'},
      {path:'share-content', loadChildren:'../share-content/share-content.module#ShareContentPageModule'},
      {path:'series', loadChildren:'../series/series.module#SeriesPageModule'},
      {path: 'public-menu', loadChildren: '../public-menu/public-menu.module#PublicMenuPageModule' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
