import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { AlertController } from 'ionic-angular';


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
    console.log(peripheral.characteristics);
    console.log("deviceId "+peripheral.id);
    console.log("serviceUUID ");
    for (let  i of peripheral.characteristics) {
      this.ble.read(peripheral.id, i.service, i.characteristic).then(
        buffer => {
          var data = new Uint8Array(buffer);
          this.ngZone.run(() => {
            console.log(data);
          });
        }
      );
      console.log(i.characteristic);
    }

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
