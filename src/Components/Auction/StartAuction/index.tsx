import SimpleCard from '@/Components/StyledComponents/SimpleCard';
import { Container } from '@mui/material';
import * as React from 'react';

export interface IStartAuctionProps {
}

export default function StartAuction (props: IStartAuctionProps) {
  return (
    <Container>
      <SimpleCard>

      <div className='bidding-spinner'>
        <div className='bidding-spinner-center'></div>
      </div>

      </SimpleCard>
    </Container>
  );
}
