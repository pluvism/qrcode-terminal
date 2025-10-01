import * as qrcode from '../src/main'
qrcode.generate('someone sets it up', function (str) {
    console.log(str)
})
