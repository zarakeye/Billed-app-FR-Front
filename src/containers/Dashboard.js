import { formatDate } from '../app/format.js'
import DashboardFormUI from '../views/DashboardFormUI.js'
import BigBilledIcon from '../assets/svg/big_billed.js'
import { ROUTES_PATH } from '../constants/routes.js'
import USERS_TEST from '../constants/usersTest.js'
import Logout from "./Logout.js"

export const filteredBills = (data, status) => {
  return (data && data.length) ?
    data.filter(bill => {
      let selectCondition

      // in jest environment
      if (typeof jest !== 'undefined') {
        selectCondition = (bill.status === status)
      }
      /* istanbul ignore next */
      else {
        // in prod environment
        const userEmail = JSON.parse(localStorage.getItem("user")).email
        selectCondition =
          (bill.status === status) &&
          ![...USERS_TEST, userEmail].includes(bill.email)
      }

      return selectCondition
    }) : []
}

export const card = (bill) => {
  const firstAndLastNames = bill.email.split('@')[0]
  const firstName = firstAndLastNames.includes('.') ?
    firstAndLastNames.split('.')[0] : ''
  const lastName = firstAndLastNames.includes('.') ?
  firstAndLastNames.split('.')[1] : firstAndLastNames

  return (`
    <div class='bill-card' id='open-bill${bill.id}' data-testid='open-bill${bill.id}'>
      <div class='bill-card-name-container'>
        <div class='bill-card-name'> ${firstName} ${lastName} </div>
        <span class='bill-card-grey'> ... </span>
      </div>
      <div class='name-price-container'>
        <span> ${bill.name} </span>
        <span> ${bill.amount} € </span>
      </div>
      <div class='date-type-container'>
        <span> ${formatDate(bill.date)} </span>
        <span> ${bill.type} </span>
      </div>
    </div>
  `)
}

export const cards = (bills) => {
  return bills && bills.length ? bills.map(bill => card(bill)).join("") : ""
}

export const getStatus = (index) => {
  switch (index) {
    case 1:
      return "pending"
    case 2:
      return "accepted"
    case 3:
      return "refused"
  }
}

