import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Usuario, Upload_content } from '../models/usuario';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DbaService {

  user:firebase.User;
  constructor(private alert:AlertController,
    private toast:ToastController,
    private http:HttpClient,
    private firedba:AngularFireDatabase,
    private loading:LoadingController) { }


  login(usuario:Usuario):Promise<any>{
    return new Promise((resolve,reject)=>{
      firebase.auth().signInWithEmailAndPassword(usuario.email,usuario.password)
      .then((usuario:any)=>{
        console.log(usuario);
        let us:firebase.User = usuario.user;
        this.showAlert(`Welcome ${us.displayName}`,"success");
        resolve(true);     
      }).catch(err=>{
        this.showAlert(err.message,"danger");
        reject(false);
      })
    })
  }
  signIn(usuario:Usuario):Promise<any>{
    return new Promise((resolve,reject)=>{
      firebase.auth().createUserWithEmailAndPassword(usuario.email,usuario.password)
      .then((us)=>{
        this.user = us.user;
        this.user.updateProfile({
          displayName:usuario.name,
          photoURL:""
        }).then(()=>{
          this.showAlert(`Welcome ${this.user.displayName}`,'success');
          resolve(true);
        })
      }).catch(err=>{
        this.showAlert(`:( ${err.message}`,'danger');
        reject(false);
      })
    })
  }
  async showAlert(header, color){
    let toast = await this.toast.create({
      header,
      duration:3000,
      color
    });
    toast.present();
  }
  get_content(query){
    return this.firedba.list(query).snapshotChanges()
    .pipe(map(values=>{
      return values.map((element)=>{
        return element.payload.val();
      })
    }))
  }
  upload_content(files,path):Promise<any>{
    let urls = [];
    let firestorage = firebase.storage().ref();
    let fire_task:firebase.storage.UploadTask;
    return new Promise(()=>{
      let count = 1;
      for(let file of files){
        let dba_name = new Date().valueOf().toString();
        let file_name = file.name;
        fire_task = firestorage.child(`/${path}/${file_name}`)
        .put(file);
        fire_task.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (status)=>{
          },
          (err)=>{
            this.showAlert(':( Lo sentimos',"danger");
          },
          async ()=>{
            await firestorage.child(`/${path}/${file_name}`).getDownloadURL()
            .then(async(url)=>{
              
              let object = new Object();
              object["name"] = file_name;
              object["url"] = url
              urls.push(object);
              await this.firedba.object(`${path}/${dba_name}${count}`).update(object).then(()=>{
                count++;
                this.showAlert(`${file_name} arriba!`, 'success');
              }).catch(()=>{
                this.showAlert(`${file_name} down!`, "danger");
              })
            })
          })
      }
    })
  }
  upload_web_content(path, contenido):Promise<any>{
    console.log(contenido);
    // en contenido.archivo viene el contenido del la imagen que se va a cargar
    let content:Upload_content = {
      name:contenido.name,
      description:contenido.description,
      url:""
    }
    let formatos_validos = ["png","jpg", "gif", "jpeg"];
    return new Promise(async(resolve,reject)=>{
      let half = contenido.archivos[0].name.split(".");
      let extension = half[half.length-1].toLowerCase();
      console.log(extension);
      if(formatos_validos.indexOf(extension) < 0){
        let toast = await this.toast.create({
          header:'Formato no valido',
          color:'danger',
          duration:3000,
          mode:'ios',
          animated:true
        });
        toast.present();
        reject(false);
      }
      else {
        let ref = firebase.storage().ref();
        let uploadTask:firebase.storage.UploadTask = ref.child(`imagenes/${content.name}`)
        .put(contenido.archivos[0]);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          async(status)=>{
            console.log(status);
            let toast = await this.toast.create({
              header:`Cargando: ${(status.totalBytes / status.bytesTransferred)*100}`,
              animated:true,
              color:'primary',
              duration:1000
            });
            toast.present();
          },
          (err)=>{
            reject(err);
          },
          ()=>{
            ref.child(`imagenes/${content.name}`).getDownloadURL().then(async(url)=>{
              content.url = url;
              this.firedba.object(`${path}/${content.name}`).update(content).then(async()=>{
                let toast = await this.toast.create({
                  header:'Completed :)',
                  duration:2000,
                  color:'success',
                  animated:true,
                  mode:'ios'
                });
                toast.present();
                resolve(true);
              }).catch(async(err)=>{
                let toast = await this.toast.create({
                  header:`${err.message}`,
                  duration:2000,
                  animated:true,
                  color:'danger',
                  mode:'ios'
                });
                toast.present();
                reject(false);
              })
              
              
            })
          })
      }
    })
  }
  sent_notifications(cuerpo):Promise<any>{
    return new Promise((resolve)=>{
      this.http.post('https://us-central1-atomic-snow-220819.cloudfunctions.net/pushNotifications',cuerpo)
      .subscribe((response)=>{
        resolve(response);
      })
    })
  }
  add_imageToStorage(contenido:Upload_content):Promise<any> {
    
    return new Promise((resolve,reject)=>{
      
      let ref = firebase.storage().ref();
          let uploadTask:firebase.storage.UploadTask = ref.child(`imagenes/${contenido.name}`)
          .putString(contenido.url, 'base64',{contentType: 'image/jpeg'});
          console.log(uploadTask);
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            async(percentaje)=>{

              let porcentaje = (percentaje.totalBytes / percentaje.bytesTransferred) * 100;
              let load = await this.loading.create({
                message:`Completado ${porcentaje}`,
                animated:true,
                mode:'ios',
                duration:3000
              });
              load.present();    
                            
            },
            (err)=>{
              console.log(err);
              this.showAlert(`${err.message}`,'danger');
              reject(false);
            },()=>{
              ref.child(`imagenes/${contenido.name}`).getDownloadURL().then((url)=>{
                let picture = new Object();
                picture = {
                  name:contenido.name,
                  description:contenido.description,
                  url
                }
                this.firedba.object(`imagenes/${contenido.name}`).update(picture).then(()=>{
                  this.showAlert(`up!`, 'success');
                  resolve(true);
                }).catch(()=>{
                  this.showAlert(`down!`, 'danger');
                  reject(false);
                })
              })
            })  
    })
  }
}
