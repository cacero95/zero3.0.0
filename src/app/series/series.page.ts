import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, AlertController } from '@ionic/angular';
import { Upload_content } from '../models/usuario';
import { VisualSeriesComponent } from '../components/visual-series/visual-series.component';
import { DbaService } from '../services/dba.service';
import { DataColectorComponent } from '../components/data-colector/data-colector.component';



@Component({
  selector: 'app-series',
  templateUrl: './series.page.html',
  styleUrls: ['./series.page.scss'],
})
export class SeriesPage implements OnInit {

  series = [];
  constructor(private modal:ModalController,
    private platform:Platform,
    private alert:AlertController,
    private dba:DbaService) { }

  ngOnInit() {
    this.dba.get_content('series').subscribe((data)=>{
      this.series = data;
      console.log(this.series);
    })
    /**
     this.collection.getCollection().then((data:any)=>{
       this.series = data;
       console.log(this.series);
       for(let test of this.series){
         console.log(test.data());
       }
     })
     * 
     * 
     */
  }
  async add_post (){
    let modal = await this.modal.create({
      component:VisualSeriesComponent
    });
    modal.present();
  }
  async push_funtions(event){
    if (!this.platform.is('cordova')){
      if (event){
        let file = {} as Upload_content;
        file["archivos"] = event.target.files;
        file.name = new Date().valueOf().toString();
        let alert = await this.alert.create({
          header:'Agrega una Descripción',
          inputs:[
            {
              name:'description',
              type:'text',
              placeholder:'Descripción'
            }
          ],
          buttons:[
            {
              text:'Confirmar',
              handler:(value)=>{
                file.description = "";
                file.description = value.description
              }
            },
            {
              text:'Cancelar'
            }
          ]
        });
        alert.present();
        await alert.onDidDismiss().then(()=>{
          this.dba.upload_web_content('series',file).then((salida)=>{
          })
        })
      }
    }
    else {
      let modal = await this.modal.create({
        animated:true,
        mode:'ios',
        component:DataColectorComponent
      });
      modal.present();
    }
    /**
     let test:Upload_content = {
       name:"2019 diciembre 10",
       description:"this is a test for firebase functions",
       url:"https://www.pushwoosh.com/blog/content/images/2019/03/regular_push_notification_flow-1.png"
     }
     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type':  'application/json',
         'Authorization': 'secret-key'
       })
      };
     console.log(test);
     this.http.post('https://us-central1-atomic-snow-220819.cloudfunctions.net/updateDataDba',test,httpOptions).subscribe((data)=>{
       console.log(data);
     },(err)=>{
       console.log(err);
     })
     * 
     */
  }
}
