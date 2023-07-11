import './App.css';
import { useState } from 'react';

// Generating

async function generateRSAKeyPair() {
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        //name: 'RSA-OAEP',
        //modulusLength: 2048,
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
        hash: 'SHA-256',
      },
      true,
      ['sign', 'verify']
    );

    const privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    const publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);

    const pemPrivateKey = formatPEM(privateKey, 'PRIVATE KEY');
    const pemPublicKey = formatPEM(publicKey, 'PUBLIC KEY');

    console.log('Private Key (PEM format):');
    console.log(pemPrivateKey);
    console.log('Public Key (PEM format):');
    console.log(pemPublicKey);

    return [pemPrivateKey, pemPublicKey]
  } catch (error) {
    console.error('Error generating RSA key pair:', error);
  }
}

function formatPEM(keyData, type) {
  const encodedKey = arrayBufferToBase64(keyData);
  const pemHeader = `-----BEGIN ${type}-----`;
  const pemFooter = `-----END ${type}-----`;
  return `${pemHeader}\n${chunkString(encodedKey, 64)}\n${pemFooter}`;
}

function arrayBufferToBase64(buffer) {
  const binary = String.fromCharCode.apply(null, new Uint8Array(buffer));
  return btoa(binary);
}

function chunkString(str, length) {
  return str.match(new RegExp(`.{1,${length}}`, 'g')).join('\n');
}

// End Generating


// Signing

async function signText(text, priv) {
  try {
    const privateKey = await window.crypto.subtle.importKey(
      'pkcs8',
      pemToArrayBuffer(priv),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const signature = await window.crypto.subtle.sign(
      { name: 'RSASSA-PKCS1-v1_5' },
      privateKey,
      data
    );

    const base64Signature = arrayBufferToBase64(signature);

    console.log('Signature (Base64 format):');
    console.log(base64Signature);

    return base64Signature
  } catch (error) {
    console.error('Error signing text:', error);
  }
}

function pemToArrayBuffer(pem) {
  const lines = pem.split('\n');
  const encodedKey = lines.slice(1, lines.length - 1).join('');
  const decodedKey = atob(encodedKey);
  const buffer = new Uint8Array(decodedKey.length);

  for (let i = 0; i < decodedKey.length; ++i) {
    buffer[i] = decodedKey.charCodeAt(i);
  }

  return buffer.buffer;
}

// End Signing

function App() {
  const [text, setText] = useState('')
  const [priv, setPriv] = useState('')
  const [pub, setPub] = useState('')
  const [signature, setSignature] = useState('')

  const createAndExportHandler = async () => {
    const [priv, pub] = await generateRSAKeyPair()
  
    setPriv(priv)
    setPub(pub)
  }

  const signTextHandler = async () => {
    console.log('Sign')
    const sig64 = await signText(text, priv)
    setSignature(sig64)
  }

  return (
    <div className="App">
      <button onClick={createAndExportHandler}>Generate</button>
      <button onClick={signTextHandler}>sign</button>
      <br/>

      <input type='text'  value={text} onChange={(e) => setText(e.target.value)}></input>

      <br/>
      <input type='text' value={signature} disabled></input>
    </div>
  );
}

export default App;
