import { Component, OnInit } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { DbaService } from '../services/dba.service';
import { map } from 'rxjs/operators';
import { StreamingMedia, StreamingAudioOptions } from '@ionic-native/streaming-media/ngx';
import { DataColectorComponent } from '../components/data-colector/data-colector.component';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  current_song = 0;
  isplay = false;
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
  subscrito = false; // identifica si ya esta subscrito al observable pendiente si la canción se acaba
  constructor(private dba:DbaService,
    private platform:Platform,
    private modal:ModalController,
    private stream:StreamingMedia ) {}

  ngOnInit() {
    this.dba.get_content('music').subscribe((songs)=>{
      let canciones:any = songs;
      this.toolbar[1].content.list = canciones;
    });
    this.dba.get_content('imagenes').subscribe((imgs)=>{
      this.toolbar[2].content.list = imgs;
    });
  }
  music_status():Observable<any>{
    const music_observable = new Observable(observer=>{
      setInterval(()=>{
        observer.next(this.play.ended);
      },5000);
    });
    return music_observable;
  }
  change_content(value){
    this.status = value;
  }
  change_song(song, index:number){
    this.start_music();
    // se almacena el indice de la actual canción
    this.current_song = index;
    this.play.src = song;
    this.play.play();
  }
  start_music(){
    if (!this.play){
      this.play = document.getElementById('reproductor');
      this.subscrito = true;
      this.music_status().subscribe((res)=>{
        if(res == true){
          this.isplay = false;
          this.next_song();
        }
      })
    }
  }
  play_music(){
    this.start_music();
    if (this.isplay == true){
      this.play.pause();
    }
    else {
      this.play.play();
    }
    this.isplay = !this.isplay;
  }
  previous_song(){
    this.start_music(); 
    let previous = this.current_song > 0 ? this.current_song - 1 : 0;
    this.current_song = previous;
    this.play.src = this.toolbar[1].content.list[previous].url;
    this.play.play();
  }
  next_song(){
    this.start_music();
    // si el indice de que se lleva en los tracks es igual al tamaño de los tracks, el reproductor comenzara a reproducir de nuevo
    let next = this.toolbar[1].content.list.length-1 == this.current_song ? 0 : this.current_song + 1;
    this.current_song = next;
    this.play.src = this.toolbar[1].content.list[next].url;
    this.play.play();
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
      componentProps:{
        dba:'imagenes'
      },
      animated:true,
      mode:"ios"
    });
    modal.present();
    await modal.onDidDismiss().then((upload_element)=>{
      // el modal se encarga de crear el objeto a subie en Firebase
      console.log(upload_element.data.return);
      if(upload_element.data.return) {
        if(this.platform.is('cordova')){
          this.dba.add_imageToStorage('imagenes',upload_element.data.return)
          .then((response)=>{
            firebase.analytics().logEvent('game_up',{
              titulo:upload_element.data.return.titulo,
              status:response
            })
          })
        }
        else {
          this.dba.upload_web_content('imagenes',upload_element.data.return)
          .then((res)=>{
            firebase.analytics().logEvent('game_up',{
              titulo:upload_element.data.return.titulo,
              status:res
            })
          })
        }
      }
    })
    
    
  }
}