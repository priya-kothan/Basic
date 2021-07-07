import React from 'react'

const FFFormlogo = (imagename) => {
  if (imagename.imagename === 'Details') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="18"
        viewBox="0 0 20 18"
        fill="none"
      >
        <path
          d="M15 8H18C19.11 8 20 7.1 20 6V2C20 0.89 19.1 0 18 0H15C13.89 0 13 0.9 13 2V3H7.01V2C7.01 0.89 6.11 0 5.01 0H2C0.9 0 0 0.9 0 2V6C0 7.11 0.9 8 2 8H5C6.11 8 7 7.1 7 6V5H9V12.01C9 13.66 10.34 15 11.99 15H13V16C13 17.11 13.9 18 15 18H18C19.11 18 20 17.1 20 16V12C20 10.89 19.1 10 18 10H15C13.89 10 13 10.9 13 12V13H11.99C11.45 13 11 12.55 11 12.01V5H13V6C13 7.1 13.9 8 15 8Z"
          fill="white"
        />
      </svg>
    )
  }
  if (imagename.imagename === 'Components') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="16"
        viewBox="0 0 18 16"
        fill="none"
      >
        <path
          d="M1 12H4C4.55 12 5 11.55 5 11C5 10.45 4.55 10 4 10H1C0.45 10 0 10.45 0 11C0 11.55 0.45 12 1 12ZM7.5 12H10.5C11.05 12 11.5 11.55 11.5 11C11.5 10.45 11.05 10 10.5 10H7.5C6.95 10 6.5 10.45 6.5 11C6.5 11.55 6.95 12 7.5 12ZM14 12H17C17.55 12 18 11.55 18 11C18 10.45 17.55 10 17 10H14C13.45 10 13 10.45 13 11C13 11.55 13.45 12 14 12ZM1 16C1.55 16 2 15.55 2 15C2 14.45 1.55 14 1 14C0.45 14 0 14.45 0 15C0 15.55 0.45 16 1 16ZM5 16C5.55 16 6 15.55 6 15C6 14.45 5.55 14 5 14C4.45 14 4 14.45 4 15C4 15.55 4.45 16 5 16ZM9 16C9.55 16 10 15.55 10 15C10 14.45 9.55 14 9 14C8.45 14 8 14.45 8 15C8 15.55 8.45 16 9 16ZM13 16C13.55 16 14 15.55 14 15C14 14.45 13.55 14 13 14C12.45 14 12 14.45 12 15C12 15.55 12.45 16 13 16ZM17 16C17.55 16 18 15.55 18 15C18 14.45 17.55 14 17 14C16.45 14 16 14.45 16 15C16 15.55 16.45 16 17 16ZM1 8H7C7.55 8 8 7.55 8 7C8 6.45 7.55 6 7 6H1C0.45 6 0 6.45 0 7C0 7.55 0.45 8 1 8ZM11 8H17C17.55 8 18 7.55 18 7C18 6.45 17.55 6 17 6H11C10.45 6 10 6.45 10 7C10 7.55 10.45 8 11 8ZM0 1V3C0 3.55 0.45 4 1 4H17C17.55 4 18 3.55 18 3V1C18 0.45 17.55 0 17 0H1C0.45 0 0 0.45 0 1Z"
          fill="white"
        />
      </svg>
    )
  }
  if (imagename.imagename === 'Entity Fields') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="18"
        viewBox="0 0 19 18"
        fill="none"
      >
        <path
          d="M7 7.02H12V18H7V7.02ZM14 18H17C18.1 18 19 17.1 19 16V7H14V18ZM17 0H2C0.9 0 0 0.9 0 2V5H19V2C19 0.9 18.1 0 17 0ZM0 16C0 17.1 0.9 18 2 18H5V7H0V16Z"
          fill="white"
        />
      </svg>
    )
  }
}

export default FFFormlogo