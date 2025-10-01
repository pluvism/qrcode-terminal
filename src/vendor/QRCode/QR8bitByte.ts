import QRMode from './QRMode'
import QRBitBuffer from './QRBitBuffer'

class QR8bitByte {
    mode: number
    data: string

    constructor(data: string) {
        this.mode = QRMode.MODE_8BIT_BYTE
        this.data = data
    }

    getLength(): number {
        return this.data.length
    }

    write(buffer: QRBitBuffer): void {
        for (let i = 0; i < this.data.length; i++) {
            buffer.put(this.data.charCodeAt(i), 8)
        }
    }
}

export = QR8bitByte
