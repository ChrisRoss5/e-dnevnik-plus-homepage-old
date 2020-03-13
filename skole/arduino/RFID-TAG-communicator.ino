#include <SPI.h>      // SPI bus
#include <MFRC522.h>  // RFID čitač

#define SS_PIN 10     // Slave selekcijski pin
#define RST_PIN 9     // Reset pin

MFRC522 mfrc522(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key;  // MIFARE_Key struct nazvan 'key', pohranjuje infomacije o kartici

void setup() {
  Serial.begin(9600);
  while (!Serial);
  SPI.begin();         // Init SPI bus
  mfrc522.PCD_Init();  // Init MFRC522 card (in case you wonder what PCD means: proximity coupling device)

  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;   // keyByte je definiran u "MIFARE_Key" 'struct' definiciji u .h podatku modula
  }
}

void loop() {
  mfrc522.PCD_StopCrypto1();  // Zaustavi enkripciju na PCD
  
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }
  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }
  
  // Primanje poruke (korisničkih podataka) iz eD+ API-a
  if (Serial.available()) {
    String userData = Serial.readString();

    // Potvrda o primljenoj poruci & transfer
    if (userData.length()) {
      splitAndWrite("?" + userData + "!");
    }
  }
  
  splitAndRead();
  mfrc522.PICC_HaltA();  // Zaustavi PICC
}

void splitAndWrite(String userData) {
  byte inputLen = userData.length();
  byte block, n, m = 0;
  byte nthBlock = 0;
  byte blockcontent[16];

  for (block = 2; block < 64; block++) {
    if (!(block % 3)) {
      continue;
    }
    for (n = 0; n < 16; n++) {
      blockcontent[n] = userData[m++];
      if (m == inputLen) {
        writeBlock(block, blockcontent);
        return;
      }
    }
    writeBlock(block, blockcontent);
  }
}

void splitAndRead() {
  // MIFARE_Read metoda zahtjeva buffer od minimalno 18 bytova da bi držala 16 bytova bloka
  byte readBackBlock[18];  // Array za čitanje bloka.
  byte block, n;
  for (block = 2; block < 9; block++) {
    if (!(block % 3)) {
      continue;
    }
    readBlock(block, readBackBlock);
    for (n = 0; n < 16; n++) {
      Serial.write(readBackBlock[n]);  // Serial.write() - ASCII brojevi -> karakteri
    }
  }
}

int writeBlock(int blockNumber, byte arrayAddress[]) {
  int largestModulo4Number = blockNumber / 4 * 4;
  int trailerBlock = largestModulo4Number + 3;
  if (blockNumber > 2 && (!(blockNumber + 1) % 4)) {
    return 2;
  }

  /*****************************************Autentikacija bloka za pristup*****************************************/
  byte status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, trailerBlock, &key, &(mfrc522.uid));
  /************************************************Pisanje u blok**************************************************/
  status = mfrc522.MIFARE_Write(blockNumber, arrayAddress, 16);
}

int readBlock(int blockNumber, byte arrayAddress[]) {
  int largestModulo4Number = blockNumber / 4 * 4;
  int trailerBlock = largestModulo4Number + 3;

  /*****************************************Autentikacija bloka za pristup*****************************************/
  byte status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, trailerBlock, &key, &(mfrc522.uid));
  /***********************************************Čitanje iz bloka*************************************************/
  byte buffersize = 18;
  status = mfrc522.MIFARE_Read(blockNumber, arrayAddress, &buffersize);
}
