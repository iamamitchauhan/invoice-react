import React, { useEffect, useState } from 'react'
import moment from "moment"

import InvoiceService from '../../services/invoice'
import Button from '../../components/Button'
import Th from '../../components/Th'
import Loader from '../../components/Loader'
import Error from '../../components/Error'

import { INVOICE_STATUS } from '../../shared/constants'
import { useDebounce } from '../../hooks/useDebounce'

import "../../assets/invoice.css"

const Invoice = () => {
  const [invoices, setInvoices] = useState([])
  const [page, setPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [limit,] = useState(10)
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [sortBy, setSortBy] = useState({ name: "status", order: "ASC" })
  const [date, setDate] = useState("")

  const searchQuery = useDebounce(search, 800)

  const getInvoiceList = async () => {
    try {
      setIsLoading(true)

      const payload = {
        "page": page,
        "limit": limit,
        "search": searchQuery,
        "date": date,
        "sortBy": { [sortBy.name]: sortBy.order === "ASC" ? 1 : -1 }
      }
      const invoice = new InvoiceService();
      const { data, totalPages } = await invoice.fetchInvoice(payload)

      setInvoices(data)
      setTotalPage(totalPages)
      setError("")

    } catch (error) {
      console.error('error =>', error);
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getInvoiceList()
  }, [searchQuery, page, sortBy, date])

  const onPrevious = () => {
    if (page > 0) {
      setPage(prev => { return prev - 1 })
    }
  }

  const onNext = () => {
    if (page <= totalPage) {
      setPage(prev => { return prev + 1 })
    }
  }

  const renderActionButton = (type) => {
    switch (type) {
      case "NOT_SCHEDULED":
        return <Button label="Collect" />
      case "CANCELLED":
        return <Button label="Collect" />
      case "PENDING":
        return <Button label="Cancel Payment" />
      case "FAILED":
        return <Button label="Retry" />
      case "INSTALLMENT_N_OF_PAID":
        return <Button label="Manage" />

      default:
        return <></>
    }
  }

  return (
    <div>
      <h1>Invoice</h1>
      <div>
        <div>
          <input type="text"
            placeholder='Search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>
        <input type="date" onChange={(e) => {
          setDate(e.target.value)
        }} />
        <button onClick={() => setDate("")} title="Clear date filter">Clear Date</button>
      </div>
      <div className='invoice-wrapper'>
        {<table border="1">
          <thead>
            <tr>
              <Th name="reference" sortBy={sortBy} onSorting={setSortBy}>Reference</Th>
              <Th name="customer" sortBy={sortBy} onSorting={setSortBy}>Customer</Th>
              <Th name="status" sortBy={sortBy} onSorting={setSortBy}>Status</Th>
              <Th name="invoice_date" sortBy={sortBy} onSorting={setSortBy}>Invoice date</Th>
              <Th name="due_date" sortBy={sortBy} onSorting={setSortBy}>Due date</Th>
              <Th name="invoice_amount" sortBy={sortBy} onSorting={setSortBy}>Invoice amount</Th>
              <Th name="amount_due" sortBy={sortBy} onSorting={setSortBy}>Amount due</Th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody style={{ position: "relative" }}>
            {

              isLoading ? <tr>
                <td colSpan={8}>
                  <Loader />
                </td>
              </tr> : error ? <tr>
                <td colSpan={8}>
                  <Error msg={error} />
                </td>
              </tr>
                :
                invoices.length > 0 ? invoices.map((invoice, index) => <tr key={index}>
                  <td>{invoice.reference}</td>
                  <td>{invoice.customer}</td>
                  <td>
                    {INVOICE_STATUS[invoice.status] && <div style={{ textAlign: "center" }}><span className={`chip ${invoice.status}`}>{INVOICE_STATUS[invoice.status] || ""}</span></div>}
                  </td>
                  <td>{moment(invoice.invoice_date).format("DD-MM-YYYY")}</td>
                  <td>{moment(invoice.due_date).format("DD-MM-YYYY")}</td>
                  <td>{invoice.invoice_amount}</td>
                  <td>{invoice.amount_due}</td>
                  <td>{renderActionButton(invoice.status)}</td>
                </tr>) :
                  <tr><td colSpan={8}><p>No Record found</p></td></tr>
            }
          </tbody>
        </table>
        }

        <div>
          <Button label="<" onClick={onPrevious} disabled={page <= 0} />
          {`${page + 1} of ${totalPage}`}
          <Button label=">" onClick={onNext} disabled={page >= totalPage - 1} />
        </div>
      </div>
    </div >
  )
}

export default Invoice