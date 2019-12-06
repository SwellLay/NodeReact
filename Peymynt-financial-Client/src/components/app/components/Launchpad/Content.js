import React from 'react';

export const invoicing = {
  heading: 'Professional invoicing',
  info: 'It’s more than just a way to say "pay me"',
  subHeading: 'The care and detail you put into invoicing can do wonders for your brand and future business. Take these quick actions to show customers the best you have to offer.',
  items: [
    {
      link: '/app/estimates/add',
      icon: (<svg viewBox="0 0 80 80" className="py-icon" id="decor--document-add" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
          <circle cx="40" cy="40" r="38" fill="#442F8C" fillRule="nonzero" />
          <path fill="#FFF" fillRule="nonzero"
            d="M57 20v40c0 2.374-1.86 4-4.155 4h-27.69C22.86 64 21 62.075 21 59.7V27.104L32 16h20.793a4.083 4.083 0 0 1 2.972 1.24C56.555 18.048 57 18.85 57 20z" />
          <path fill="#7FB2FF" fillRule="nonzero" d="M32 16v5.884A5.113 5.113 0 0 1 26.89 27H21l11-11z" />
          <circle cx="55" cy="49" r="10" fill="#442F8C" />
          <path fill="#7FB2FF"
            d="M56 48v-3.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V48h-3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H54v3.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V50h3.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H56zm-8.388-2.068a8 8 0 1 1 14.776 6.136 8 8 0 0 1-14.776-6.136z" />
        </g>
      </svg>),
      label: 'Create estimates',
    },
    {
      link: '/app/invoices/add',
      icon: (<svg viewBox="0 0 80 80" className="py-icon" id="decor--document-invoice" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="nonzero">
          <circle cx="40" cy="40" r="38" fill="#442F8C" />
          <path fill="#FFF"
            d="M58 20.3v39.4c0 2.375-1.86 4.3-4.155 4.3h-27.69C23.86 64 22 62.075 22 59.7V27.104L33 16h20.793a4.083 4.083 0 0 1 2.972 1.24A4.375 4.375 0 0 1 58 20.3zM38.405 54.19a.655.655 0 0 0 .465.18h2.274a.635.635 0 0 0 .474-.192.66.66 0 0 0 .187-.482v-1.864a8.187 8.187 0 0 0 4.547-1.905 4.977 4.977 0 0 0 1.695-3.863c.149-1.977-1.006-3.815-2.832-4.505a17.073 17.073 0 0 0-3.937-1.105 11.856 11.856 0 0 1-2.914-.895 1.359 1.359 0 0 1-.786-1.21 1.323 1.323 0 0 1 .61-1.18 3.68 3.68 0 0 1 3.317 0c.389.192.686.533.827.948a.967.967 0 0 0 .889.484h3.658a.513.513 0 0 0 .393-.179.596.596 0 0 0 .155-.41 4.165 4.165 0 0 0-.713-2.042 6.25 6.25 0 0 0-1.933-1.874 8.001 8.001 0 0 0-2.986-1.137v-1.926a.648.648 0 0 0-.186-.474.634.634 0 0 0-.476-.189H38.86a.655.655 0 0 0-.662.663v1.821a7.112 7.112 0 0 0-4.133 1.884 4.97 4.97 0 0 0-1.54 3.663 4.567 4.567 0 0 0 1.54 3.748 10.597 10.597 0 0 0 4.733 1.936 23.87 23.87 0 0 1 2.5.632c.476.108.926.312 1.323.6.266.227.417.563.414.916a1.36 1.36 0 0 1-.775 1.22 4.476 4.476 0 0 1-2.191.443 3.082 3.082 0 0 1-2.987-1.474 1.724 1.724 0 0 0-.423-.368 1.018 1.018 0 0 0-.527-.116h-3.493a.594.594 0 0 0-.414.168.52.52 0 0 0-.165.4c.035.847.292 1.668.744 2.38a5.575 5.575 0 0 0 2.067 1.883 9.28 9.28 0 0 0 3.338 1.053v1.884a.67.67 0 0 0 .196.484z" />
          <path fill="#7FB2FF" d="M33 16v5.884A5.113 5.113 0 0 1 27.89 27H22l11-11z" />
        </g>
      </svg>),
      label: 'Create invoices',
    },
    {
      link: '/app/payments',
      icon: (
        <svg viewBox="0 0 80 80" className="py-icon" id="decor--payments-credit-card" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fillRule="nonzero">
            <circle cx="40" cy="40" r="38" fill="#442F8C" />
            <path fill="#FFF"
              d="M17 36h46v14a5 5 0 0 1-5 5H22a5 5 0 0 1-5-5V36zm46-6H17v-1a5 5 0 0 1 5-5h36a5 5 0 0 1 5 5v1z" />
            <path fill="#7FB2FF" d="M21 39h18v4H21z" />
          </g>
        </svg>),
      label: 'Accept payments',
    },
    {
      link: '/app/setting/invoice-customization',
      icon: (<svg viewBox="0 0 80 80" className="py-icon" id="decor--customize" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="nonzero">
          <circle cx="40" cy="40" r="38" fill="#442F8C" />
          <path fill="#FFF"
            d="M59.12 56H20.88c-1.038 0-1.88-.895-1.88-2s.842-2 1.88-2h38.24c1.038 0 1.88.895 1.88 2s-.842 2-1.88 2zm0-14H20.88c-1.038 0-1.88-.895-1.88-2s.842-2 1.88-2h38.24c1.038 0 1.88.895 1.88 2s-.842 2-1.88 2zm0-15H20.88c-1.038 0-1.88-.895-1.88-2s.842-2 1.88-2h38.24c1.038 0 1.88.895 1.88 2s-.842 2-1.88 2z" />
          <path fill="#7FB2FF"
            d="M45 60a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM29 46a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm23-15a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" />
        </g>
      </svg>),
      label: 'Adjust defaults',
    },
    {
      link: '/app/sales/customer/add',
      icon: (<svg viewBox="0 0 80 80" className="py-icon" id="decor--add-user" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
          <circle cx="40" cy="40" r="38" fill="#442F8C" fillRule="nonzero" />
          <path fill="#FFF" fillRule="nonzero"
            d="M40 45c-6.627 0-12-5.373-12-12s5.373-12 12-12 12 5.373 12 12-5.373 12-12 12zm0 2.34c8.81 0 17.62 3.37 17.62 6.72v1.18a2.59 2.59 0 0 1-2.06 2.51 78.43 78.43 0 0 1-15.51 1.3 79.78 79.78 0 0 1-15.6-1.3 2.58 2.58 0 0 1-2.07-2.53v-1.16c0-3.35 8.81-6.72 17.62-6.72z" />
          <circle cx="55" cy="49" r="10" fill="#442F8C" />
          <path fill="#7FB2FF"
            d="M56 48v-3.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V48h-3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H54v3.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V50h3.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H56zm-8.388-2.068a8 8 0 1 1 14.776 6.136 8 8 0 0 1-14.776-6.136z" />
        </g>
      </svg>),
      label: 'Add customers',
    },
    {
      link: '/app/sales/products/add',
      icon: (<svg viewBox="0 0 80 80" className="py-icon" id="decor--shopping-cart" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
          <circle cx="40" cy="40" r="38" fill="#442F8C" fillRule="nonzero" />
          <path fill="#7FB2FF" fillRule="nonzero"
            d="M17 28a2 2 0 1 1 0-4h6a2 2 0 0 1 1.927 1.465l2.5 9a2 2 0 1 1-3.854 1.07L21.48 28H17z" />
          <path fill="#FFF" fillRule="nonzero"
            d="M31 51h-.518a4 4 0 0 1-3.875-3.008L22 30l37.68 1.88a2 2 0 0 1 1.847 2.454l-3.18 13.578A4 4 0 0 1 54.452 51H33v5h18v2H31v-7z" />
          <circle cx="32" cy="57" r="4" fill="#7FB2FF" />
          <circle cx="51" cy="57" r="4" fill="#7FB2FF" />
        </g>
      </svg>),
      label: 'Add products & services',
    },
    {
      link: '/app/recurring/add',
      icon: (<svg viewBox="0 0 80 80" className="py-icon" id="decor--shopping-cart" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
          <circle cx="40" cy="40" r="38" fill="#442F8C" fillRule="nonzero" />
          <path fill="#FFF" fillRule="nonzero"
            d="M58 20.3v39.4c0 2.375-1.86 4.3-4.155 4.3h-27.69C23.86 64 22 62.075 22 59.7V27.104L33 16h20.793a4.083 4.083 0 0 1 2.972 1.24A4.375 4.375 0 0 1 58 20.3zM34.233 51.17l3.306-1.27a1.5 1.5 0 0 0-1.077-2.801l-6.5 2.5a1.5 1.5 0 0 0-.923 1.737l1.5 6.5a1.5 1.5 0 1 0 2.923-.674l-.471-2.041A13.953 13.953 0 0 0 40 57c7.732 0 14-6.268 14-14a2 2 0 1 0-4 0c0 5.523-4.477 10-10 10-2.102 0-4.1-.65-5.767-1.829z" />
          <path fill="#7FB2FF" fillRule="nonzero" d="M33 16v5.884A5.113 5.113 0 0 1 27.89 27H22l11-11z" />
          <path fill="#7FB2FF"
            d="M45.432 34.602A9.95 9.95 0 0 0 40 33c-5.523 0-10 4.477-10 10a2 2 0 1 1-4 0c0-7.732 6.268-14 14-14 2.43 0 4.765.622 6.82 1.77l-.769-2.884a1.5 1.5 0 0 1 2.899-.772l2 7.5a1.5 1.5 0 0 1-1.038 1.828l-7 2a1.5 1.5 0 1 1-.824-2.884l3.344-.956z" />
        </g>
      </svg>),
      label: 'Recurring invoices',
    },
    {
      modal: 'RecordPayment',
      icon: (<svg viewBox="0 0 80 80" className="py-icon" id="decor--shopping-cart" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
          <circle cx="40" cy="40" r="38" fill="#442F8C" fillRule="nonzero" />
          <path fill="#FFF" fillRule="nonzero"
            d="M17.444 41.292a6.398 6.398 0 0 1-1.975-.242 4.348 4.348 0 0 1-2.947 1.18c-1.004.02-1.004-1.52 0-1.52a2.878 2.878 0 0 0 1.352-.35c-1.437-1-2.05-3.79-.465-4.95 2.05-1.49 3.381 1.7 3.244 3.25a3.82 3.82 0 0 1-.243 1c.33.067.666.104 1.004.11v-.61c.317-12.65 9.044-17.12 21.723-17.12a34.913 34.913 0 0 1 13.736 3.33l4.449-3.21a.664.664 0 0 1 .646-.053.6.6 0 0 1 .357.513l.497 6.87c2.284 2.079 3.866 4.611 4.678 7.51h3a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5H63c-1.112 3.1-3.334 5.413-6.238 7.19l-1.628 7.37a.625.625 0 0 1-.612.49h-4.3a.611.611 0 0 1-.614-.53l-.634-4.29a40 40 0 0 1-8.305.82c-3.2.02-6.392-.315-9.509-1l-.983 4.46a.626.626 0 0 1-.623.49h-4.29a.633.633 0 0 1-.623-.53l-1.12-7.62c-3.487-2.47-5.724-6.188-6.077-11.558zM14.92 39.19a.133.133 0 0 1 0-.06 2.356 2.356 0 0 0 .021-1.72c-.285-.78-.676-.91-.866.09-.153.68.193 1.372.845 1.69zm39.18.598a2.955 2.955 0 0 0 2.9-3 3 3 0 1 0-2.9 3z" />
          <path fill="#7FB2FF" stroke="#442F8C" strokeWidth="2"
            d="M33.267 25.018a7 7 0 1 1 11.31.214l-.356.467-.581-.082a35.9 35.9 0 0 0-4.352-.347 55.158 55.158 0 0 0-5.123.17l-.57.045-.328-.467z" />
        </g>
      </svg>),
      label: 'Record payments',
    },
  ]
};

