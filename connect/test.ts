function greet(msg: string){
    console.log("Say " + msg);
}

greet("hello!");
var hexLiteral: number = 0x9837abdef;
console.log(hexLiteral);
console.log(Math.floor(4.5));
// let a=new number([41,00,00,00,00,00,00,00,00,00,00,00,00,00,00,41]);
let send_data= new Uint8Array(16);
// for (let i of a){
// 	// send_data[i]=a[i];
// }
console.log(send_data);
let x=new Uint8Array([1,2,3]);
console.log(x);
// send_data=[41,00,00,00,00,00,00,00,00,00,00,00,00,00,00,41];