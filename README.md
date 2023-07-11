Repo is used for debugging window.subtle.crypto functionality
target:
1. make keypair in browser, export public key
2. sign random string in browser, export signature as base64
3. verify signature in terminal using openssl


in folder keys-browser keypair that was generated in browser (nothing insecure)

This command converts base64 signature to binary signature(Windows):
certutil -decode .\text.txt.signature.base64.1 .\text.txt.signature.verify.1

This command verifies binary signature:
openssl dgst -sha512 -verify .\public.pem -signature .\text.txt.signature.verify.1 .\text.txt