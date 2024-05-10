import { Card } from '@mui/material';
import { Box, styled } from '@mui/system';

const CardRoot = styled(Card)(() => ({
  height: '100%',
  padding: '10px 24px 20px 24px',
}));

const CardTitle = styled('div')(({}) => ({
  fontSize: '1.5rem',
  fontWeight: '500',
  textTransform: 'capitalize',
}));

const SimpleCard = ({ children, title, subtitle }) => {
  return (
    <CardRoot elevation={6}>
      <CardTitle subtitle={subtitle}>{title}</CardTitle>
      {subtitle && <Box sx={{ mb: 2 }}>{subtitle}</Box>}
      {children}
    </CardRoot>
  );
};

export default SimpleCard;
