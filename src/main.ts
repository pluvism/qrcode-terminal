import qrcode, { QRCodeOptions, QRCode } from 'qrcode';

type GenerateOptions = {
  small?: boolean;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
};

type GenerateCallback = (qrcode: string) => void;

let errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H' = 'L';

/**
 * Generates a small QR code string using half-block characters.
 * This is a port of the original library's logic.
 * @param qr The QR code object from the qrcode library.
 */
function generateSmall(qr: QRCode): string {
    const size = qr.modules.size;
    const data = qr.modules.data;
    let output = '';

    const moduleMatrix: boolean[][] = [];
    for (let y = 0; y < size; y++) {
        moduleMatrix[y] = [];
        for (let x = 0; x < size; x++) {
            // true for black, false for white
            moduleMatrix[y][x] = data[y * size + x] === 1;
        }
    }

    const BLACK = true, WHITE = false;
    const oddRow = size % 2 === 1;
    if (oddRow) {
        moduleMatrix.push(new Array(size).fill(WHITE));
    }

    const platte = {
        WHITE_ALL: '█',
        WHITE_BLACK: '▀',
        BLACK_WHITE: '▄',
        BLACK_ALL: ' ',
    };

    const borderTop = platte.BLACK_WHITE.repeat(size + 2);
    const borderBottom = platte.WHITE_BLACK.repeat(size + 2);

    output += borderTop + '\n';

    for (let row = 0; row < size; row += 2) {
        output += platte.WHITE_ALL;
        for (let col = 0; col < size; col++) {
            const top = moduleMatrix[row][col];
            const bottom = moduleMatrix[row + 1][col];

            if (top === WHITE && bottom === WHITE) {
                output += platte.WHITE_ALL;
            } else if (top === WHITE && bottom === BLACK) {
                output += platte.WHITE_BLACK;
            } else if (top === BLACK && bottom === WHITE) {
                output += platte.BLACK_WHITE;
            } else {
                output += platte.BLACK_ALL;
            }
        }
        output += platte.WHITE_ALL + '\n';
    }

    if (!oddRow) {
        output += borderBottom;
    }

    return output;
}


/**
 * Generates a QR code and displays it in the terminal.
 *
 * @param input The data to encode in the QR code.
 * @param opts Options for generating the QR code.
 * @param cb A callback to receive the QR code string.
 */
export function generate(input: string, opts?: GenerateOptions | GenerateCallback, cb?: GenerateCallback): void {
  let options: GenerateOptions = {};
  let callback: GenerateCallback | undefined;

  if (typeof opts === 'function') {
    callback = opts;
  } else if (opts) {
    options = opts;
    callback = cb;
  }

  const qrOptions: QRCodeOptions = {
    errorCorrectionLevel: options.errorCorrectionLevel || errorCorrectionLevel,
  };

  const done = (result: string) => {
    if (callback) {
      callback(result);
    } else {
      console.log(result);
    }
  };

  if (options.small) {
    const qr = qrcode.create(input, qrOptions);
    const result = generateSmall(qr);
    done(result);
  } else {
    qrcode.toString(input, { ...qrOptions, type: 'utf8' }, (err, result) => {
      if (err) {
        throw err;
      }
      done(result);
    });
  }
}

/**
 * Sets the error correction level for the QR code.
 *
 * @param level The error correction level to use.
 */
export function setErrorLevel(level: 'L' | 'M' | 'Q' | 'H'): void {
  errorCorrectionLevel = level;
}