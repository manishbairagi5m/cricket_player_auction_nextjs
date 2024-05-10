'use client'
import * as React from 'react';
import Spinner from 'react-bootstrap/Spinner'

interface IAppProps {
}

export default function Loader (props: IAppProps) {
  return (
    <div className='loader-page'>
       <Spinner animation="border" variant="light" />
    </div>
  );
}