export const bookkeeping = {
  heading: 'Better bookkeeping',
  info: 'Get a clear view of your finances',
  subHeading: 'Bookkeeping doesn\'t have to be daunting — say hello to simpler tax filing and deeper insights. Our machine learning and automation do the heavy lifting as you handle these quick actions.',
  items: [
    {
      link: '#',
      icon: (<svg viewBox="0 0 80 80" className="py-icon" id="decor--document-add" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="nonzero">
          <circle cx="40" cy="40" r="38" fill="#442F8C" />
          <path fill="#FFF"
            d="M21 55v-1.22a1 1 0 0 1 .757-.97l.486-.12a1 1 0 0 0 .757-.97V38.28a1 1 0 0 0-.757-.97l-.486-.12a1 1 0 0 1-.757-.97v-1.21l8-.01v1.22a1 1 0 0 1-.757.97l-.486.12a1 1 0 0 0-.757.97v13.44a1 1 0 0 0 .757.97l.486.12a1 1 0 0 1 .757.97V55h7v-1.22a1 1 0 0 1 .757-.97l.486-.12a1 1 0 0 0 .757-.97V38.28a1 1 0 0 0-.757-.97l-.486-.12a1 1 0 0 1-.757-.97v-1.21l8-.01v1.22a1 1 0 0 1-.757.97l-.486.12a1 1 0 0 0-.757.97v13.44a1 1 0 0 0 .757.97l.486.12a1 1 0 0 1 .757.97V55h7v-1.22a1 1 0 0 1 .757-.97l.486-.12a1 1 0 0 0 .757-.97V38.28a1 1 0 0 0-.757-.97l-.486-.12a1 1 0 0 1-.757-.97v-1.21l8-.01v1.22a1 1 0 0 1-.757.97l-.486.12a1 1 0 0 0-.757.97v13.44a1 1 0 0 0 .757.97l.486.12a1 1 0 0 1 .757.97V55h1.019a2 2 0 0 1 2 2v2H18v-2a2 2 0 0 1 2-2h1zm37-24h2a2 2 0 0 1 2 2v2H18v-2a2 2 0 0 1 2-2h2l16.63-11.614a2.484 2.484 0 0 1 2.66 0L58 31z" />
          <path fill="#7FB2FF" d="M29 31l9.545-6.419a2.535 2.535 0 0 1 2.9 0L51 31H29z" />
        </g>
      </svg>),
      label: 'Import data automatically',
    },
    {
      link: '#',
      icon: (<svg viewBox="0 0 80 80" className="py-icon" id="decor--document-invoice" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
          <circle cx="40" cy="40" r="38" fill="#442F8C" fillRule="nonzero" />
          <path fill="#FFF" fillRule="nonzero"
            d="M60.914 32c1.15 0 2.082.892 2.082 1.993a.868.868 0 0 1 0 .17L60.81 56.226c-.114.992-.977 1.75-2.02 1.774h-37.7c-1.034-.034-1.886-.79-1.999-1.774L17.01 34.113a1.879 1.879 0 0 1 .464-1.429 2.05 2.05 0 0 1 1.39-.684h42.051z" />
          <path fill="#7FB2FF"
            d="M57 27H36a1.894 1.894 0 0 1-1.484-.72l-1.767-2.56a1.884 1.884 0 0 0-1.484-.72h-9.349c-1.066.027-1.916.915-1.916 2v7h39v-2.87c-.026-1.066-.953-2.104-2-2.13z" />
        </g>
      </svg>),
      label: 'Manage transactions',
    },
    {
      link: '#',
      icon: (
        <svg viewBox="0 0 80 80" className="py-icon" id="decor--payments-credit-card" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fillRule="nonzero">
            <circle cx="40" cy="40" r="38" fill="#442F8C" />
            <path fill="#FFF"
              d="M58 16v48l-6-3-6 3-6-3-6 3-6-3-6 3V16l6 3 6-3 6 3 6-3 6 3 6-3zM47 50a2 2 0 1 0 0 4h3a2 2 0 1 0 0-4h-3zm0-8a2 2 0 1 0 0 4h3a2 2 0 1 0 0-4h-3zm-17 0a2 2 0 1 0 0 4h10a2 2 0 1 0 0-4H30zm17-8a2 2 0 1 0 0 4h3a2 2 0 1 0 0-4h-3zm-17 0a2 2 0 1 0 0 4h10a2 2 0 1 0 0-4H30zm17-8a2 2 0 1 0 0 4h3a2 2 0 1 0 0-4h-3zm-17 0a2 2 0 1 0 0 4h10a2 2 0 1 0 0-4H30z" />
          </g>
        </svg>),
      label: 'Scan receipts',
    },
    {
      link: '#',
      icon: (<svg viewBox="0 0 80 80" className="py-icon" id="decor--customize" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
          <circle cx="40" cy="40" r="38" fill="#442F8C" fillRule="nonzero" />
          <path fill="#FFF"
            d="M51.67 44.355c-1.645 0-2.657 1.91-2.657 5.069 0 3.158 1.012 5.042 2.658 5.042 1.645 0 2.658-1.884 2.658-5.042 0-3.159-1.013-5.069-2.658-5.069zm-8.328 5.094c0-5.832 3.24-9.525 8.329-9.525 5.114 0 8.329 3.693 8.329 9.525C60 55.307 56.785 59 51.67 59c-5.088 0-8.328-3.693-8.328-9.55zM28.329 25.432c-1.645 0-2.658 1.91-2.658 5.068 0 3.159 1.013 5.043 2.658 5.043s2.658-1.884 2.658-5.043c0-3.158-1.013-5.068-2.658-5.068zM25.702 59c-.96 0-1.514-1.097-.948-1.877l24.89-34.89A2.978 2.978 0 0 1 52.054 21h2.275c.96 0 1.515 1.097.949 1.877L30.412 57.766A2.979 2.979 0 0 1 28 59h-2.298zM20 30.526C20 24.693 23.24 21 28.329 21c5.114 0 8.329 3.693 8.329 9.526 0 5.858-3.215 9.525-8.329 9.525-5.089 0-8.329-3.667-8.329-9.525z" />
        </g>
      </svg>),
      label: 'Add sales tax',
    },
    {
      link: '#',
      icon: (<svg viewBox="0 0 80 80" className="py-icon" id="decor--add-user" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="nonzero">
          <circle cx="40" cy="40" r="38" fill="#442F8C" />
          <path fill="#FFF"
            d="M59.12 56H20.88c-1.038 0-1.88-.895-1.88-2s.842-2 1.88-2h38.24c1.038 0 1.88.895 1.88 2s-.842 2-1.88 2zm0-14H20.88c-1.038 0-1.88-.895-1.88-2s.842-2 1.88-2h38.24c1.038 0 1.88.895 1.88 2s-.842 2-1.88 2zm0-15H20.88c-1.038 0-1.88-.895-1.88-2s.842-2 1.88-2h38.24c1.038 0 1.88.895 1.88 2s-.842 2-1.88 2z" />
          <path fill="#7FB2FF"
            d="M45 60a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM29 46a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm23-15a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" />
        </g>
      </svg>),
      label: 'Customize accounts',
    },
    {
      link: '#',
      icon: (<svg viewBox="0 0 80 80" className="py-icon" id="decor--shopping-cart" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
          <circle cx="40" cy="40" r="38" fill="#442F8C" fillRule="nonzero" />
          <path fill="#FFF" fillRule="nonzero"
            d="M24.504 53.616c-3.576 0-6.476-2.825-6.476-6.308 0-3.484 2.9-6.308 6.476-6.308 3.577 0 6.476 2.824 6.476 6.308 0 3.483-2.9 6.308-6.476 6.308zm0 1.225h-.017c4.757 0 9.513 1.773 9.513 3.53v.62a1.341 1.341 0 0 1-1.107 1.316 42.67 42.67 0 0 1-8.389.687 43.514 43.514 0 0 1-8.388-.687A1.35 1.35 0 0 1 15 58.984v-.613c0-1.757 4.756-3.53 9.504-3.53z" />
          <path fill="#7FB2FF"
            d="M54.508 28.616c-3.575 0-6.473-2.825-6.473-6.308 0-3.484 2.898-6.308 6.473-6.308 3.575 0 6.473 2.824 6.473 6.308 0 3.483-2.898 6.308-6.473 6.308zm0 1.225H54.5c4.746 0 9.5 1.773 9.5 3.53v.62a1.358 1.358 0 0 1-1.115 1.316 42.633 42.633 0 0 1-8.385.687 43.554 43.554 0 0 1-8.385-.687A1.357 1.357 0 0 1 45 33.984v-.613c0-1.757 4.754-3.53 9.508-3.53z" />
          <path fill="#FFF" fillRule="nonzero"
            d="M40 15a2 2 0 1 1 0 4c-.613 0-1.222.026-1.827.078a2 2 0 0 1-.343-3.985A25.301 25.301 0 0 1 40 15zm-10.551 2.33a2 2 0 1 1 1.69 3.625 20.93 20.93 0 0 0-1.62.843 2 2 0 1 1-1.999-3.465 24.93 24.93 0 0 1 1.929-1.003zm-8.577 6.572a2 2 0 1 1 3.06 2.577c-.393.466-.765.948-1.116 1.446a2 2 0 1 1-3.27-2.302c.417-.593.86-1.167 1.326-1.721zm-5.033 9.652a2 2 0 0 1 3.866 1.029 20.86 20.86 0 0 0-.392 1.782 2 2 0 0 1-3.94-.687c.124-.716.28-1.425.466-2.124z" />
          <path fill="#7FB2FF"
            d="M40 65a2 2 0 1 1 0-4c.613 0 1.222-.026 1.827-.078a2 2 0 0 1 .343 3.985c-.719.062-1.443.093-2.17.093zm10.551-2.33a2 2 0 1 1-1.69-3.625 20.93 20.93 0 0 0 1.62-.843 2 2 0 1 1 1.999 3.465 24.93 24.93 0 0 1-1.929 1.003zm8.577-6.572a2 2 0 1 1-3.06-2.577c.393-.466.765-.948 1.116-1.446a2 2 0 1 1 3.27 2.302c-.417.593-.86 1.167-1.326 1.721zm5.033-9.652a2 2 0 0 1-3.866-1.029 20.86 20.86 0 0 0 .392-1.782 2 2 0 0 1 3.94.687 24.86 24.86 0 0 1-.466 2.124z" />
        </g>
      </svg>),
      label: 'Hire an expert',
    },
  ]
};

