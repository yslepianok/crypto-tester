Repo is used for debugging window.subtle.crypto functionality
target:
1. make keypair in browser, export public key
2. sign random string in browser, export signature as base64
3. verify signature in terminal using openssl


in folder keys-browser keypair that was generated in browser (nothing insecure)

This command converts base64 signature to binary signature(Windows):
certutil -decode .\signature.base64 .\signature.binary
Unix:
base64 -d -i ./signature.base64 -o ./signature.binary

This command verifies binary signature:
openssl dgst -sha256 -verify .\public.pem -signature .\signature.binary .\text.txt