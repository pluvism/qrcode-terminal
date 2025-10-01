import qrcode from '../lib/main'
const url = 'https://google.com/'

qrcode.generate(url, { small: true }, function (qr) {
    console.log(qr)
})
