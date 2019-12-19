
function show(tag, encryption) {
  var pass = document.getElementById(tag + '_input').value;

  var decrypted = CryptoJS.AES.decrypt(encryption, pass).toString(CryptoJS.enc.Utf8);

  if (decrypted.substring(0,31) !== 'https://share.cocalc.com/share/') {
      alert('Bad passphrase!');
      return;
  } else {
      window.location = decrypted;
  }



}
