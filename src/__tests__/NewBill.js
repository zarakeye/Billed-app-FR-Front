/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { redirect } from "express/lib/response.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then newBill form should be rendered", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      expect(screen.getByTestId('form-new-bill')).toBeTruthy()
    })

    test("Then in newBill form, date input should be required, should be a date", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const inputDate = screen.getByTestId('datepicker')
      expect(inputDate).toBeTruthy()
      expect(inputDate.required).toBeTruthy()
      expect(inputDate.type).toBe('date')
    })

    test("Then in newBill form, amount input should be required, should be a number", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const inputAmount = screen.getByTestId('amount')
      expect(inputAmount).toBeTruthy()
      expect(inputAmount.required).toBeTruthy()
      expect(inputAmount.type).toBe('number')
    })

    test("Then in newBill form, pct input should be required, should be a number", () => {

      const validFile = new File(["foo"], "foo.png", { type: "image/png" });

      const html = NewBillUI()
      document.body.innerHTML = html
      const inputPct = screen.getByTestId('pct')
      expect(inputPct).toBeTruthy()
      expect(inputPct.required).toBeTruthy()
      expect(inputPct.type).toBe('number')
    })
  })
  describe("When I am on NewBill Page and I click on submit button", () => {
    test("Then it should call handleSubmit function and redirect to Bills Page", () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
      const email = "a@a"
      const validFile = new File(["foo"], "foo.png", { type: "image/png" })

      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const newBill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })
      const handleSubmit = jest.fn(newBill.handleSubmit)

      const form = screen.getByTestId('form-new-bill')
      
      const expanseName = screen.getByTestId('expense-name')
      fireEvent.change(expanseName, { target: { value: 'test' } })

      const datepicker = screen.getByTestId('datepicker')
      fireEvent.change(datepicker, { target: { value: '2022-01-01' } })

      const amount = screen.getByTestId('amount')
      fireEvent.change(amount, { target: { value: 200 } })

      const pct = screen.getByTestId('pct')
      fireEvent.change(pct, { target: { value: 20 } })

      const file = screen.getByTestId('file')
      fireEvent.change(file, { target: { files: [validFile] } })

      form.addEventListener('submit', handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
      // dans le cas d'un test, onNavigate est une fonction qui met à jour le contenu de document.body
      // mais window.location est une propriété en lecture seule, donc on ne peut pas la modifier directement
      // pour résoudre ce problème, on peut utiliser une bibliothèque comme jest-location-mock
      // sinon, on peut utiliser un mock pour window.location
      // const location = {pathname: null}
      // delete window.location
      // window.location = location
      // expect(window.location.pathname).toBe(ROUTES_PATH['Bills'])
      // onNavigate(ROUTES_PATH['Bills'])
      // expect(screen.getByText('test')).toBeTruthy()

      // const pathname = ROUTES_PATH['Bills']
      // expect(window.location.pathname).toBe(pathname)    })
  })
})
})
