import history from 'customHistory';
import React, { PureComponent } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

// OnClick : https://github.com/react-bootstrap-table/react-bootstrap-table2/issues/302

class DataTableWrapper extends PureComponent {


  componentDidMount() {
    let elem = document.getElementById('pageDropDown');
    let dropdownElem = elem.nextSibling;
    elem.addEventListener('click', (e) => {
      if (dropdownElem && dropdownElem.style) {
        dropdownElem.style.display = 'block'
      }
    });
    document.addEventListener('mousedown', (e) => {
      if (dropdownElem && dropdownElem.style) {
        dropdownElem.style.display = 'none'
      }
    })
  }

  componentWillUnmount() {
    let elem = document.getElementById('pageDropDown');
    elem.removeEventListener('click', (e) => {
      let menus = document.getElementsByClassName('dropdown-menu');
      menus[menus.length - 1].style.display = 'block'
    });
    document.removeEventListener('mousedown', (e) => {
      let menus = document.getElementsByClassName('dropdown-menu');
      menus[menus.length - 1].style.display = 'none'
    })
  }

  getLinkUrl = (_id, status) => {
    if(_id && status){
      if(status == 'Online' || status == 'Offline'){
        return '/app/sales/checkouts/share/'+_id
      } else if(status == 'Draft'){
        return '/app/sales/checkouts/edit/'+_id
      } else return '1';
    } else {
      return '2'
    }
}

  render() {
    const { columns, data, defaultSorted } = this.props;
    const pagination = paginationFactory({
      paginationSize: 10,
      // makes 10 as default
      sizePerPage:10,
      sizePerPageList: [{
        text: '5', value: 5
      }, {
        text: '10', value: 10
      }, {
        text: '25', value: 25
      }, {
        text: '50', value: 50
      }, {
        text: '100', value: 100
      }]
    });
    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        const { from } = this.props;
        if(e.target.id !== 'open-menu' && e.target.id !== 'action' && e.target.id !== 'dropIcon' && e.target.id !== 'textaction' && !e.target.id.includes('dropItem')){
          if(!!from){
            if(from.includes('invoice')){
              history.push(`/app/invoices/view/${row._id}`)
            }
            if(from.includes('estimate')){
              history.push(`/app/estimates/view/${row._id}`)
            }
            if(from.includes('recurring')){
              history.push(`/app/recurring/view/${row._id}`)
            }
            if(from.includes('checkout')){
              if(row.status !=="Archived"){
                history.push(this.getLinkUrl(row._id, row.status))
              }
           
            }
          }
        }

        // Before performing any action on row click, please check from which screen this row/table belongs
        // Else the click event will get applied to all screens
        console.log("row", row, e.target.id, rowIndex);
      }
    };

    const rowClass = (row, rowIndex) => {
      return 'py-table__row';
    };
    
    return (
      <div>
      <BootstrapTable
        keyField="id"
        data={data}
        rowEvents={rowEvents}
        columns={columns}
        rowClasses={rowClass}
        classes="py-table"
        hover
        defaultSorted={defaultSorted}
        pagination={pagination}
        {...this.props}
      />
      </div>
    );
  }
}
export default DataTableWrapper;
