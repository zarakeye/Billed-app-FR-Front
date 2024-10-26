import { ROUTES_PATH } from '../constants/routes.js'
import Logout from './Logout.js'

export default class NewBill {
  /**
   * constructor
   *
   * @param {object} options - options to initialize the NewBill instance
   * @param {Document} options.document - the document object to select the form and input elements
   * @param {function} options.onNavigate - the function to navigate to a new route
   * @param {Store} options.store - the store instance to get the user's bills
   * @param {object} options.localStorage - the localStorage instance to set the user's status to 'connected'
   */
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener('submit', this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener('change', this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }

  handleChangeFile = (e) => {
    e.preventDefault()
    const inputImage = this.document.querySelector(`input[data-testid="file"]`)
    const file = inputImage.files[0]
    const filePath = e.target.value.split(/\\/g)
    const fileName = file.name

    if (/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/g.test(fileName) === false) {
      const errorMessage = this.document.querySelector(`p[data-testid="file-error-message"]`)
      if (!errorMessage) {
        const errorMessage = this.document.createElement('p')
        errorMessage.setAttribute('data-testid', 'file-error-message')
        errorMessage.textContent =
          'Le fichier doit être une image au format jpg, JPG, jpeg, JPEG, png ou PNG'
        inputImage.insertAdjacentElement('afterend', errorMessage)
        errorMessage.style.color = 'red'
      }

      e.target.value = ''
    } else {
      const errorMessage = this.document.querySelector(`p[data-testid="file-error-message"]`)
      if (errorMessage !== null) {
        errorMessage.remove()
      }
      const formData = new FormData()
      const email = JSON.parse(localStorage.getItem('user')).email
      formData.append('file', file)
      formData.append('email', email)

      this.store
        .bills()
        .create({
          data: formData,
          headers: {
            noContentType: true,
          },
        })
        .then(({ fileUrl, key }) => {
          this.billId = key
          this.fileUrl = fileUrl
          this.fileName = fileName
        })
        .catch((error) => console.error(error))
    }
  }
  handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const email = JSON.parse(localStorage.getItem('user')).email
      const bill = {
        email,
        type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
        name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
        amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
        date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
        vat: e.target.querySelector(`input[data-testid="vat"]`).value,
        pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
        commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
        fileUrl: this.fileUrl,
        fileName: this.fileName,
        status: 'pending',
      }

      await this.updateBill(bill)
    } catch (error) {
      // Create error message element
      const form = this.document.querySelector(`form[data-testid="form-new-bill"]`)
      const errorDiv = this.document.createElement('div')
      errorDiv.setAttribute('data-testid', 'error-message')
      errorDiv.textContent = error.message
      form.insertAdjacentElement('afterend', errorDiv)
    }
  }

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      return this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          this.onNavigate(ROUTES_PATH['Bills'])
        })
        .catch((error) => {
          // Create error message element if it doesn't exist
          let errorDiv = this.document.querySelector('[data-testid="error-message"]')
          if (!errorDiv) {
            errorDiv = this.document.createElement('div')
            errorDiv.setAttribute('data-testid', 'error-message')
            errorDiv.classList.add('error-message')
            const form = this.document.querySelector(`form[data-testid="form-new-bill"]`)
            form.insertAdjacentElement('afterend', errorDiv)
          }
          errorDiv.textContent = error.message
          throw error
        })
    }
  }

  // displayErrorMessage = (message) => {
  //   const message = this.document.createElement("p")
  //   message.setAttribute("data-testid", "error-message")
  //   message.textContent = message
  //   message.style.color = "red"

  //   const form = this.document.querySelector(`form[data-testid="form-new-bill"]`)
  //   form.insertAdjacentElement("beforeend", message)
  // }
}