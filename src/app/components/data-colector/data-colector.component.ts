import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController, Platform, ModalController } from '@ionic/angular';
import { Upload_content } from '../../models/usuario';
import { DbaService } from '../../services/dba.service';

@Component({
  selector: 'app-data-colector',
  templateUrl: './data-colector.component.html',
  styleUrls: ['./data-colector.component.scss'],
})
export class DataColectorComponent implements OnInit {
  imagen:string;
  upload = {} as Upload_content;
  file;
  constructor(private camera:Camera,
    private alert:AlertController,
    private platform:Platform,
    private modal:ModalController,
    private dba:DbaService) { }

  ngOnInit() {}

  async add_imagen(){

    if(this.platform.is('cordova')){
      this.upload.name = new Date().valueOf().toString(); 
      let options: CameraOptions = {
        quality: 100,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        targetHeight: 600,
        targetWidth: 600,
        allowEdit: true,
      }
      this.camera.getPicture(options).then(base64Image=>{
        this.imagen = `data:image/jpeg;base64,${base64Image}`
        this.upload.url = base64Image;
      })
    }
    else{
      this.set_alert('Para usar','Todas las funciones','Instalar el app en el mobile');
    }
  }
  async set_alert(header,subHeader,message){
    let alert = await this.alert.create({
      header,
      subHeader,
      message,
      animated:true,
      buttons:['Confirmar']
    });
    alert.present();
  }
  push_content(data){
    this.upload.description = data;
    console.log(this.upload);
    if (this.platform.is('cordova')){
      this.dba.add_imageToStorage(this.upload).then((response)=>{
        console.log(response);
        if(response == true){
          this.close();
        }
      })
    }
    else {
      this.dba.upload_web_content('imagenes', this.upload).then((res)=>{
        console.log(res);
        if(res == true){
          this.close();
        }
      })
    }
    
    
  }
  changeListener(event){

    this.upload["archivos"] = event.target.files;
    this.upload.name = new Date().valueOf().toString(); 
    
  }
  close(){
    this.modal.dismiss();
  }
}
