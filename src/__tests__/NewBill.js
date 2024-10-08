/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"


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
    test("Then it should call handleNewBill function", () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const email = "a@a"
      const validFile = new File(["foo"], "foo.png", { type: "image/png" });
      const mockBill = {
        email,
        file: validFile,
        name: 'test',
        date: '2022-01-01',
        amount: 200,
        pct: 20
      }

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
      const formData = {
        file: validFile,
        name: 'test',
        date: '2022-01-01',
        amount: 200,
        pct: 20
      }

      Object.defineProperty(window, 'FormData', { value: class { } })
      Object.defineProperty(window, 'FileReader', { value: class { } })

      form.addEventListener('submit', handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})
