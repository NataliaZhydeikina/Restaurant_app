import { Component, ElementRef, Provider } from '@angular/core';
import { OnInit, ViewChild, OnChanges, AfterViewInit, NgZone } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import { Router } from '@angular/router';
import { NoOpMapsAPILoader, MouseEvent } from 'angular2-google-maps/core';
import { MapService } from '../../../services/map/map.service';
declare var InfoBubble: any;
declare var RichMarker: any;
declare let google: any;
import { DatabaseService } from '../../../services/database/database.service';
import { LoaderService } from '../../../services/loader/loader.service';
//declare let RichMarkerPosition: any;
@Component({
  providers: [MapService],
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {
  //me location
  public searchControl: FormControl = new FormControl();
  public zoom: number = 12;
  private markers: any = [];
  private infoBubble_marks = [];
  @ViewChild("search")
  public searchElementRef: ElementRef;
  public map: any;
  public marker: any;
  public callback: any;
  public filteredLocationArray: any = [];
  public filteredData: any = [];
  //public latitude: number;//  = 49.834824499999996;
  //public longitude: number;// = 24.019443199999998;
  public Latlng: any;

  constructor(private ls: LoaderService, private ds: DatabaseService, private mapsAPILoader: MapsAPILoader, private zone: NgZone, private ms: MapService, private router: Router) {
    this.ds.onMain = false;
    this.ls.status = true;
    this.filteredLocationArray = this.ds.getItems();
    this.filteredData = this.ds.filteredData;
    let inizializePromise = new Promise((fulfilled, reject) => {
      fulfilled();
      //  console.log("first");
      // setTimeout(() => {
      //   if (ms.longitude && ms.longitude) {
      //     fulfilled();
      //   } else {
      //     reject();
      //   }
      // }, 5000);
    });
    inizializePromise.then(() => {
      //set current position in Latlng variable
      //create Map
      this.Latlng = new google.maps.LatLng(this.ds.lat || ms.latitude, this.ds.lng || ms.longitude);
      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: this.zoom,
        center: this.Latlng,
      });

      //create anouther Markers
      if (this.filteredLocationArray.length != 0) {
        if (!this.ds.forNav) {
          let fla = this.filteredLocationArray;
          let fd = this.filteredData;
          let locationArr = [];
          for (let i = 0; i < fla.length; i++) {
            for (let j = 0; j < fd.length; j++) {
              if (fla[i].uid == fd[j].index) {
                locationArr.push({ location: fd[j].location, marker: fd[j].marker });
              }
            }
          }

          for (let i = 0; i < fla.length; i++) {
            let src = locationArr[i].marker || 'https://firebasestorage.googleapis.com/v0/b/sep-angular2.appspot.com/o/images%2Fmarkers%2Fmarker-icons%2Fbig%2Fgreenleaf-logo-big.png?alt=media&token=10f8ada9-311d-4c8f-9ee5-974bbe4a2613';
            let position = new google.maps.LatLng((locationArr[i].location.lat), (locationArr[i].location.lng));
            let reatourant_marker = new RichMarker({
              position: position,
              map: this.map,
              flat: true,
              visible: true,
              draggable: false,
              content: `<div class="restourant-marker-wrapper">
                   <div class="restourant-marker-circle">
                     <img class="restourant-marker-icon" src="`+ src + `"/>
                   </div>
                   <div class="restourant-marker-triangle"></div>
                   <div class="price-container">
                     <span>`+ fla[i].price + `</span>
                   </div>
                 </div>`
            });
            let infoBubble_mark = new InfoBubble({
              map: this.map,
              content: ` <div id="wrapper">
                        <div class="restourant-marker-circle">
                          <img class="restourant-marker-icon" src="`+ src + `"/>
                        </div>
                        <div class="dish-name">`+ fla[i].name + `</div>
                        <div class="raiting-reviews-wrapper">
                            <div class="bubble-star-rating">
                              <span style="width:`+ fla[i].rating * 20 + `%"></span>
                            </div>
                            <div class="review">`+ fla[i].reviews.length + ` Reviews</div>
                        </div>
                        <div class="plase-adress">`+ fla[i].place + `</div>
                        <div class="price">
                          `+ fla[i].price + `
                        </div>
                        <div class="distance">`+ fla[i].distance + `</div>

                      </div>`,
              position: position,
              minWidth: 260,
              shadowStyle: 0,
              padding: 0,
              backgroundColor: 'rgb(255,255,255)',
              borderRadius: 4,
              arrowSize: 30,
              borderWidth: 1,
              borderColor: '#e8532a',
              disableAutoPan: true,
              hideCloseButton: false,
              arrowPosition: 50,
              backgroundClassName: '',
              closeSrc: 'https://firebasestorage.googleapis.com/v0/b/sep-angular2.appspot.com/o/images%2Fstars%2Fclose.png?alt=media&token=f7cde478-7645-4df4-8020-5d5733b1b161',
              arrowStyle: 0
            });
            google.maps.event.addListener(reatourant_marker, 'click', () => {
              console.log('some');
              infoBubble_mark.open(this.map, reatourant_marker);
            });
            google.maps.event.addDomListener(infoBubble_mark.content_, 'click', () => {
              console.log(infoBubble_mark.content_.div, infoBubble_mark.content_)
              this.routToItemPage(fla[i]);
            });
            this.markers.push(reatourant_marker);
            this.infoBubble_marks.push(infoBubble_mark);
            //create Marker ME
            this.ls.status = false;
          }
          this.marker = new RichMarker({
            position: this.Latlng,
            map: this.map,
            flat: true,
            visible: true,
            draggable: false,
            content: `<div class="my-marker-wrapper">
                            <div class="my-marker-circle">
                              <span class="my-marker-text">ME</span>
                            </div>
                            <div class="my-marker-triangle"></div>
                          </div>`
          });
        } else {
          this.loadMap();
        }
      } else {
        this.ls.status = false;
      }
    }, () => {
      console.log("err"); // Ошибка: "Сломалось"
    });
    //var count = 1;
    //google.maps.event.addListener(this.marker, 'click', function() {
    //  console.log('Marker clicked: ' + count++);});
    /*let count = 0;
    google.maps.event.addListener(this.marker, 'click', function() {
      console.log('Marker clicked: ' + count++);
    });*/
  }
  routToItemPage(item) {
    this.ds.itemForItemPage = item;
    this.router.navigateByUrl('/item');
  }

  ngOnInit() {
    //create search FormControl
    //this.searchControl = new FormControl();
  }
  /**
  method setCurrentPosition set fields latitude & longitude.
  interface of getCurrentPosition : navigator.geolocation.getCurrentPosition(success, error, options);
  there is timeout in options, this is max time to set geolocation.
  Because of that field  we have this code in promise, where we inizialize Map
  setTimeout(()=>{
    if (this.longitude && this.longitude) {
      fulfilled();
    } else {
      reject();
    }
  }, 5000);
  */

  //clickedMarker, mapClicked,markerDragEnd: old methods, which we mey need in future
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }

  markerDragEnd(m: any, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  restLatLng: any;
  loadMap() {
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer(
      { suppressMarkers: true }
    );
    let itemLoc = this.ds.itemLoc;
    directionsDisplay.setMap(this.map);
    this.restLatLng = new google.maps.LatLng(itemLoc.lat, itemLoc.lng);
    this.addMarker(itemLoc);
    this.calculateAndDisplayRoute(directionsService, directionsDisplay);
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: this.Latlng,
      destination: this.restLatLng,
      travelMode: google.maps.TravelMode.TRANSIT
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  addMarker(latLng) {
    this.marker = new RichMarker({
      position: this.Latlng,
      map: this.map,
      flat: true,
      visible: true,
      draggable: false,
      content: `<div class="my-marker-wrapper">
                            <div class="my-marker-circle">
                              <span class="my-marker-text">ME</span>
                            </div>
                            <div class="my-marker-triangle"></div>
                          </div>`
    });
    let item = this.ds.itemForMap;
    let src = item.marker || 'https://firebasestorage.googleapis.com/v0/b/sep-angular2.appspot.com/o/images%2Fmarkers%2Fmarker-icons%2Fbig%2Fgreenleaf-logo-big.png?alt=media&token=10f8ada9-311d-4c8f-9ee5-974bbe4a2613';
    let position = new google.maps.LatLng((item.location.lat), (item.location.lng));
    let reatourant_marker = new RichMarker({
      position: position,
      map: this.map,
      flat: true,
      visible: true,
      draggable: false,
      content: `<div class="restourant-marker-wrapper">
                   <div class="restourant-marker-circle">
                     <img class="restourant-marker-icon" src="`+ src + `"/>
                   </div>
                   <div class="restourant-marker-triangle"></div>
                   <div class="price-container">
                     <span>`+ item.price + `</span>
                   </div>
                 </div>`
    });
    let infoBubble_mark = new InfoBubble({
      map: this.map,
      content: ` <div id="wrapper">
                        <div class="restourant-marker-circle">
                          <img class="restourant-marker-icon" src="`+ src + `"/>
                        </div>
                        <div class="dish-name">`+ item.name + `</div>
                        <div class="raiting-reviews-wrapper">
                            <div class="bubble-star-rating">
                              <span style="width:`+ item.rating * 20 + `%"></span>
                            </div>
                            <div class="review">`+ item.reviews.length + ` Reviews</div>
                        </div>
                        <div class="plase-adress">`+ item.place + `</div>
                        <div class="price">
                          `+ item.price + `
                        </div>
                        <div class="distance">`+ item.distance + `</div>

                      </div>`,
      position: position,
      minWidth: 260,
      shadowStyle: 0,
      padding: 0,
      backgroundColor: 'rgb(255,255,255)',
      borderRadius: 4,
      arrowSize: 30,
      borderWidth: 1,
      borderColor: '#e8532a',
      disableAutoPan: true,
      hideCloseButton: false,
      arrowPosition: 50,
      backgroundClassName: '',
      closeSrc: 'https://firebasestorage.googleapis.com/v0/b/sep-angular2.appspot.com/o/images%2Fstars%2Fclose.png?alt=media&token=f7cde478-7645-4df4-8020-5d5733b1b161',
      arrowStyle: 0
    });
    google.maps.event.addListener(reatourant_marker, 'click', () => {
      console.log('some');
      infoBubble_mark.open(this.map, reatourant_marker);
    });
    google.maps.event.addDomListener(infoBubble_mark.content_, 'click', () => {
      console.log(infoBubble_mark.content_.div, infoBubble_mark.content_)
      this.routToItemPage(item);
    });
    this.ds.forNav = false;
    this.ls.status = false;
  }
}
