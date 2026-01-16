function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById('14QAUOe1UY8ivgL_7Wx1DxzsCmI_yP6e-o63CO16aRiw')
      .getSheetByName('Experience League');

    const payload = JSON.parse(e.postData.contents || '{}');
    const {
      team,
      category,
      captain,
      phone,
      email,
      receiptName,
      receiptType,
      receiptSize,
      receiptBase64,
      k
    } = payload;

    // Candado opcional: si quieres token, ponlo aquí y envíalo desde el front como 'k'
    const requiredToken = ''; // ej. 'mi-token'; déjalo vacío si no lo usas
    if (requiredToken && k !== requiredToken) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    let receiptUrl = '';
    if (receiptBase64 && receiptName) {
      // Carpeta destino en Drive para los comprobantes
      const folderId = '1VTrpOfxsnZB_1gcZ2wsI7dU0P4Ht5k9L';
      if (receiptSize && receiptSize > 2 * 1024 * 1024) throw new Error('Archivo excede 2MB');
      const blob = Utilities.newBlob(
        Utilities.base64Decode(receiptBase64),
        receiptType || 'application/octet-stream',
        receiptName
      );
      const file = DriveApp.getFolderById(folderId).createFile(blob);
      receiptUrl = file.getUrl();
    }

    sheet.appendRow([
      new Date(),
      team || '',
      category || '',
      captain || '',
      phone || '',
      email || '',
      receiptUrl,
      receiptName || '',
      receiptSize || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.error(err);
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
