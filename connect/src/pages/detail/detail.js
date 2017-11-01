var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { AlertController } from 'ionic-angular';
var DetailPage = /** @class */ (function () {
    function DetailPage(navCtrl, navParams, ble, toastCtrl, ngZone, alert) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.ble = ble;
        this.toastCtrl = toastCtrl;
        this.ngZone = ngZone;
        this.alert = alert;
        this.peripheral = {};
        var device = navParams.get('device');
        this.setStatus('Connecting to ' + device.name || device.id);
        console.log(this.ble.connect(device.id));
        this.ble.connect(device.id).subscribe(function (peripheral) { return _this.onConnected(peripheral, device.id); }, function (peripheral) { return _this.onDeviceDisconnected(peripheral); });
        // this.showAlert(this.peripheral);
    }
    DetailPage.prototype.onConnected = function (peripheral, id) {
        var _this = this;
        this.ngZone.run(function () {
            _this.setStatus('');
            _this.peripheral = peripheral;
        });
        console.log(peripheral.characteristics);
        console.log("deviceId " + peripheral.id);
        console.log("serviceUUID ");
        for (var _i = 0, _a = peripheral.characteristics; _i < _a.length; _i++) {
            var i = _a[_i];
            this.ble.read(peripheral.id, i.service, i.characteristic).then(function (buffer) {
                var data = new Uint8Array(buffer);
                _this.ngZone.run(function () {
                    console.log(data);
                });
            });
            console.log(i.characteristic);
        }
    };
    DetailPage.prototype.onDeviceDisconnected = function (peripheral) {
        var toast = this.toastCtrl.create({
            message: 'The peripheral unexpectedly disconnected',
            duration: 3000,
            position: 'middle'
        });
        toast.present();
    };
    // Disconnect peripheral when leaving the page
    DetailPage.prototype.ionViewWillLeave = function () {
        var _this = this;
        console.log('ionViewWillLeave disconnecting Bluetooth');
        this.ble.disconnect(this.peripheral.id).then(function () { return console.log('Disconnected ' + JSON.stringify(_this.peripheral)); }, function () { return console.log('ERROR disconnecting ' + JSON.stringify(_this.peripheral)); });
    };
    DetailPage.prototype.setStatus = function (message) {
        var _this = this;
        console.log(message);
        this.ngZone.run(function () {
            _this.statusMessage = message;
        });
    };
    DetailPage.prototype.showAlert = function (message) {
        var alert = this.alert.create({
            title: 'something news',
            subTitle: message,
            buttons: ['OK']
        });
        alert.present();
    };
    DetailPage = __decorate([
        Component({
            selector: 'page-detail',
            templateUrl: 'detail.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            BLE,
            ToastController,
            NgZone,
            AlertController])
    ], DetailPage);
    return DetailPage;
}());
export { DetailPage };
//# sourceMappingURL=detail.js.map