export default class {
  constructor({ document, onNavigate, store, bills, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    $('#arrow-icon1').click((e) => this.handleShowTickets(e, bills, 1))
    $('#arrow-icon2').click((e) => this.handleShowTickets(e, bills, 2))
    $('#arrow-icon3').click((e) => this.handleShowTickets(e, bills, 3))
    new Logout({ localStorage, onNavigate })
  }

  handleClickIconEye = () => {
    const billUrl = $('#icon-eye-d').attr("data-bill-url")
    const imgWidth = Math.floor($('#modaleFileAdmin1').width() * 0.8)
    $('#modaleFileAdmin1').find(".modal-body").html(`<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} alt="Bill"/></div>`)
    if (typeof $('#modaleFileAdmin1').modal === 'function') $('#modaleFileAdmin1').modal('show')
  }

/*************  ✨ Codeium Command ⭐  *************/
  /**
   * Function called when the edit button of a ticket is clicked.
   * It displays the form or the big billed icon depending on the counter.
   * It also sets the click event on the icon eye, accept and refuse button.
   * 
   * @param {Event} e - The event object.
   * @param {Object} bill - The bill object.
   * @param {Array} bills - The array of bills.
   */
/******  cba3f3db-f1df-4133-ab8b-319b73362c87  *******/
  handleEditTicket(e, bill, bills) {
    if (this.id !== bill.id) this.editCounter = 0
    if (this.id === undefined || this.id !== bill.id) this.id = bill.id

    const billContainer = $(`#open-bill${bill.id}`).parent()[0]
    const billID = billContainer.id
    const billIDSplitted = billID.split('-')
    let billStatus = billIDSplitted[billIDSplitted.length - 1]
    console.log('billStatus = ', billStatus)

    let index;
    switch (billStatus) {
      case 'container1':
        index = 1
        break
      case 'container2':
        index = 2
        break
      case 'container3':
        index = 3
        break
    }

    if (this.editCounter % 2 === 0) {
      e.stopPropagation()
      console.log(`this.counter = ${this.counter}, this.editCounter = ${this.editCounter} : Bill opened`)
      bills.forEach(b => $(`#open-bill${b.id}`).css({ background: '#0D5AE5' }))
      $(`#open-bill${bill.id}`).css({ background: '#2A2B35' })
      $('.dashboard-right-container div').html(DashboardFormUI(bill))
      $('.vertical-navbar').css({ height: '150vh' })
      
      if (this.index !== index) {
        this.index = index
        (this.editCounter % 2 === 0) ? this.editCounter ++ : this.editCounter += 2
        this.counter = 0
      } else {
        (this.editCounter % 2 === 0) ? this.editCounter ++ : this.editCounter += 2
        // this.counter = 0
        bills.forEach(b => $(`#open-bill${b.id}`).css({ background: '#0D5AE5' }))
        $(`#open-bill${bill.id}`).css({ background: '#2A2B35' })
        $('.dashboard-right-container div').html(DashboardFormUI(bill))
        $('.vertical-navbar').css({ height: '150vh' })
      }
      
      // this.counter = 0
      console.log('bill status = ', this.index)
      // this.editCounter ++
    } else {
      e.stopPropagation()
      console.log(`editCounter === ${this.editCounter} : Bill close`)
      $(`#open-bill${bill.id}`).css({ background: '#0D5AE5' })

      $('.dashboard-right-container div').html(`
        <div id="big-billed-icon" data-testid="big-billed-icon"> ${BigBilledIcon} </div>
      `)
      $('.vertical-navbar').css({ height: '120vh' })

      this.index = index
      this.editCounter ++
    }
    $('#icon-eye-d').click(this.handleClickIconEye)
    $('#btn-accept-bill').click((e) => this.handleAcceptSubmit(e, bill))
    $('#btn-refuse-bill').click((e) => this.handleRefuseSubmit(e, bill))
  }

  handleAcceptSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: 'accepted',
      commentAdmin: $('#commentary2').val()
    }
    this.updateBill(newBill)
    this.onNavigate(ROUTES_PATH['Dashboard'])
  }

  handleRefuseSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: 'refused',
      commentAdmin: $('#commentary2').val()
    }
    this.updateBill(newBill)
    this.onNavigate(ROUTES_PATH['Dashboard'])
  }

  handleShowTickets(e, bills, index) {
    // this.counter ++;
    if (this.counter === undefined || this.index !== index) this.counter = 0
    if (this.counter % 2 !== 0 && this.index !== index) {
      this.counter = 1
      this.index = index
    }
    if (this.index === undefined || this.index !== index) this.index = index
    if (this.counter % 2 === 0 && this.index === index) {
      console.log('counter = ', this.counter, `counter % 2 = `, this.counter % 2, 'index ouvert')
      
      $(`#arrow-icon${this.index}`).css({ transform: 'rotate(0deg)'})
      $(`#status-bills-container${this.index}`)
        .html(cards(filteredBills(bills, getStatus(this.index))))
      
      bills.forEach(bill => {
        $(`#open-bill${bill.id}`).click((e) => this.handleEditTicket(e, bill, bills))
      })

      

      this.counter ++
      this.index = index
    } else if (this.counter % 2 === 0 && this.index !== index) {
      this.counter ++
      $(`#arrow-icon${this.index}`).css({ transform: 'rotate(90deg)'})
      $(`#status-bills-container${this.index}`)
        .html("")
      this.index = index
    } else if (this.counter % 2 !== 0) {
      console.log(`counter === ${this.counter} : Bill close`)
      console.log('counter = ', this.counter, `counter % 2 = `, this.counter % 2, 'index fermé')
      $(`#arrow-icon${this.index}`).css({ transform: 'rotate(90deg)'})
      $(`#status-bills-container${this.index}`)
        .html("")
      this.counter ++
      this.index = index
    } else if (this.counter % 2 === 0 && this.index !== index) {
      this.counter ++
      console.log(`counter === ${this.counter} : Bill close`)
      console.log('counter = ', this.counter, `counter % 2 = `, this.counter % 2, 'index fermé')
      $(`#arrow-icon${this.index}`).css({ transform: 'rotate(90deg)'})
      $(`#status-bills-container${this.index}`)
        .html("")
      this.counter ++
      this.index = index
    }

    // bills.forEach(bill => {
    //   $(`#open-bill${bill.id}`).click((e) => this.handleEditTicket(e, bill, bills, this.index))
    // })

    return bills
  }

  getBillsAllUsers = () => {
    if (this.store) {
      return this.store
      .bills()
      .list()
      .then(snapshot => {
        const bills = snapshot
        .map(doc => ({
          id: doc.id,
          ...doc,
          date: doc.date,
          status: doc.status
        }))
        return bills
      })
      .catch(error => {
        throw error;
      })
    }
  }

  // not need to cover this function by tests
  /* istanbul ignore next */
  updateBill = (bill) => {
    if (this.store) {
    return this.store
      .bills()
      .update({data: JSON.stringify(bill), selector: bill.id})
      .then(bill => bill)
      .catch(console.log)
    }
  }
}
