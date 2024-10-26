/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { fireEvent, screen, waitFor, render } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import Store from '../app/Store'
import router from "../app/Router.js";
import { bills } from '../fixtures/bills.js'

// This line is a jest mock of the Store.js file. It replaces the real implementation of the Store.js file with the mockStore object from the __mocks__/store.js file. This allows us to control the behavior of the Store class in our unit tests.
jest.mock('../app/Store', () => mockStore)

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    const spyBills = jest.spyOn(mockStore, "bills")
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
      jest.spyOn(mockStore, "bills")
      
      document.body.innerHTML = NewBillUI()
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

  describe("When I am on NewBill Page and I submit the form after filling it", () => {
    // test("Then the new bill should be created", async () => {
    //   const onNavigate = (pathname) => {
    //     document.body.innerHTML = ROUTES({ pathname })
    //   }
      
    //   const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
    //   const handleSubmitMock = jest.fn((event) => newBill.handleSubmit(event))
    //   const handleChangeFileMock = jest.fn((event) => newBill.handleChangeFile(event))
    //   const form = screen.getByTestId("form-new-bill")
    //   expect(form).toBeTruthy()
    //   form.addEventListener("submit", handleSubmitMock)

    //   screen.getByTestId("expense-name").value = "test"
    //   screen.getByTestId("expense-type").value = "Transports"
    //   screen.getByTestId("datepicker").value = "2022-01-01"
    //   screen.getByTestId("amount").value = "100"
    //   screen.getByTestId("vat").value = "20"
    //   screen.getByTestId("pct").value = "10"
    //   const inputFile = screen.getByTestId("file")
    //   const file = new File([""], "test.jpg", { type: "image/jpeg" })
    //   form.addEventListener("change", handleChangeFileMock)
    //   userEvent.upload(inputFile, file)
    //   fireEvent.submit(form)

    //   window.onNavigate(ROUTES_PATH.Bills)
    //   expect(handleSubmitMock).toHaveBeenCalled()

    //   await new Promise(process.nextTick);
    //   await waitFor(() => {
    //     expect(mockStore.bills.create).toHaveBeenCalledWith(expext.ObjectContaining({
    //       name: "test",
    //       type: "Transports",
    //       amount: 100,
    //       date: "2022-01-01",
    //       vat: 20,
    //       pct: 10,
    //       commentary: "",
    //       fileUrl: "https://localhost:3456/images/test.jpg",
    //       fileName: "test.jpg",
    //       status: "pending",
    //     }))
    //   })

    //   // expect(document.querySelector(`p[data-testid="file-error-message"]`)).toBeNull()
    //   // expect(mockStore.bills.createBill).toHaveBeenCalled()
    // }),
    test("console.error should be called with 'Erreur 404' if an 404 error is returned from the API", async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockStore.bills.mockImplementationOnce(() => {
        return {
          create : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          },
          update : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }
      })

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
      const email = "a@a"
      const validFile = new File(["foo"], "image.jpg", { type: "image/jpeg" })

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      const html = NewBillUI()
      root.innerHTML = html

      document.body.appendChild(root)
      router()

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const newBill = new NewBill({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      })

      // const handleSubmitMock = jest.fn((event) => newBill.handleSubmit(event))
      
      const form = screen.getByTestId('form-new-bill')
      // form.addEventListener('submit', handleSubmitMock)
      
      screen.getByTestId("expense-name").value = "test"
      screen.getByTestId("expense-type").value = "Transports"
      screen.getByTestId("datepicker").value = "2022-01-01"
      screen.getByTestId("amount").value = "100"
      screen.getByTestId("vat").value = "20"
      screen.getByTestId("pct").value = "10"

      const file = screen.getByTestId('file')
      userEvent.upload(file, validFile)



      fireEvent.submit(form)

      await new Promise(process.nextTick);
      await waitFor(() => {
        const message = screen.getByText(/erreur/i).toBeInDocument()
        // expect(message).toBeTruthy()
      })
      
      
      
      // await waitFor(() => {
      //   expect(consoleError).toHaveBeenCalledWith(new Error("Erreur 404"))
      //   consoleError.mockRestore()
      // })
    })

    // test("console.error should be called with 'Erreur 500' if an 500 error is returned from the API", async () => {
    //   const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    //   mockStore.bills.mockImplementationOnce(() => {
    //     return {
    //       create : () =>  {
    //         return Promise.reject(new Error("Erreur 500"))
    //       }
    //     }
    //   })

    //   Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    //   window.localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
    //   const email = "a@a"
    //   const validFile = new File(["foo"], "image.jpg", { type: "image/jpeg" })

    //   const root = document.createElement("div")
    //   root.setAttribute("id", "root")
    //   const html = NewBillUI()
    //   root.innerHTML = html

    //   document.body.appendChild(root)
    //   router()

    //   const onNavigate = (pathname) => {
    //     document.body.innerHTML = ROUTES({ pathname })
    //   }

    //   const newBill = new NewBill({
    //     document, onNavigate, store: mockStore, localStorage: window.localStorage
    //   })

    //   const handleSubmitMock = jest.fn((event) => newBill.handleSubmit(event))
      
    //   const form = screen.getByTestId('form-new-bill')
    //   form.addEventListener('submit', handleSubmitMock)
      
    //   const file = screen.getByTestId('file')
    //   userEvent.upload(file, validFile)

    //   fireEvent.submit(form)

    //   await new Promise(process.nextTick);

    //   await waitFor(() => {
    //     expect(handleSubmitMock).toHaveBeenCalled()
    //     expect(consoleError).toHaveBeenCalledWith(new Error("Erreur 500"))
    //     consoleError.mockRestore()
    //   })
    // })
  })
})



// jest.spyOn(mockStore, "bills")
//     mockStore.bills.mockImplementationOnce(() => ({
//       create: jest.fn().mockRejectedValueOnce(new Error('Erreur 500'))
//     }))

//     Object.defineProperty(window, 'localStorage', { value: localStorageMock })
//     window.localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
//     const email = "a@a"
//     const validFile = new File(["foo"], "foo.png", { type: "image/png" })

//     const root = document.createElement("div")
//     root.setAttribute("id", "root")
//     const html = NewBillUI()
//     root.innerHTML = html

//     document.body.appendChild(root)
//     router()

//     const onNavigate = (pathname) => {
//       document.body.innerHTML = ROUTES({ pathname })
//     }

//     const newBill = new NewBill({
//       document, onNavigate, store: mockStore, localStorage: window.localStorage
//     })

//     const handleSubmitMock = jest.fn((event) => newBill.handleSubmit(event))
//     const form = screen.getByTestId('form-new-bill')
//     form.addEventListener('submit', handleSubmitMock)
    
//     const expanseName = screen.getByTestId('expense-name')
//     userEvent.type(expanseName, 'Note de frais de test')

//     const datepicker = screen.getByTestId('datepicker')
//     userEvent.type(datepicker, '2022-01-01')

//     const amount = screen.getByTestId('amount')
//     userEvent.type(amount, '200')

//     const pct = screen.getByTestId('pct')
//     userEvent.type(pct, '20')

//     const file = screen.getByTestId('file')
//     userEvent.upload(file, validFile)

//     userEvent.click(screen.getByText('Envoyer'))
    
//     expect(handleSubmitMock).toHaveBeenCalled()

//     try {
//       await mockStore.bills().create({ email, file, amount: 200, name: "Note de frais de test", date: "2022-01-01", pct: 20 })
//     } catch (error) {
//       expect(error.message).toBe("Erreur 500")
//       expect(screen.getByText("Erreur 500")).toBeTruthy()
//     }
//   })

