import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, AlertController } from '@ionic/angular';
import { Upload_content } from '../models/usuario';
import { VisualSeriesComponent } from '../components/visual-series/visual-series.component';
import { DbaService } from '../services/dba.service';
import { DataColectorComponent } from '../components/data-colector/data-colector.component';
import * as firebase from 'firebase';



@Component({
  selector: 'app-series',
  templateUrl: './series.page.html',
  styleUrls: ['./series.page.scss'],
})
export class SeriesPage implements OnInit {

  series = [];
  slideOpts = {}
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
    this.slideOpts = {
      slidesPerView:'auto',
      grabCursor:true,
      effect:'coverflow',
      centeredSlides:true,
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true
      },
      on: {
        beforeInit() {
          const swiper = this;
    
          swiper.classNames.push(`${swiper.params.containerModifierClass}coverflow`);
          swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
    
          swiper.params.watchSlidesProgress = true;
          swiper.originalParams.watchSlidesProgress = true;
        },
        setTranslate() {
          const swiper = this;
          const {
            width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid, $
          } = swiper;
          const params = swiper.params.coverflowEffect;
          const isHorizontal = swiper.isHorizontal();
          const transform$$1 = swiper.translate;
          const center = isHorizontal ? -transform$$1 + (swiperWidth / 2) : -transform$$1 + (swiperHeight / 2);
          const rotate = isHorizontal ? params.rotate : -params.rotate;
          const translate = params.depth;
          // Each slide offset from center
          for (let i = 0, length = slides.length; i < length; i += 1) {
            const $slideEl = slides.eq(i);
            const slideSize = slidesSizesGrid[i];
            const slideOffset = $slideEl[0].swiperSlideOffset;
            const offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;
    
             let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
            let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
            // var rotateZ = 0
            let translateZ = -translate * Math.abs(offsetMultiplier);
    
             let translateY = isHorizontal ? 0 : params.stretch * (offsetMultiplier);
            let translateX = isHorizontal ? params.stretch * (offsetMultiplier) : 0;
    
             // Fix for ultra small values
            if (Math.abs(translateX) < 0.001) translateX = 0;
            if (Math.abs(translateY) < 0.001) translateY = 0;
            if (Math.abs(translateZ) < 0.001) translateZ = 0;
            if (Math.abs(rotateY) < 0.001) rotateY = 0;
            if (Math.abs(rotateX) < 0.001) rotateX = 0;
    
             const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
             $slideEl.transform(slideTransform);
            $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
            if (params.slideShadows) {
              // Set shadows
              let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
              let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
              if ($shadowBeforeEl.length === 0) {
                $shadowBeforeEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
                $slideEl.append($shadowBeforeEl);
              }
              if ($shadowAfterEl.length === 0) {
                $shadowAfterEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
                $slideEl.append($shadowAfterEl);
              }
              if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
              if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
            }
          }
    
           // Set correct perspective for IE10
          if (swiper.support.pointerEvents || swiper.support.prefixedPointerEvents) {
            const ws = $wrapperEl[0].style;
            ws.perspectiveOrigin = `${center}px 50%`;
          }
        },
        setTransition(duration) {
          const swiper = this;
          swiper.slides
            .transition(duration)
            .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
            .transition(duration);
        }
      }
    }
  }
  async add_post (){
    let modal = await this.modal.create({
      component:VisualSeriesComponent
    });
    modal.present();
  }
  async push_funtions(event){
    
    let modal = await this.modal.create({
      animated:true,
      mode:'ios',
      component:DataColectorComponent
    });
    modal.present();
    await modal.onDidDismiss().then((upload_element)=>{
      if(upload_element.data.return){
        if(this.platform.is('cordova')){
          this.dba.add_imageToStorage('series',upload_element.data.return)
          .then((res)=>{
            firebase.analytics().logEvent('serie_up',{
              titulo:upload_element.data.return.titulo,
              status:res
            })
          })
        }
        else {
          this.dba.upload_web_content('series',upload_element.data.return)
          .then((res)=>{
            firebase.analytics().logEvent('serie_up',{
              titulo:upload_element.data.return.titulo,
              status:res
            })
          })
        }
      }
    })
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
