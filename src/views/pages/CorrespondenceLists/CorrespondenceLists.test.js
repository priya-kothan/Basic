import React from 'react'
import { render } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { QueryClientProvider, QueryClient } from 'react-query'

import { handlers } from '../../../../test/server-handlers'
import CorrespondenceLists from './CorrespondenceLists'

const server = setupServer(...handlers)

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {}) // When console.error is called, jest will call the callback function passed to the 'mockImplementation' function which does nothing. So that error wont be displayed in the console.
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

test('Correspondence Lists - should load the grid', () => {
  const { container } = render(
    <QueryClientProvider client={queryClient}>
      <CorrespondenceLists />
    </QueryClientProvider>
  )

  expect(container.querySelector('.ag-theme-balham')).toBeInTheDocument()
})
