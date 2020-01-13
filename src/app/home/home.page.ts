import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, ModalController } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { DbaService } from '../services/dba.service';
import { map } from 'rxjs/operators';
import { DataColectorComponent } from '../components/data-colector/data-colector.component';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  current_song;
  toolbar = [
    {
      title:'TESIS',
      icon:'assets/img/pawprint.svg',
      value:0,
      content:{
        overall:`
        La tesis consistio en un servicio centralizado donde no solo da la experiencia de una red social de mascotas,
         tambien brinda la posibilidad que las diferentes entidades animalista puedan
        puedan publicitar sus servicios y fidelizar sus clientes a traves de notificaciones en tiempo real
        `
      }
    },
    {
      title:'MUSIC',
      icon:'assets/img/play_button.svg',
      value:1,
      content:{
        overall:`Rock | Metal | Relax`,
        list:[]
      }
    },
    {
      title:'GAMES',
      icon:'assets/img/ps.svg',
      value:2,
      content: {
        overall: `ps4, ps vita, ps1, Xbox, Xbox 360 games`,
        list:[]
      }
    }
  ];

  status = 1;
  play:any;
  constructor(private camera:Camera,
    private dba:DbaService,
    private platform:Platform,
    private modal:ModalController ) {}

  ngOnInit() {
    this.dba.get_content('music').subscribe((songs)=>{
      let canciones:any = songs;
      this.toolbar[1].content.list = canciones;
    });
    this.dba.get_content('imagenes').subscribe((imgs)=>{
      this.toolbar[2].content.list = imgs;
    });
  }

  change_content(value){
    this.status = value;
  }
  change_song(song){
    if (!this.play){
      this.play= document.getElementById('reproductor');
    }
    this.current_song = song;
    try {
      this.play.play();
    }
    catch(err) {
      console.log(err);
    }
  }
  changeListener(event) : void {
    
    if (event.target.files.length > 0){
      this.dba.upload_content(event.target.files,'music');
    }
  }
  // este metodono solo añade una imagen sino tambien una descripción
  async add_image(){
    firebase.analytics().logEvent("my_event",{param1: "Android"});
    firebase.analytics().logEvent('select_content', {
      content_type: 'image',
      content_id: 'P12453',
      items: [{ name: 'Kittens' }]
    });
    
    if(this.platform.is('cordova')){
      firebase.analytics().logEvent('my_event', {param1: "value1"});
    }
    let modal = await this.modal.create({
      component:DataColectorComponent,
      animated:true,
      mode:"ios"
    });
    modal.present();

    
    
  }
}