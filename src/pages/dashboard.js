import React from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

const Sidebar = () => {
  return (
    <div className='mt-32'>
      <Menu>
        <MenuButton>My account</MenuButton>
        <MenuItems anchor='bottom'>
          <MenuItem>
            <a className='block data-focus:bg-blue-100' href='/settings'>
              Settings
            </a>
          </MenuItem>
          <MenuItem>
            <a className='block data-focus:bg-blue-100' href='/support'>
              Support
            </a>
          </MenuItem>
          <MenuItem>
            <a className='block data-focus:bg-blue-100' href='/license'>
              License
            </a>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  )
}

export default Sidebar
