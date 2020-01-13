import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { DbaService } from '../../services/dba.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {

  constructor(private modal:ModalController,
    private dba:DbaService,
    private toast:ToastController) { }

  ngOnInit() {}

  async signIn(name,email,password){
    let tick = true;
    let usuario:Usuario = {
      name,
      email,
      password
    }
    for(let item in usuario){
      if (item == undefined){
        tick = false;
      }
    }
    if (!tick){
      let toast = await this.toast.create({
        header:'Completar todos los campos',
        duration:3000,
        color:'danger',
        animated:true
      });
      toast.present();
    }
    else {
      this.dba.signIn(usuario).then((respuesta)=>{
        if (respuesta == true){
          this.modal.dismiss({
            'respuesta':true
          })
        }
      })
    }
  }
  close(){
    this.modal.dismiss();
  }

}
