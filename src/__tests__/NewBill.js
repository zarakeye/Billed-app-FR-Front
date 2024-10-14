/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { fireEvent, screen, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import Store from '../app/Store'
import router from "../app/Router.js";

// This line is a jest mock of the Store.js file. It replaces the real implementation of the Store.js file with the mockStore object from the __mocks__/store.js file. This allows us to control the behavior of the Store class in our unit tests.
jest.mock('../app/Store', () => mockStore)
// jest.mock('../app/Store', () => ({
//   default: {
//     bills: jest.fn().mockImplementation(() => mockedBills)
//   }
// }));

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    jest.spyOn(mockStore, "bills")
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
    const email = "a@a"
    let root = document.createElement("div")
    root.setAttribute("id", "root")
    root.innerHTML = NewBillUI()
    document.body.appendChild(root)
    router()
  })
  afterEach(() => {
    jest.clearAllMocks()
    document.body.innerHTML = ""
  })
  
  describe("When I am on NewBill Page", () => {
    test("Then newBill form should be rendered", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const form = screen.getByTestId('form-new-bill')
      //to-do write assertion
      expect(form).toBeTruthy()
    })

    test("Then in newBill form, date input should be required and should be a date", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const inputDate = screen.getByTestId('datepicker')
      expect(inputDate).toBeTruthy()
      expect(inputDate.required).toBeTruthy()
      expect(inputDate.type).toBe('date')
    })

    test("Then in newBill form, amount input should be required and should be a number", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const inputAmount = screen.getByTestId('amount')
      expect(inputAmount).toBeTruthy()
      expect(inputAmount.required).toBeTruthy()
      expect(inputAmount.type).toBe('number')
    })

    test("Then in newBill form, pct input should be required and should be a number", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const inputPct = screen.getByTestId('pct')
      expect(inputPct).toBeTruthy()
      expect(inputPct.required).toBeTruthy()
      expect(inputPct.type).toBe('number')
    })

    test("Then in newBill form, the file input should be required, should be a file", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const inputFile = screen.getByTestId('file')
      expect(inputFile).toBeTruthy()
      expect(inputFile.required).toBeTruthy()
      expect(inputFile.type).toBe('file')
    })
  })

  describe("When I upload a file", () => {
    test("Then the file input should be empty and an error message should be displayed if the file is not a valid image", async () => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
      const email = "a@a"
      let root = document.createElement("div")
      root.setAttribute("id", "root")
      root.innerHTML = NewBillUI()
      document.body.appendChild(root)
      router()
      
      const newBill = new NewBill({
        document,
        onNavigate: (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        },
        store: Store,
        localStorage: window.localStorage
      })

      const handleChangeFileMock = jest.fn((event) => newBill.handleChangeFile(event))

      const fileInput = screen.getByTestId("file")
      fileInput.addEventListener("change", handleChangeFileMock)

      const mockFile = new File([""], "document.pdf", { type: "application/pdf" })
      userEvent.upload(fileInput, mockFile)

      const errorMessage = document.querySelector(`p[data-testid="file-error-message"]`)
      expect(errorMessage).not.toBeNull()
      expect(errorMessage.textContent).toBe("Le fichier doit être une image au format jpg, JPG, jpeg, JPEG, png ou PNG")  
      expect(fileInput.value).toBe("")
      
      userEvent.clear(fileInput)
      userEvent.upload(fileInput, new File(["foo"], "foo.pdf", { type: "application/pdf" }))
      expect(handleChangeFileMock).toHaveBeenCalled()
      errorMessage.remove()
    })

    test("Then the file input should be filled and the store should be called", async () => {
      document.body.innerHTML = NewBillUI()

      const mockStore = {
        bills: () => {
          return {
            create: jest.fn(() => {
              return Promise.resolve({fileUrl: 'https://localhost:3456/images/test.jpg', key: '1234'})
            })
          }
        }
      }
      const newBill = new NewBill({
        document,
        onNavigate: (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        },
        store: mockStore,
        localStorage: window.localStorage
      })

      const handleChangeFileMock = jest.fn((event) => newBill.handleChangeFile(event))
      const inputFile = screen.getByTestId("file")
      inputFile.addEventListener("change", handleChangeFileMock)
      const file = new File([""], "test.jpg", { type: "image/jpeg" })
      userEvent.upload(inputFile, file)
      expect(handleChangeFileMock).toHaveBeenCalled()
      expect(document.querySelector(`p[data-testid="file-error-message"]`)).toBeNull()
    }) 
  })

  describe("When I am on NewBill Page and I click on submit button", () => {
    test("Then the form should be submitted by calling handleSubmit function and the redirect should be called", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
      const email = "a@a"
      const validFile = new File(["foo"], "foo.png", { type: "image/png" })

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      const html = NewBillUI()
      root.innerHTML = html

      document.body.appendChild(root)
      console.log('document = ', document.body.textContent)
      router()

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const newBill = new NewBill({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      })

      const handleSubmitMock = jest.fn((event) => newBill.handleSubmit(event))
      const form = screen.getByTestId('form-new-bill')
      form.addEventListener('submit', handleSubmitMock)
      
      const expanseName = screen.getByTestId('expense-name')
      userEvent.type(expanseName, 'Note de frais de test')

      const datepicker = screen.getByTestId('datepicker')
      userEvent.type(datepicker, '2022-01-01')

      const amount = screen.getByTestId('amount')
      userEvent.type(amount, '200')

      const pct = screen.getByTestId('pct')
      userEvent.type(pct, '20')

      const file = screen.getByTestId('file')
      userEvent.upload(file, validFile)

      userEvent.click(screen.getByText('Envoyer'))
      
      expect(handleSubmitMock).toHaveBeenCalled()

      expect(screen.getByTestId('modaleProof')).toBeTruthy() // check if the redirect is working cause 'modaleProof' is in the Bills page 
    })
  })
})


