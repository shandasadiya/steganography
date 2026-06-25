// Tab Switching System
function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    // Remove active style from all navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabId).classList.add('active');
    
    // Highlight active button dynamically
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        if(btn.getAttribute('onclick').includes(tabId)) {
            btn.classList.add('active');
        }
    });
}

// 1. Image Steganography - Hide Message (LSB Technique)
function hideMessageInImage() {
    const fileInput = document.getElementById('hide-image-input');
    const secretMessage = document.getElementById('hide-message').value;

    if (!fileInput.files[0] || !secretMessage) {
        alert('Please pick an image and write a secret message first.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;

            // Appending a distinct closing bracket separator so reader knows when the string stops
            const fullMessage = secretMessage + "|||";
            let msgBinary = "";
            for (let i = 0; i < fullMessage.length; i++) {
                let bin = fullMessage.charCodeAt(i).toString(2);
                while (bin.length < 8) bin = "0" + bin;
                msgBinary += bin;
            }

            if (msgBinary.length > data.length * 0.75) {
                alert('Message too long for selected base image bounds.');
                return;
            }

            for (let i = 0; i < msgBinary.length; i++) {
                // Adjusting the Least Significant Bit (LSB)
                data[i * 4] = (data[i * 4] & 0xFE) | parseInt(msgBinary[i]);
            }

            ctx.putImageData(imgData, 0, 0);
            
            // Download processed result directly
            const link = document.createElement('a');
            link.download = 'stego-vault-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
}

// 2. Image Steganography - Extract Message
function extractMessageFromImage() {
    const fileInput = document.getElementById('extract-image-input');
    if (!fileInput.files[0]) {
        alert('Please load an image to read data from.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;

            let binaryStr = "";
            for (let i = 0; i < data.length / 4; i++) {
                binaryStr += (data[i * 4] & 1).toString();
            }

            let extractedMsg = "";
            for (let i = 0; i < binaryStr.length; i += 8) {
                let byte = binaryStr.substr(i, 8);
                let charCode = parseInt(byte, 2);
                if (isNaN(charCode)) break;
                extractedMsg += String.fromCharCode(charCode);
                
                // Break if we identify the custom separator token
                if (extractedMsg.endsWith("|||")) {
                    extractedMsg = extractedMsg.replace("|||", "");
                    break;
                }
            }

            document.getElementById('extraction-result').style.display = 'block';
            document.getElementById('extracted-text').innerText = extractedMsg || "[No hidden metadata found]";
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
}

// 3. Private Key Simulator Logic
function generatePrivateKey() {
    const chars = 'ABCDEF0123456789abcdef';
    let keyResult = '0x';
    for (let i = 0; i < 64; i++) {
        keyResult += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('key-result').style.display = 'block';
    document.getElementById('generated-key').innerText = keyResult;
}

// 4. Lightweight Text Cipher Obfuscator (XOR Approach)
function xorEncryptDocument() {
    const plainText = document.getElementById('encrypt-text').value;
    const passphrase = document.getElementById('encrypt-passphrase').value;

    if (!plainText || !passphrase) {
        alert('Fill out both the content zone and passphrase credentials.');
        return;
    }

    let result = "";
    for (let i = 0; i < plainText.length; i++) {
        let textChar = plainText.charCodeAt(i);
        let keyChar = passphrase.charCodeAt(i % passphrase.length);
        // XOR bitwise application
        let obfuscated = textChar ^ keyChar;
        result += String.fromCharCode(obfuscated);
    }

    document.getElementById('encrypt-result').style.display = 'block';
    // Base64 encoding the output string for readable presentation format
    document.getElementById('encrypted-output').innerText = btoa(unescape(encodeURIComponent(result)));
}