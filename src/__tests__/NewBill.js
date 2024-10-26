/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from '@testing-library/dom'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { localStorageMock } from '../__mocks__/localStorage.js'
import mockStore from '../__mocks__/store'
import router from '../app/Router.js'
import Store from '../app/Store'
import { ROUTES } from '../constants/routes'
import NewBill from '../containers/NewBill.js'
import NewBillUI from '../views/NewBillUI.js'

// This line is a jest mock of the Store.js file. It replaces the real implementation of the Store.js file with the mockStore object from the __mocks__/store.js file. This allows us to control the behavior of the Store class in our unit tests.
jest.mock('../app/Store', () => mockStore)

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('Given I am connected as an employee', () => {
  beforeEach(() => {
    const spyBills = jest.spyOn(mockStore, 'bills')
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: 'a@a' }))
    const email = 'a@a'
    let root = document.createElement('div')
    root.setAttribute('id', 'root')
    root.innerHTML = NewBillUI()
    document.body.appendChild(root)
    router()
  })
  afterEach(() => {
    jest.clearAllMocks()
    document.body.innerHTML = ''
  })

  describe('When I am on NewBill Page', () => {
    test('Then newBill form should be rendered', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const form = screen.getByTestId('form-new-bill')
      //to-do write assertion
      expect(form).toBeTruthy()
    })

    test('Then in newBill form, date input should be required and should be a date', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const inputDate = screen.getByTestId('datepicker')
      expect(inputDate).toBeTruthy()
      expect(inputDate.required).toBeTruthy()
      expect(inputDate.type).toBe('date')
    })

    test('Then in newBill form, amount input should be required and should be a number', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const inputAmount = screen.getByTestId('amount')
      expect(inputAmount).toBeTruthy()
      expect(inputAmount.required).toBeTruthy()
      expect(inputAmount.type).toBe('number')
    })

    test('Then in newBill form, pct input should be required and should be a number', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const inputPct = screen.getByTestId('pct')
      expect(inputPct).toBeTruthy()
      expect(inputPct.required).toBeTruthy()
      expect(inputPct.type).toBe('number')
    })

    test('Then in newBill form, the file input should be required, should be a file', () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const inputFile = screen.getByTestId('file')
      expect(inputFile).toBeTruthy()
      expect(inputFile.required).toBeTruthy()
      expect(inputFile.type).toBe('file')
    })
  })

  describe('When I upload a file', () => {
    test('Then the file input should be empty and an error message should be displayed if the file is not a valid image', async () => {
      jest.spyOn(mockStore, 'bills')
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: 'a@a' }))
      const email = 'a@a'
      let root = document.createElement('div')
      root.setAttribute('id', 'root')
      root.innerHTML = NewBillUI()
      document.body.appendChild(root)
      router()

      const newBill = new NewBill({
        document,
        onNavigate: (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        },
        store: Store,
        localStorage: window.localStorage,
      })

      const handleChangeFileMock = jest.fn((event) => newBill.handleChangeFile(event))

      const fileInput = screen.getByTestId('file')
      fileInput.addEventListener('change', handleChangeFileMock)

      const mockFile = new File([''], 'document.pdf', { type: 'application/pdf' })
      userEvent.upload(fileInput, mockFile)

      const errorMessage = document.querySelector(`p[data-testid="file-error-message"]`)
      expect(errorMessage).not.toBeNull()
      expect(errorMessage.textContent).toBe(
        'Le fichier doit être une image au format jpg, JPG, jpeg, JPEG, png ou PNG'
      )
      expect(fileInput.value).toBe('')

      userEvent.clear(fileInput)
      userEvent.upload(fileInput, new File(['foo'], 'foo.pdf', { type: 'application/pdf' }))
      expect(handleChangeFileMock).toHaveBeenCalled()
      errorMessage.remove()
    })

    test('Then the file input should be filled and the store should be called', async () => {
      jest.spyOn(mockStore, 'bills')

      document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({
        document,
        onNavigate: (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        },
        store: mockStore,
        localStorage: window.localStorage,
      })

      const handleChangeFileMock = jest.fn((event) => newBill.handleChangeFile(event))
      const inputFile = screen.getByTestId('file')
      inputFile.addEventListener('change', handleChangeFileMock)
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      userEvent.upload(inputFile, file)
      expect(handleChangeFileMock).toHaveBeenCalled()
      expect(document.querySelector(`p[data-testid="file-error-message"]`)).toBeNull()
    })
  })

  describe('When I am on NewBill Page and I submit the form after filling it', () => {
    test('fetches bills from an API and fails with 404 message error', async () => {
      document.body.innerHTML = NewBillUI()

      // Mock store with rejection
      mockStore.bills.mockImplementationOnce(() => ({
        update: () => Promise.reject(new Error('Erreur 404')),
      }))

      const newBill = new NewBill({
        document,
        onNavigate: (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        },
        store: mockStore,
        localStorage: window.localStorage,
      })

      // Fill form and submit
      const form = screen.getByTestId('form-new-bill')
      fireEvent.submit(form)

      // Wait for the error message to appear
      await waitFor(() => {
        const errorMessage = screen.getByTestId('error-message')
        expect(errorMessage).toBeTruthy()
        expect(errorMessage.textContent).toBe('Erreur 404')
      })
    })

    test('fetches messages from an API and fails with 500 message error', async () => {
      document.body.innerHTML = NewBillUI()

      // Mock store with rejection
      mockStore.bills.mockImplementationOnce(() => ({
        update: () => Promise.reject(new Error('Erreur 500')),
      }))

      const newBill = new NewBill({
        document,
        onNavigate: (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        },
        store: mockStore,
        localStorage: window.localStorage,
      })

      const form = screen.getByTestId('form-new-bill')
      fireEvent.submit(form)

      // Wait for the error message to appear
      await waitFor(() => {
        const errorMessage = screen.getByTestId('error-message')
        expect(errorMessage).toBeTruthy()
        expect(errorMessage.textContent).toBe('Erreur 500')
      })
    })

    test('creates a new bill', async () => {
      document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({
        document,
        onNavigate: (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        },
        store: mockStore,
        localStorage: window.localStorage,
      })

      // Fill form and submit
      const form = screen.getByTestId('form-new-bill')

      screen.getByTestId('expense-type').value = 'Transports'
      screen.getByTestId('expense-name').value = 'Bus'
      screen.getByTestId('datepicker').value = '2022-01-01'
      screen.getByTestId('amount').value = '200'
      screen.getByTestId('vat').value = '80'
      screen.getByTestId('pct').value = '20'
      screen.getByTestId('commentary').value = 'test'
      const inputFile = screen.getByTestId('file')
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      userEvent.upload(inputFile, file)

      fireEvent.submit(form)

      await waitFor(() => {
        const bills = mockStore.bills().list()
        const billId = '47qAXb6fIm2zOKkLzMro2508'
        const bill = Array.from(bills).find((b) => b.id === billId)
        expect(bill).not.toBeNull()
      })
    })
  })
})

