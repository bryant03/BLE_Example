import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { AlertController } from 'ionic-angular';

const UUID = "FFF0";
const characteristic_UUID_TX="FFF6";
const characteristic_UUID_RX="FFF7";

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  peripheral: any = {};
  statusMessage: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private ble: BLE,
              private toastCtrl: ToastController,
              private ngZone: NgZone,
              private alert: AlertController ) {

    let device = navParams.get('device');

    this.setStatus('Connecting to ' + device.name || device.id);
    console.log(this.ble.connect(device.id));
    this.ble.connect(device.id).subscribe(
      peripheral => this.onConnected(peripheral,device.id),
      peripheral => this.onDeviceDisconnected(peripheral)
    );
    // this.showAlert(this.peripheral);

  }

  onConnected(peripheral,id) {
    this.ngZone.run(() => {
      this.setStatus('');
      this.peripheral = peripheral;
    });
    console.log("peripheral.characteristics "+peripheral.characteristics);
    console.log("deviceId "+peripheral.id);
    let send_data= new Uint8Array([0x43,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x43]);
    
    this.ble.startNotification(peripheral.id, UUID, characteristic_UUID_RX).subscribe(
      buffer => {
        var data = new Uint8Array(buffer);
        console.log('Received Notification: Power Switch = ' + data);
      }
    );


    this.ble.write(peripheral.id,'fff0','fff6',send_data.buffer).then(
      result =>{
        console.log(result+"success to write");
      },
      e => console.log("error "+e)
    );


    this.ble.read(peripheral.id,'fff0','fff6').then(
       buffer => {
            var data = new Uint8Array(buffer);
            alert(buffer);
            this.ngZone.run(() => {
              for (var j = 0; j < data.length; j++) {
                console.log(Math.floor(data[j]/16),data[j]%16);
              }
            console.log(data);
          });
        },
        e => console.log("error "+e)
      );
    // this.ble.read(peripheral.id,UUID,characteristic_UUID_RX).then(
    //   buffer => {
    //     var data = new Uint8Array(buffer);
    //     this.ngZone.run(() => {
    //       for (var j = 0; j < data.length; j++) {
    //         console.log(Math.floor(data[j]/16),data[j]%16);
    //       }
    //       console.log(data);
    //     });
    //   }
    // );
  }

  onDeviceDisconnected(peripheral) {
    let toast = this.toastCtrl.create({
      message: 'The peripheral unexpectedly disconnected',
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }

  // Disconnect peripheral when leaving the page
  ionViewWillLeave() {
    console.log('ionViewWillLeave disconnecting Bluetooth');
    this.ble.disconnect(this.peripheral.id).then(
      () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
      () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
    )
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }
  showAlert(message) {
    let alert = this.alert.create({
      title: 'something news',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
