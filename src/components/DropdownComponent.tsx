import React from 'react'
import {Dropdown} from 'react-bootstrap';
import { DropdownButton } from "react-bootstrap";

// import DropdownButton from 'react-bootstrap/DropdownButton';
export default function DropdownComponent() {
  return (
    <DropdownButton id="dropdown-basic-button" title="Dropdown button">
      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
      <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
    </DropdownButton>

  )
}
