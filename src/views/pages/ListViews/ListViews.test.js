import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { setupServer } from 'msw/node'

import { handlers } from '../../../../test/server-handlers'
import ListViews from './ListViews'

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

describe('List view', async () => {
  test('should load the grid', async () => {
    await act(async () => {
      await render(<ListViews location={{ state: { entity: 'Case' } }} />)
    })

    screen.debug()
  })
})
