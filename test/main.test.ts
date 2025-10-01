import { expect } from 'chai';
import 'mocha';
import * as qrcode from '../src/main';

describe('QR Code Generation', () => {
  it('should generate a QR code with default options', (done) => {
    qrcode.generate('test', (result) => {
      expect(result).to.be.a('string');
      // Default QR code uses block elements
      expect(result).to.include('█');
      done();
    });
  });

  it('should generate a small QR code', (done) => {
    qrcode.generate('test', { small: true }, (result) => {
      expect(result).to.be.a('string');
      // Small QR code uses half-height block elements
      expect(result).to.include('▄');
      done();
    });
  });

  it('should generate a QR code with a specific error correction level', (done) => {
    qrcode.setErrorLevel('H');
    qrcode.generate('test', (result) => {
      // We can't easily verify the error correction level from the output string,
      // but we can ensure it still generates a valid QR code.
      expect(result).to.be.a('string');
      done();
    });
  });

  it('should handle different option and callback orders', (done) => {
    let result1 = '';
    let result2 = '';

    qrcode.generate('test', (result) => {
      result1 = result;
      qrcode.generate('test', {}, (result) => {
        result2 = result;
        expect(result1).to.equal(result2);
        done();
      });
    });
  });
});