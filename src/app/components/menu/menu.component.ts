import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  menu = [
    {url:'home',name:'Principal',icon:'home'}
  ]
  constructor() { }

  ngOnInit() {}

}
