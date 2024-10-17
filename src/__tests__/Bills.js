/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import Bills from "../containers/Bills.js"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";

jest.mock('../app/Store', () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains('active-icon')).toBeTruthy()
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  describe("When I am on Bills Page and I click on the icon eye,", () => {
    test("Then a modal should open", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      
      document.body.innerHTML = BillsUI({ data: bills })
    //   /**
    //    * Navigates to the desired page by changing the innerHTML of the document's body
    //    * @param {string} pathname the path to navigate to
    //    */
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const billsPage = new Bills({ document, onNavigate, store , localStorage: window.localStorage})
      
      
      await waitFor(() => screen.getAllByTestId('icon-eye'))
      const eyes = screen.getAllByTestId('icon-eye')

      eyes.forEach(eye =>{
        const handleClickIconEye_test = jest.fn(() => billsPage.handleClickIconEye(eye))
        eye.addEventListener('click', handleClickIconEye_test)

        userEvent.click(eye)
        expect(handleClickIconEye_test).toHaveBeenCalled()
        expect(screen.getByTestId('modaleProof')).toBeTruthy()
      })
    })
  })


  // test d'intégration GET Bills
  describe("When I am on Bills Page and I click on the New Bill button,", () => {
    test("Then I should be on NewBill Page", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const billsPage = new Bills({ document, onNavigate, localStorage: window.localStorage, store: null })
      const handleClickNewBill_test = jest.fn(() => billsPage.handleClickNewBill())
      const buttonNewBill = screen.getByTestId('btn-new-bill')
      buttonNewBill.addEventListener('click', handleClickNewBill_test)
      userEvent.click(buttonNewBill)
      expect(handleClickNewBill_test).toHaveBeenCalled()
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
    })
  })

  describe("When I navigate to Bills Page", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: 'a@a' }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText('Mes notes de frais'))
      const contentPending  = screen.getAllByText('En attente')
      expect(screen.getAllByText('En attente')).toBeTruthy()
      const contentRefused  = screen.getAllByText('Refused')
      expect(screen.getAllByText('Refused')).toBeTruthy()
    })

    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
            window,
            'localStorage',
            { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })

      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"))
            }
          }
        })
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick)
        const message = screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })

      test("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"))          
            }
          }
        })

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  })
})