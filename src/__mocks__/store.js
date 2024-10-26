const mockedBills = {
  list() {
    return Promise.resolve([{
      "id": "47qAXb6fIm2zOKkLzMro",
      "vat": "80",
      "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
      "status": "pending",
      "type": "Hôtel et logement",
      "commentary": "séminaire billed",
      "name": "encore",
      "fileName": "preview-facture-free-201801-pdf-1.jpg",
      "date": "2004-04-04",
      "amount": 400,
      "commentAdmin": "ok",
      "email": "a@a",
      "pct": 20
    },
    {
      "id": "BeKy5Mo4jkmdfPGYpTxZ",
      "vat": "",
      "amount": 100,
      "name": "test1",
      "fileName": "1592770761.jpeg",
      "commentary": "plop",
      "pct": 20,
      "type": "Transports",
      "email": "a@a",
      "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…61.jpeg?alt=media&token=7685cd61-c112-42bc-9929-8a799bb82d8b",
      "date": "2001-01-01",
      "status": "refused",
      "commentAdmin": "en fait non"
    },
    {
      "id": "UIUZtnPQvnbFnB0ozvJh",
      "name": "test3",
      "email": "a@a",
      "type": "Services en ligne",
      "vat": "60",
      "pct": 20,
      "commentAdmin": "bon bah d'accord",
      "amount": 300,
      "status": "accepted",
      "date": "2003-03-03",
      "commentary": "",
      "fileName": "facture-client-php-exportee-dans-document-pdf-enregistre-sur-disque-dur.png",
      "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3"
    },
    {
      "id": "qcCK3SzECmaZAGRrHjaC",
      "status": "refused",
      "pct": 20,
      "amount": 200,
      "email": "a@a",
      "name": "test2",
      "vat": "40",
      "fileName": "preview-facture-free-201801-pdf-1.jpg",
      "date": "2002-02-02",
      "commentAdmin": "pas la bonne facture",
      "commentary": "test2",
      "type": "Restaurants et bars",
      "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732"
    }])
  },
  /**
   * @typedef {Object} Bill
   * @property {string} id - The bill's id.
   * @property {string} vat - The bill's vat.
   * @property {string} fileUrl - The bill's file url.
   * @property {string} status - The bill's status.
   * @property {string} type - The bill's type.
   * @property {string} commentary - The bill's commentary.
   * @property {string} name - The bill's name.
   * @property {string} fileName - The bill's file name.
   * @property {string} date - The bill's date.
   * @property {number} amount - The bill's amount.
   * @property {string} commentAdmin - The bill's comment admin.
   * @property {string} email - The bill's email.
   * @property {number} pct - The bill's pct.
   *
   * @param {Bill} bill - The bill to create.
   *
   * @return {Promise<{fileUrl: string, key: string}>} - A promise resolving to an object with the fileUrl and key of the created bill.
   */
  create(bill) {
    return Promise.resolve({fileUrl: 'https://localhost:3456/images/test.jpg', key: '1234'})
  },
  update(bill) {
    return Promise.resolve({
      "id": "47qAXb6fIm2zOKkLzMro2508",
      "vat": "80",
      "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
      "status": "pending",
      "type": "Hôtel et logement",
      "commentary": "séminaire billed",
      "name": "encore",
      "fileName": "preview-facture-free-201801-pdf-1.jpg",
      "date": "2004-04-04",
      "amount": 400,
      "commentAdmin": "ok",
      "email": "a@a",
      "pct": 20
    })
  },
}

export default {
  /**
   * @return {Object} - An object with the list method.
   *
   * @typedef {Object} Bills
   * @property {function} list - A function returning a Promise resolving to an array of Bill objects.
   */
  bills() {
    return mockedBills
    //return {}
  },
}

